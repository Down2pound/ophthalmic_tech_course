import { describe, expect, it } from "vitest";
import { renderFirstSaleSupportRunbook } from "./firstSaleSupportRunbook";

describe("renderFirstSaleSupportRunbook", () => {
  it("points support staff to buyer lookup recommendations without secrets", () => {
    const runbook = renderFirstSaleSupportRunbook({
      generatedAt: "2026-07-13T12:00:00.000Z",
    });

    expect(runbook).toContain("OptiTech Academy First Sale Support Runbook");
    expect(runbook).toContain("recommended next support actions");
    expect(runbook).toContain("lookup `recommendedActions`");
    expect(runbook).toContain("Practice Seat Manager");
    expect(runbook).toContain("Access revocation");
    expect(runbook).toContain("GET /api/support/buyer-lookup");
    expect(runbook).not.toContain("sk_test_");
    expect(runbook).not.toContain("whsec_");
  });
});
