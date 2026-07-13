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
import { getCommerceEnvironmentStatus } from "../config/environment";
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

      if (purchaseEvent) {
        const fulfillment =
          await commerceFulfillmentService.fulfillPurchaseEvent(purchaseEvent);
        purchaseRecorded = fulfillment.purchaseRecorded;
        enrollmentProvisioned = fulfillment.enrollmentProvisioned;
        practiceSeatPackProvisioned = fulfillment.practiceSeatPackProvisioned;
      }

      res.json({
        received: true,
        purchaseRecorded,
        enrollmentProvisioned,
        practiceSeatPackProvisioned,
      });
    }
  );
}
