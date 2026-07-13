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

  it("assigns learner emails without exceeding purchased capacity", () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase({
      ...practicePurchase,
      seatCount: 1,
    });

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);

    expect(
      store.assignPracticeSeat({
        seatPackId: seatPack!.seatPackId,
        learnerEmail: " Tech@OnePractice.com ",
        assignedAt: "2026-06-27T14:00:00.000Z",
      })
    ).toMatchObject({
      assigned: true,
      assignment: {
        learnerEmail: "tech@onepractice.com",
        status: "active",
        assignedAt: "2026-06-27T14:00:00.000Z",
      },
      seatPack: {
        totalSeats: 1,
        assignedSeats: 1,
      },
    });

    expect(
      store.assignPracticeSeat({
        seatPackId: seatPack!.seatPackId,
        learnerEmail: "second@example.com",
      })
    ).toEqual({
      assigned: false,
      reason: "Practice seat pack has no seats remaining.",
    });
  });

  it("returns the existing assignment when the same learner is assigned twice", () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);

    const firstAssignment = store.assignPracticeSeat({
      seatPackId: seatPack!.seatPackId,
      learnerEmail: "tech@example.com",
      assignedAt: "2026-06-27T14:00:00.000Z",
    });
    const secondAssignment = store.assignPracticeSeat({
      seatPackId: seatPack!.seatPackId,
      learnerEmail: " TECH@example.com ",
      assignedAt: "2026-07-01T14:00:00.000Z",
    });

    expect(secondAssignment).toEqual(firstAssignment);
    expect(store.listPracticeSeatAssignments()).toHaveLength(1);
    expect(store.listPracticeSeatPacks()[0].assignedSeats).toBe(1);
  });

  it("rejects assignments for missing seat packs", () => {
    const store = createInMemoryPracticeSeatPackStore();

    expect(
      store.assignPracticeSeat({
        seatPackId: "seatpack_missing",
        learnerEmail: "tech@example.com",
      })
    ).toEqual({
      assigned: false,
      reason: "Practice seat pack was not found.",
    });
  });
});
