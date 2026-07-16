import { getCheckoutOfferById } from "@shared/commerce/offers";
import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";
import type { Request, Response, Router } from "express";
import {
  createInMemoryPracticeInquiryStore,
  createPostgresPracticeInquiryStore,
  preparePracticeInquiryRecord,
  sendPracticeInquiryNotification,
  type PracticeInquiryInput,
  type PracticeInquiryStore,
} from "../commerce/practiceInquiryStore";
import {
  createInMemoryLearnerInterestStore,
  createPostgresLearnerInterestStore,
  prepareLearnerInterestRecord,
  sendLearnerInterestNotification,
  type LearnerInterestInput,
  type LearnerInterestStore,
} from "../commerce/learnerInterestStore";
import {
  buildCheckoutReturnUrls,
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "../commerce/stripeCheckout";
import {
  getAuthEnvironmentStatus,
  getCommerceEnvironmentStatus,
} from "../config/environment";
import { getPaidCheckoutGateStatus } from "../config/paidCheckoutGate";
import { createRateLimitMiddleware } from "../config/rateLimit";
import { getLaunchDatabaseReadiness } from "../db/launchDatabaseReadiness";
import { getPostgresPool } from "../db/postgres";

const STRIPE_CHECKOUT_SESSIONS_URL =
  "https://api.stripe.com/v1/checkout/sessions";
const STRIPE_API_VERSION = "2026-02-25.clover";
const practiceInquiryRateLimit = createRateLimitMiddleware({
  label: "practice-inquiry",
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});
const learnerInterestRateLimit = createRateLimitMiddleware({
  label: "learner-interest",
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});
const checkoutSessionRateLimit = createRateLimitMiddleware({
  label: "checkout-session",
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
});

interface CheckoutRequestBody {
  email?: string;
  offerId?: string;
}

interface PracticeInquiryRequestBody {
  practiceName?: string;
  contactName?: string;
  contactEmail?: string;
  estimatedLearnerCount?: number;
  targetTimeline?: string;
  message?: string;
}

interface LearnerInterestRequestBody {
  learnerName?: string;
  email?: string;
  background?: string;
  goal?: string;
}

function createPracticeInquiryStore(): PracticeInquiryStore {
  const postgresPool = getPostgresPool();

  if (postgresPool) {
    return createPostgresPracticeInquiryStore(postgresPool);
  }

  return createInMemoryPracticeInquiryStore();
}

function createLearnerInterestStore(): LearnerInterestStore {
  const postgresPool = getPostgresPool();

  if (postgresPool) {
    return createPostgresLearnerInterestStore(postgresPool);
  }

  return createInMemoryLearnerInterestStore();
}

const practiceInquiryStore = createPracticeInquiryStore();
const learnerInterestStore = createLearnerInterestStore();

export function getPracticeInquiryStore() {
  return practiceInquiryStore;
}

export function getLearnerInterestStore() {
  return learnerInterestStore;
}

function toPracticeInquiryInput(
  body: PracticeInquiryRequestBody
): PracticeInquiryInput {
  return {
    practiceName: body.practiceName ?? "",
    contactName: body.contactName ?? "",
    contactEmail: body.contactEmail ?? "",
    ...(body.estimatedLearnerCount
      ? { estimatedLearnerCount: body.estimatedLearnerCount }
      : {}),
    targetTimeline: body.targetTimeline ?? "",
    message: body.message ?? "",
  };
}

function toLearnerInterestInput(
  body: LearnerInterestRequestBody
): LearnerInterestInput {
  return {
    learnerName: body.learnerName ?? "",
    email: body.email ?? "",
    background: body.background ?? "",
    goal: body.goal ?? "",
  };
}

export function setupCheckoutRoutes(router: Router) {
  router.post(
    "/learner-interests",
    learnerInterestRateLimit,
    async (req: Request, res: Response) => {
      try {
        const interest = prepareLearnerInterestRecord({
          interest: toLearnerInterestInput(
            (req.body ?? {}) as LearnerInterestRequestBody
          ),
        });
        const storedInterest =
          await learnerInterestStore.recordLearnerInterest(interest);
        const authStatus = getAuthEnvironmentStatus();
        const from = process.env.SIGN_IN_FROM_EMAIL?.trim();
        const apiUrl = process.env.TRANSACTIONAL_EMAIL_API_URL?.trim();
        const apiKey = process.env.TRANSACTIONAL_EMAIL_API_KEY?.trim();
        let notification: {
          attempted: boolean;
          sent: boolean;
          providerMessageId?: string;
          skippedReason?: string;
          error?: string;
        } = {
          attempted: false,
          sent: false,
          skippedReason: "Transactional email is not configured.",
        };

        if (authStatus.passwordlessConfigured && from && apiUrl && apiKey) {
          try {
            const result = await sendLearnerInterestNotification({
              interest: storedInterest,
              from,
              apiUrl,
              apiKey,
            });

            notification = {
              attempted: true,
              sent: true,
              ...(result.providerMessageId
                ? { providerMessageId: result.providerMessageId }
                : {}),
            };
          } catch {
            notification = {
              attempted: true,
              sent: false,
              error: "Learner interest notification could not be sent.",
            };
          }
        }

        res.status(201).json({
          interest: storedInterest,
          notification,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Learner interest could not be recorded.";

        res.status(400).json({ error: message });
      }
    }
  );

  router.post(
    "/practice-inquiries",
    practiceInquiryRateLimit,
    async (req: Request, res: Response) => {
      try {
        const inquiry = preparePracticeInquiryRecord({
          inquiry: toPracticeInquiryInput(
            (req.body ?? {}) as PracticeInquiryRequestBody
          ),
        });
        const storedInquiry =
          await practiceInquiryStore.recordPracticeInquiry(inquiry);
        const authStatus = getAuthEnvironmentStatus();
        const from = process.env.SIGN_IN_FROM_EMAIL?.trim();
        const apiUrl = process.env.TRANSACTIONAL_EMAIL_API_URL?.trim();
        const apiKey = process.env.TRANSACTIONAL_EMAIL_API_KEY?.trim();
        let notification: {
          attempted: boolean;
          sent: boolean;
          providerMessageId?: string;
          skippedReason?: string;
          error?: string;
        } = {
          attempted: false,
          sent: false,
          skippedReason: "Transactional email is not configured.",
        };

        if (authStatus.passwordlessConfigured && from && apiUrl && apiKey) {
          try {
            const result = await sendPracticeInquiryNotification({
              inquiry: storedInquiry,
              from,
              apiUrl,
              apiKey,
            });

            notification = {
              attempted: true,
              sent: true,
              ...(result.providerMessageId
                ? { providerMessageId: result.providerMessageId }
                : {}),
            };
          } catch {
            notification = {
              attempted: true,
              sent: false,
              error: "Practice inquiry notification could not be sent.",
            };
          }
        }

        res.status(201).json({
          inquiry: storedInquiry,
          notification,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Practice inquiry could not be recorded.";

        res.status(400).json({ error: message });
      }
    }
  );

  router.post(
    "/checkout/sessions",
    checkoutSessionRateLimit,
    async (req: Request, res: Response) => {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      const environmentStatus = getCommerceEnvironmentStatus();
      const databaseReadiness = await getLaunchDatabaseReadiness({
        db: getPostgresPool(),
      });
      const checkoutGate = getPaidCheckoutGateStatus({ databaseReadiness });

      if (!checkoutGate.ready) {
        res.status(503).json({
          error: "Paid enrollment is not ready for checkout yet.",
          missing: checkoutGate.missingVariables,
          warnings: checkoutGate.warnings,
        });
        return;
      }

      if (!environmentStatus.checkoutConfigured || !stripeSecretKey) {
        res.status(503).json({
          error: "Stripe checkout is not configured yet.",
          missing: environmentStatus.missingCheckoutVariables,
        });
        return;
      }

      try {
        const { email, offerId } = (req.body ?? {}) as CheckoutRequestBody;
        const normalizedEmail = normalizeCheckoutEmail(email);

        if (!normalizedEmail) {
          res.status(400).json({
            error:
              "A valid email is required so access and receipts can be delivered after payment.",
          });
          return;
        }

        const offer = getCheckoutOfferById(offerId);
        const baseUrl = getCheckoutBaseUrl(req.get("origin"));
        const checkoutReturnUrls = buildCheckoutReturnUrls({ baseUrl, offer });
        const params = buildStripeCheckoutParams(
          checkoutReturnUrls,
          normalizedEmail,
          offer.id
        );

        const stripeResponse = await fetch(STRIPE_CHECKOUT_SESSIONS_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "Stripe-Version": STRIPE_API_VERSION,
          },
          body: params,
        });

        const payload = (await stripeResponse.json()) as {
          url?: string;
          error?: { message?: string };
        };

        if (!stripeResponse.ok || !payload.url) {
          res.status(502).json({
            error: payload.error?.message ?? "Stripe checkout could not start.",
          });
          return;
        }

        res.json({ url: payload.url });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Unknown checkout offer."
        ) {
          res.status(400).json({ error: error.message });
          return;
        }

        res.status(500).json({
          error: "Checkout session failed to start.",
        });
      }
    }
  );
}
