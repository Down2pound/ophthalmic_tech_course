import { describe, expect, it } from "vitest";
import { foundingLearnerOffer } from "./offers";
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
