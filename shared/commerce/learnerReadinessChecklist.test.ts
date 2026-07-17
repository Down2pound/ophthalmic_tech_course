import { describe, expect, it } from "vitest";
import {
  getLearnerReadinessResult,
  learnerReadinessItems,
} from "./learnerReadinessChecklist";

describe("learnerReadinessItems", () => {
  it("keeps learner readiness focused on honest course fit", () => {
    expect(learnerReadinessItems.length).toBe(5);
    expect(learnerReadinessItems.map(item => item.id)).toContain(
      "accepts-not-certification"
    );
    expect(learnerReadinessItems.map(item => item.id)).toContain(
      "needs-supervision"
    );
  });
});

describe("getLearnerReadinessResult", () => {
  it("marks a learner as a strong fit when most readiness items are checked", () => {
    const result = getLearnerReadinessResult([
      "interested-in-eye-care",
      "wants-foundations",
      "accepts-not-certification",
      "needs-supervision",
    ]);

    expect(result.level).toBe("strong-fit");
    expect(result.checkedCount).toBe(4);
  });

  it("nudges uncertain learners toward the preview before paying", () => {
    const result = getLearnerReadinessResult([
      "interested-in-eye-care",
      "wants-foundations",
    ]);

    expect(result.level).toBe("possible-fit");
    expect(result.guidance).toContain("free preview");
  });

  it("tells low-readiness learners to pause before buying", () => {
    const result = getLearnerReadinessResult([]);

    expect(result.level).toBe("pause-before-buying");
    expect(result.title).toBe("Pause before buying");
    expect(result.guidance).toContain("free preview");
  });
});
