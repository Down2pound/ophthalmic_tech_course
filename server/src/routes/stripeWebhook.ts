import express, { type Express, type Request, type Response } from "express";
import { createCommerceFulfillmentService } from "../commerce/commerceFulfillment";
import {
  createInMemoryEnrollmentStore,
  type EnrollmentStore,
} from "../commerce/enrollmentStore";
import {
  createInMemoryPracticeSeatPackStore,
  type PracticeSeatPackStore,
} from "../commerce/practiceSeatPackStore";
import {
  createInMemoryPurchaseStore,
  type PurchaseStore,
} from "../commerce/purchaseStore";
import {
  createPostgresEnrollmentStore,
  createPostgresPracticeSeatPackStore,
  createPostgresPurchaseStore,
} from "../commerce/postgresCommerceStore";
import { getPostgresPool } from "../db/postgres";
import { getLaunchDatabaseReadiness } from "../db/launchDatabaseReadiness";
import {
  createPurchaseEventFromStripeEvent,
  verifyStripeWebhookSignature,
  type PurchaseEvent,
  type StripeCheckoutCompletedEvent,
} from "../commerce/stripeWebhook";
import { sendPurchaseWelcomeEmail } from "../commerce/purchaseWelcomeEmail";
import {
  getAuthEnvironmentStatus,
  getCommerceEnvironmentStatus,
  type EnvironmentMap,
} from "../config/environment";
import { getWebhookFulfillmentGateStatus } from "../config/webhookFulfillmentGate";

function createCommerceStores(): {
  purchaseStore: PurchaseStore;
  enrollmentStore: EnrollmentStore;
  practiceSeatPackStore: PracticeSeatPackStore;
} {
  const postgresPool = getPostgresPool();

  if (postgresPool) {
    return {
      purchaseStore: createPostgresPurchaseStore(postgresPool),
      enrollmentStore: createPostgresEnrollmentStore(postgresPool),
      practiceSeatPackStore: createPostgresPracticeSeatPackStore(postgresPool),
    };
  }

  return {
    purchaseStore: createInMemoryPurchaseStore(),
    enrollmentStore: createInMemoryEnrollmentStore(),
    practiceSeatPackStore: createInMemoryPracticeSeatPackStore(),
  };
}

const { purchaseStore, enrollmentStore, practiceSeatPackStore } =
  createCommerceStores();
const commerceFulfillmentService = createCommerceFulfillmentService({
  purchaseStore,
  enrollmentStore,
  practiceSeatPackStore,
});

export function getReceivedPurchaseEvents() {
  return purchaseStore.listPurchases();
}

export function getProvisionedEnrollments() {
  return enrollmentStore.listEnrollments();
}

export function getProvisionedPracticeSeatPacks() {
  return practiceSeatPackStore.listPracticeSeatPacks();
}

export function getPracticeSeatPackStore() {
  return practiceSeatPackStore;
}

export function getEnrollmentStore() {
  return enrollmentStore;
}

export function isUnfulfillableCheckoutCompletedEvent(
  stripeEvent: StripeCheckoutCompletedEvent,
  purchaseEvent: PurchaseEvent | null
): boolean {
  return stripeEvent.type === "checkout.session.completed" && !purchaseEvent;
}

export interface PurchaseWelcomeEmailStatus {
  attempted: boolean;
  sent: boolean;
  providerMessageId?: string;
  skippedReason?: string;
  error?: string;
}

export interface PurchaseWelcomeEmailSenderInput {
  purchase: PurchaseEvent;
  from: string;
  publicAppUrl: string;
  apiUrl: string;
  apiKey: string;
}

export type PurchaseWelcomeEmailSender = (
  input: PurchaseWelcomeEmailSenderInput
) => Promise<{ sent: true; providerMessageId?: string }>;

export function shouldSendPurchaseWelcomeEmail({
  purchaseRecorded,
  enrollmentProvisioned,
  practiceSeatPackProvisioned,
}: {
  purchaseRecorded: boolean;
  enrollmentProvisioned: boolean;
  practiceSeatPackProvisioned: boolean;
}): boolean {
  return (
    purchaseRecorded &&
    (enrollmentProvisioned || practiceSeatPackProvisioned)
  );
}

export async function sendFulfillmentWelcomeEmail({
  purchaseEvent,
  fulfillment,
  env = process.env,
  sender = sendPurchaseWelcomeEmail,
}: {
  purchaseEvent: PurchaseEvent;
  fulfillment: {
    purchaseRecorded: boolean;
    enrollmentProvisioned: boolean;
    practiceSeatPackProvisioned: boolean;
  };
  env?: EnvironmentMap;
  sender?: PurchaseWelcomeEmailSender;
}): Promise<PurchaseWelcomeEmailStatus> {
  if (!shouldSendPurchaseWelcomeEmail(fulfillment)) {
    return {
      attempted: false,
      sent: false,
      skippedReason: "Purchase was not newly fulfilled.",
    };
  }

  const authStatus = getAuthEnvironmentStatus(env);
  const from = env.SIGN_IN_FROM_EMAIL?.trim();
  const apiUrl = env.TRANSACTIONAL_EMAIL_API_URL?.trim();
  const apiKey = env.TRANSACTIONAL_EMAIL_API_KEY?.trim();
  const publicAppUrl = env.PUBLIC_APP_URL?.trim();

  if (
    !authStatus.passwordlessConfigured ||
    !from ||
    !apiUrl ||
    !apiKey ||
    !publicAppUrl
  ) {
    return {
      attempted: false,
      sent: false,
      skippedReason: "Transactional email is not configured.",
    };
  }

  try {
    const result = await sender({
      purchase: purchaseEvent,
      from,
      publicAppUrl,
      apiUrl,
      apiKey,
    });

    return {
      attempted: true,
      sent: true,
      ...(result.providerMessageId
        ? { providerMessageId: result.providerMessageId }
        : {}),
    };
  } catch {
    return {
      attempted: true,
      sent: false,
      error: "Welcome email could not be sent.",
    };
  }
}

export function setupStripeWebhookRoute(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request & { body: Buffer }, res: Response) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const environmentStatus = getCommerceEnvironmentStatus();

      if (!environmentStatus.webhookConfigured || !webhookSecret) {
        res.status(503).json({
          error: "Stripe webhook is not configured.",
          missing: environmentStatus.missingWebhookVariables,
        });
        return;
      }

      const databaseReadiness = await getLaunchDatabaseReadiness({
        db: getPostgresPool(),
      });
      const fulfillmentGate = getWebhookFulfillmentGateStatus({
        databaseReadiness,
      });

      if (!fulfillmentGate.ready) {
        res.status(503).json({
          error: "Stripe webhook fulfillment is not ready for durable access.",
          missing: fulfillmentGate.missingVariables,
          warnings: fulfillmentGate.warnings,
        });
        return;
      }

      const payload = req.body.toString("utf8");
      const signatureHeader = req.get("stripe-signature");
      const verified = verifyStripeWebhookSignature({
        payload,
        signatureHeader,
        secret: webhookSecret,
      });

      if (!verified) {
        res.status(400).json({ error: "Invalid Stripe webhook signature." });
        return;
      }

      let stripeEvent: StripeCheckoutCompletedEvent;

      try {
        stripeEvent = JSON.parse(payload) as StripeCheckoutCompletedEvent;
      } catch {
        res.status(400).json({ error: "Invalid Stripe webhook payload." });
        return;
      }

      const purchaseEvent = createPurchaseEventFromStripeEvent(stripeEvent);

      if (isUnfulfillableCheckoutCompletedEvent(stripeEvent, purchaseEvent)) {
        res.status(422).json({
          error:
            "Stripe checkout completed, but the event did not include enough valid purchase data to provision access.",
        });
        return;
      }

      let purchaseRecorded = false;
      let enrollmentProvisioned = false;
      let practiceSeatPackProvisioned = false;
      let welcomeEmail: PurchaseWelcomeEmailStatus = {
        attempted: false,
        sent: false,
        skippedReason: "No purchase fulfillment was needed.",
      };

      if (purchaseEvent) {
        const fulfillment =
          await commerceFulfillmentService.fulfillPurchaseEvent(purchaseEvent);
        purchaseRecorded = fulfillment.purchaseRecorded;
        enrollmentProvisioned = fulfillment.enrollmentProvisioned;
        practiceSeatPackProvisioned = fulfillment.practiceSeatPackProvisioned;
        welcomeEmail = await sendFulfillmentWelcomeEmail({
          purchaseEvent,
          fulfillment,
        });
      }

      res.json({
        received: true,
        purchaseRecorded,
        enrollmentProvisioned,
        practiceSeatPackProvisioned,
        welcomeEmail,
      });
    }
  );
}
