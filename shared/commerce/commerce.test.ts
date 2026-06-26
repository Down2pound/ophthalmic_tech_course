import { describe, expect, it } from "vitest";
import { foundingLearnerOffer, practicePackOffers } from "./offers";
import { commercePolicies } from "./policies";

describe("foundingLearnerOffer", () => {
  it("uses the approved founding learner price and access period", () => {
    expect(foundingLearnerOffer.id).toBe("founding-learner");
    expect(foundingLearnerOffer.priceCents).toBe(19900);
    expect(foundingLearnerOffer.currency).toBe("usd");
    expect(foundingLearnerOffer.accessMonths).toBe(12);
  });

  it("does not promise certification, employment, or hands-on verification", () => {
    const combined = [
      foundingLearnerOffer.description,
      ...foundingLearnerOffer.includes,
      ...foundingLearnerOffer.limitations,
    ].join(" ");

    expect(combined).toMatch(/not certification/i);
    expect(combined).toMatch(/does not guarantee employment/i);
    expect(combined).toMatch(/does not verify hands-on/i);
  });
});

describe("practicePackOffers", () => {
  it("defines the approved employer seat packs", () => {
    expect(practicePackOffers.map((offer) => offer.id)).toEqual([
      "practice-five-seat-pack",
      "practice-fifteen-seat-pack",
    ]);
    expect(practicePackOffers[0].seatCount).toBe(5);
    expect(practicePackOffers[0].priceCents).toBe(79900);
    expect(practicePackOffers[1].seatCount).toBe(15);
    expect(practicePackOffers[1].priceCents).toBe(179900);
  });

  it("keeps employer offers honest about supervision and competency", () => {
    const combined = practicePackOffers
      .flatMap((offer) => [
        offer.description,
        ...offer.includes,
        ...offer.limitations,
      ])
      .join(" ");

    expect(combined).toMatch(/supervisor/i);
    expect(combined).toMatch(/does not independently verify/i);
    expect(combined).not.toMatch(/guaranteed competency/i);
  });
});

describe("commercePolicies", () => {
  it("contains all public policy sections required before purchase", () => {
    expect(commercePolicies.map((policy) => policy.slug)).toEqual([
      "educational-limitations",
      "refund-policy",
      "privacy-summary",
      "terms-summary",
    ]);
  });

  it("keeps policy sections learner-facing and non-empty", () => {
    for (const policy of commercePolicies) {
      expect(policy.title.length).toBeGreaterThan(8);
      expect(policy.body.length).toBeGreaterThan(120);
      expect(policy.body).not.toMatch(/legal advice/i);
    }
  });
});
