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
        guide.safeShareMessage,
      ])
      .join(" ");

    expect(combined).toContain("certification");
    expect(combined).toContain("hands-on");
    expect(combined).toMatch(/does not replace/i);
    expect(combined).not.toMatch(/guarantees? (a )?(job|staffing)/i);
    expect(combined).not.toMatch(/replaces? supervision/i);
  });
});
