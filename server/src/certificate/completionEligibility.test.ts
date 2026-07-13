import { describe, expect, it } from "vitest";
import { getCertificateEligibility } from "./completionEligibility";

const lessonProgress = {
  learnerEmail: "learner@example.com",
  moduleId: "entering-ophthalmic-care",
  completedLessonIds: [
    "m1-l1-what-techs-do",
    "m1-l2-patient-journey",
    "m1-l3-professional-boundaries",
  ],
  completedCount: 3,
  totalLessons: 3,
  complete: true,
  updatedAt: "2026-07-02T12:00:00.000Z",
};

const quizProgress = {
  learnerEmail: "learner@example.com",
  quizId: "quiz-entering-ophthalmic-care",
  attemptCount: 1,
  bestScore: 100,
  lastAttemptScore: 100,
  passed: true,
  firstPassedAt: "2026-07-02T12:10:00.000Z",
  lastAttemptAt: "2026-07-02T12:10:00.000Z",
};

describe("getCertificateEligibility", () => {
  it("marks a learner eligible after lessons and knowledge check are complete", () => {
    expect(
      getCertificateEligibility({
        learnerEmail: " Learner@Example.com ",
        moduleId: "entering-ophthalmic-care",
        lessonProgress,
        quizProgress,
      })
    ).toMatchObject({
      eligible: true,
      learnerEmail: "learner@example.com",
      moduleId: "entering-ophthalmic-care",
      certificateTitle: "Certificate of Completion",
      requirements: [
        { id: "lessons-complete", met: true },
        { id: "knowledge-check-passed", met: true },
        { id: "limitations-reviewed", met: true },
      ],
    });
  });

  it("keeps certificate locked until required work is complete", () => {
    expect(
      getCertificateEligibility({
        learnerEmail: "learner@example.com",
        moduleId: "entering-ophthalmic-care",
        lessonProgress: { ...lessonProgress, complete: false },
        quizProgress: null,
      })
    ).toMatchObject({
      eligible: false,
      requirements: [
        { id: "lessons-complete", met: false },
        { id: "knowledge-check-passed", met: false },
        { id: "limitations-reviewed", met: true },
      ],
    });
  });
});
