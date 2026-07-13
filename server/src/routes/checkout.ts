import { getCheckoutOfferById } from "@shared/commerce/offers";
import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";
import type { Request, Response, Router } from "express";
import {
  buildCheckoutReturnUrls,
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "../commerce/stripeCheckout";
import { getCommerceEnvironmentStatus } from "../config/environment";
import { getPaidCheckoutGateStatus } from "../config/paidCheckoutGate";
import { getLaunchDatabaseReadiness } from "../db/launchDatabaseReadiness";
import { getPostgresPool } from "../db/postgres";

const STRIPE_CHECKOUT_SESSIONS_URL =
  "https://api.stripe.com/v1/checkout/sessions";
const STRIPE_API_VERSION = "2026-02-25.clover";

interface CheckoutRequestBody {
  email?: string;
  offerId?: string;
}

export function setupCheckoutRoutes(router: Router) {
  router.post("/checkout/sessions", async (req: Request, res: Response) => {
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
  });
}
