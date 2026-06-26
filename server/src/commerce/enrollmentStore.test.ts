import { describe, expect, it } from "vitest";
import {
  createEnrollmentFromPurchase,
  createInMemoryEnrollmentStore,
} from "./enrollmentStore";
import type { VerifiedPurchaseRecord } from "./purchaseStore";

const purchase: VerifiedPurchaseRecord = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 19900,
  currency: "usd",
  accessMonths: 12,
  recordedAt: "2026-06-26T14:00:00.000Z",
};

describe("createEnrollmentFromPurchase", () => {
  it("creates a learner enrollment from a verified purchase", () => {
    expect(createEnrollmentFromPurchase(purchase)).toEqual({
      enrollmentId: "enrollment_cs_test_123",
      checkoutSessionId: "cs_test_123",
      offerId: "founding-learner",
      learnerEmail: "learner@example.com",
      status: "active",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });
});

describe("createInMemoryEnrollmentStore", () => {
  it("provisions one enrollment per checkout session", () => {
    const store = createInMemoryEnrollmentStore();
    const enrollment = createEnrollmentFromPurchase(purchase);

    expect(store.provisionEnrollment(enrollment).created).toBe(true);
    expect(store.provisionEnrollment(enrollment).created).toBe(false);
    expect(store.findEnrollmentsByEmail(" learner@example.com ")).toEqual([
      enrollment,
    ]);
  });
});
