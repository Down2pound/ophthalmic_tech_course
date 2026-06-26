import { describe, expect, it } from "vitest";
import {
  getLaunchReadinessSummary,
  launchReadinessChecklist,
} from "./launchReadiness";

describe("launchReadinessChecklist", () => {
  it("tracks required gates before accepting real payments", () => {
    expect(launchReadinessChecklist.map((item) => item.id)).toEqual([
      "truthful-public-offer",
      "clinical-review",
      "stripe-checkout",
      "stripe-webhooks",
      "learner-access-control",
      "assessment-security",
      "browser-and-accessibility-qa",
    ]);
  });

  it("does not mark launch ready while blockers remain", () => {
    const summary = getLaunchReadinessSummary(launchReadinessChecklist);

    expect(summary.ready).toBe(false);
    expect(summary.blockedCount).toBeGreaterThan(0);
    expect(summary.blockers.join(" ")).toMatch(/webhook/i);
    expect(summary.blockers.join(" ")).toMatch(/access control/i);
  });
});
