import express, { type Express, type Request, type Response } from "express";
import { createCommerceFulfillmentService } from "../commerce/commerceFulfillment";
import { createInMemoryEnrollmentStore } from "../commerce/enrollmentStore";
import { createInMemoryPurchaseStore } from "../commerce/purchaseStore";
import {
  createPurchaseEventFromStripeEvent,
  verifyStripeWebhookSignature,
  type StripeCheckoutCompletedEvent,
} from "../commerce/stripeWebhook";
import { getCommerceEnvironmentStatus } from "../config/environment";

const purchaseStore = createInMemoryPurchaseStore();
const enrollmentStore = createInMemoryEnrollmentStore();
const commerceFulfillmentService = createCommerceFulfillmentService({
  purchaseStore,
  enrollmentStore,
});

export function getReceivedPurchaseEvents() {
  return purchaseStore.listPurchases();
}

export function getProvisionedEnrollments() {
  return enrollmentStore.listEnrollments();
}

export function getEnrollmentStore() {
  return enrollmentStore;
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
      let enrollmentProvisioned = false;

      if (purchaseEvent) {
        const fulfillment =
          commerceFulfillmentService.fulfillPurchaseEvent(purchaseEvent);
        purchaseRecorded = fulfillment.purchaseRecorded;
        enrollmentProvisioned = fulfillment.enrollmentProvisioned;
      }

      res.json({ received: true, purchaseRecorded, enrollmentProvisioned });
    }
  );
}
