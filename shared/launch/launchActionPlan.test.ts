import { describe, expect, it } from "vitest";
import {
  getRemainingLaunchActions,
  launchActionPlan,
} from "./launchActionPlan";

describe("launchActionPlan", () => {
  it("keeps the paid launch steps in the order they should be handled", () => {
    expect(launchActionPlan.map(action => action.id)).toEqual([
      "clinical-review-signoff",
      "production-database",
      "production-env",
      "stripe-webhook-test",
      "learner-flow-test",
      "browser-accessibility-qa",
    ]);
  });

  it("records action, reason, and proof needed for every launch step", () => {
    expect(
      launchActionPlan.every(
        action =>
          action.title &&
          action.whyItMatters &&
          action.action &&
          action.evidenceNeeded
      )
    ).toBe(true);
  });
});

describe("getRemainingLaunchActions", () => {
  it("returns the current action plan", () => {
    expect(getRemainingLaunchActions()).toBe(launchActionPlan);
  });
});
