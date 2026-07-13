import { describe, expect, it } from "vitest";
import {
  createAssessmentAttemptRecord,
  createInMemoryAssessmentAttemptStore,
} from "./assessmentAttemptStore";
import type { KnowledgeCheckScore } from "./moduleOneKnowledgeCheck";

const baseScore: KnowledgeCheckScore = {
  quizId: "quiz-entering-ophthalmic-care",
  learnerEmail: " Learner@Example.com ",
  submittedAt: "2026-07-02T12:00:00.000Z",
  score: 75,
  correctCount: 3,
  totalQuestions: 4,
  passed: false,
  passingScore: 80,
  results: [
    { questionId: "m1-q1", isCorrect: true },
    { questionId: "m1-q2", isCorrect: true },
    { questionId: "m1-q3", isCorrect: true },
    { questionId: "m1-q4", isCorrect: false },
  ],
};

describe("createAssessmentAttemptRecord", () => {
  it("normalizes learner email and stores scoring details", () => {
    expect(
      createAssessmentAttemptRecord({
        score: baseScore,
        attemptNumber: 2,
        createId: () => "attempt_123",
      })
    ).toEqual({
      id: "attempt_123",
      quizId: "quiz-entering-ophthalmic-care",
      learnerEmail: "learner@example.com",
      submittedAt: "2026-07-02T12:00:00.000Z",
      attemptNumber: 2,
      score: 75,
      correctCount: 3,
      totalQuestions: 4,
      passed: false,
      passingScore: 80,
      results: baseScore.results,
    });
  });
});

describe("createInMemoryAssessmentAttemptStore", () => {
  it("records attempts and reports learner progress", async () => {
    const store = createInMemoryAssessmentAttemptStore();

    expect(
      await store.recordAttempt(
        createAssessmentAttemptRecord({
          score: baseScore,
          attemptNumber: 1,
          createId: () => "attempt_1",
        })
      )
    ).toMatchObject({ created: true });
    expect(
      await store.recordAttempt(
        createAssessmentAttemptRecord({
          score: {
            ...baseScore,
            submittedAt: "2026-07-02T12:10:00.000Z",
            score: 100,
            correctCount: 4,
            passed: true,
          },
          attemptNumber: 2,
          createId: () => "attempt_2",
        })
      )
    ).toMatchObject({ created: true });

    expect(
      await store.findAttemptsByLearnerAndQuiz(
        " learner@example.com ",
        "quiz-entering-ophthalmic-care"
      )
    ).toHaveLength(2);
    expect(
      await store.getLearnerQuizProgress(
        "learner@example.com",
        "quiz-entering-ophthalmic-care"
      )
    ).toEqual({
      learnerEmail: "learner@example.com",
      quizId: "quiz-entering-ophthalmic-care",
      attemptCount: 2,
      bestScore: 100,
      lastAttemptScore: 100,
      passed: true,
      firstPassedAt: "2026-07-02T12:10:00.000Z",
      lastAttemptAt: "2026-07-02T12:10:00.000Z",
    });
  });
});
