import {
  getCheckoutOfferById,
  isPracticePackOffer,
} from "@shared/commerce/offers";
import type { Request, Response, Router } from "express";
import {
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "../commerce/stripeCheckout";
import { getCommerceEnvironmentStatus } from "../config/environment";

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

    if (!environmentStatus.paidEnrollmentEnabled) {
      res.status(503).json({
        error: "Paid enrollment is not enabled yet.",
        missing: ["ENABLE_PAID_ENROLLMENT"],
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
      const offer = getCheckoutOfferById(offerId);
      const baseUrl = getCheckoutBaseUrl(req.get("origin"));
      const cancelPath = isPracticePackOffer(offer)
        ? "/practice-packs"
        : "/checkout";
      const params = buildStripeCheckoutParams(
        {
          successUrl: `${baseUrl}/learn?checkout=success&offer=${encodeURIComponent(
            offer.id
          )}`,
          cancelUrl: `${baseUrl}${cancelPath}?checkout=cancelled`,
        },
        email,
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
