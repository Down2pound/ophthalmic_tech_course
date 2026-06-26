import { describe, expect, it } from "vitest";
import {
  getRecommendedLearnerPath,
  onboardingAssessment,
} from "./onboardingAssessment";

describe("onboardingAssessment", () => {
  it("asks enough questions to separate the three learner paths", () => {
    expect(onboardingAssessment.questions.length).toBeGreaterThanOrEqual(4);
    expect(onboardingAssessment.paths.map((path) => path.id)).toEqual([
      "career-starter",
      "medical-assistant-bridge",
      "practice-onboarding",
    ]);
  });
});

describe("getRecommendedLearnerPath", () => {
  it("recommends career starter for learners new to healthcare", () => {
    expect(
      getRecommendedLearnerPath({
        experience: "new-to-healthcare",
        goal: "first-ophthalmic-role",
        support: "self-paced",
        confidence: "building-basics",
      }).id
    ).toBe("career-starter");
  });

  it("recommends medical assistant bridge for experienced healthcare learners", () => {
    expect(
      getRecommendedLearnerPath({
        experience: "medical-assistant",
        goal: "broaden-medical-knowledge",
        support: "self-paced",
        confidence: "comfortable-with-patients",
      }).id
    ).toBe("medical-assistant-bridge");
  });

  it("recommends practice onboarding for learners starting inside a clinic", () => {
    expect(
      getRecommendedLearnerPath({
        experience: "clinic-new-hire",
        goal: "practice-onboarding",
        support: "supervisor-guided",
        confidence: "needs-skill-verification",
      }).id
    ).toBe("practice-onboarding");
  });
});
