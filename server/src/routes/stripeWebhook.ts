import express, { type Express, type Request, type Response } from "express";
import {
  createInMemoryPurchaseStore,
  createVerifiedPurchaseRecord,
} from "../commerce/purchaseStore";
import {
  createPurchaseEventFromStripeEvent,
  verifyStripeWebhookSignature,
  type StripeCheckoutCompletedEvent,
} from "../commerce/stripeWebhook";

const purchaseStore = createInMemoryPurchaseStore();

export function getReceivedPurchaseEvents() {
  return purchaseStore.listPurchases();
}

export function setupStripeWebhookRoute(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request & { body: Buffer }, res: Response) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        res.status(503).json({ error: "Stripe webhook is not configured." });
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
      let purchaseRecorded = false;

      if (purchaseEvent) {
        purchaseRecorded = purchaseStore.recordPurchase(
          createVerifiedPurchaseRecord(purchaseEvent)
        ).created;
      }

      res.json({ received: true, purchaseRecorded });
    }
  );
}
