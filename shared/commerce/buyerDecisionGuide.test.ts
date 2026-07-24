import { describe, expect, it } from "vitest";
import { buyerDecisionGuides } from "./buyerDecisionGuide";

describe("buyerDecisionGuides", () => {
  it("gives both buyer types honest decision support", () => {
    expect(buyerDecisionGuides).toHaveLength(2);

    const combined = buyerDecisionGuides
      .flatMap(guide => [
        guide.title,
        guide.summary,
        guide.priceSummary,
        ...guide.goodFit,
        ...guide.notFit,
        ...guide.objectionResponses.flatMap(response => [
          response.concern,
          response.safeAnswer,
          response.nextStep,
        ]),
        guide.safeShareMessage,
      ])
      .join(" ");

    expect(combined).toContain("certification");
    expect(combined).toContain("hands-on");
    expect(combined).toMatch(/does not replace/i);
    expect(combined).toMatch(/private Spindel\/practice onboarding layer/i);
    expect(combined).toMatch(/estimate, not a promise/i);
    expect(combined).not.toMatch(/guarantees? (a )?(job|staffing)/i);
    expect(combined).not.toMatch(/replaces? supervision/i);
  });

  it("gives each buyer type enough objection responses to support a first sale", () => {
    for (const guide of buyerDecisionGuides) {
      expect(guide.objectionResponses).toHaveLength(4);

      const combined = guide.objectionResponses
        .map(
          response =>
            `${response.concern} ${response.safeAnswer} ${response.nextStep}`
        )
        .join(" ");

      expect(combined).toMatch(/No\.|not|private|policy|policies/i);
      expect(combined).not.toMatch(/guarantee/i);
      expect(combined).not.toMatch(/certified technician/i);
      expect(combined).not.toMatch(/employment/i);
    }
  });
});
