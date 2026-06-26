import { describe, expect, it } from "vitest";
import { createInMemoryEnrollmentStore } from "./enrollmentStore";
import {
  createCommerceFulfillmentService,
  type CommerceFulfillmentStore,
} from "./commerceFulfillment";
import {
  createInMemoryPurchaseStore,
  type VerifiedPurchaseRecord,
} from "./purchaseStore";
import type { PurchaseEvent } from "./stripeWebhook";

const purchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: " learner@example.com ",
  amountTotal: 19900,
  currency: "usd",
  accessMonths: 12,
};

describe("createCommerceFulfillmentService", () => {
  it("records a verified purchase and provisions one matching enrollment", () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const service = createCommerceFulfillmentService({
      purchaseStore,
      enrollmentStore,
      now: () => "2026-06-26T14:00:00.000Z",
    });

    expect(service.fulfillPurchaseEvent(purchaseEvent)).toEqual({
      purchaseRecorded: true,
      enrollmentProvisioned: true,
    });
    expect(service.fulfillPurchaseEvent(purchaseEvent)).toEqual({
      purchaseRecorded: false,
      enrollmentProvisioned: false,
    });
    expect(purchaseStore.listPurchases()).toHaveLength(1);
    expect(enrollmentStore.listEnrollments()).toHaveLength(1);
    expect(enrollmentStore.listEnrollments()[0]).toMatchObject({
      checkoutSessionId: "cs_test_123",
      learnerEmail: "learner@example.com",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });

  it("can use one repository object so database storage can be swapped in later", () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const repository: CommerceFulfillmentStore = {
      recordPurchase: purchaseStore.recordPurchase,
      provisionEnrollment: enrollmentStore.provisionEnrollment,
    };
    const service = createCommerceFulfillmentService({
      store: repository,
      now: () => "2026-06-26T14:00:00.000Z",
    });

    expect(service.fulfillPurchaseEvent(purchaseEvent)).toEqual({
      purchaseRecorded: true,
      enrollmentProvisioned: true,
    });
  });

  it("does not provision enrollment when recording the purchase fails", () => {
    const service = createCommerceFulfillmentService({
      store: {
        recordPurchase: (purchase: VerifiedPurchaseRecord) => ({
          created: false,
          purchase,
        }),
        provisionEnrollment: () => {
          throw new Error("Enrollment should not be created.");
        },
      },
    });

    expect(service.fulfillPurchaseEvent(purchaseEvent)).toEqual({
      purchaseRecorded: false,
      enrollmentProvisioned: false,
    });
  });
});
