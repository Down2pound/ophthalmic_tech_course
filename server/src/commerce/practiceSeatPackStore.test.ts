import { describe, expect, it } from "vitest";
import {
  createInMemoryPracticeSeatPackStore,
  createPracticeSeatPackFromPurchase,
} from "./practiceSeatPackStore";
import type { VerifiedPurchaseRecord } from "./purchaseStore";

const practicePurchase: VerifiedPurchaseRecord = {
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_test_practice",
  offerId: "practice-five-seat-pack",
  purchaserEmail: " Manager@Example.com ",
  amountTotal: 79900,
  currency: "usd",
  accessMonths: 12,
  seatCount: 5,
  recordedAt: "2026-06-26T14:00:00.000Z",
};

describe("createPracticeSeatPackFromPurchase", () => {
  it("creates a practice seat pack from a verified practice purchase", () => {
    expect(createPracticeSeatPackFromPurchase(practicePurchase)).toEqual({
      seatPackId: "seatpack_cs_test_practice",
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-five-seat-pack",
      purchaserEmail: "manager@example.com",
      totalSeats: 5,
      assignedSeats: 0,
      status: "active",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });

  it("does not create a seat pack for an individual purchase", () => {
    expect(
      createPracticeSeatPackFromPurchase({
        ...practicePurchase,
        offerId: "founding-learner",
        seatCount: undefined,
      })
    ).toBeNull();
  });
});

describe("createInMemoryPracticeSeatPackStore", () => {
  it("provisions one seat pack per checkout session", () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

    expect(seatPack).not.toBeNull();
    expect(store.provisionPracticeSeatPack(seatPack!).created).toBe(true);
    expect(store.provisionPracticeSeatPack(seatPack!).created).toBe(false);
    expect(
      store.findPracticeSeatPacksByPurchaserEmail(" manager@example.com ")
    ).toEqual([seatPack]);
  });
});
