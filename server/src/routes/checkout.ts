import type { Request, Response, Router } from "express";
import {
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "../commerce/stripeCheckout";

const STRIPE_CHECKOUT_SESSIONS_URL =
  "https://api.stripe.com/v1/checkout/sessions";
const STRIPE_API_VERSION = "2026-02-25.clover";

interface CheckoutRequestBody {
  email?: string;
}

export function setupCheckoutRoutes(router: Router) {
  router.post("/checkout/session", async (req: Request, res: Response) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      res.status(503).json({
        error: "Stripe checkout is not configured yet.",
      });
      return;
    }

    try {
      const { email } = (req.body ?? {}) as CheckoutRequestBody;
      const baseUrl = getCheckoutBaseUrl(req.get("origin"));
      const params = buildStripeCheckoutParams(
        {
          successUrl: `${baseUrl}/learn?checkout=success`,
          cancelUrl: `${baseUrl}/checkout?checkout=cancelled`,
        },
        email
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
      res.status(500).json({
        error: "Checkout session failed to start.",
      });
    }
  });
}
