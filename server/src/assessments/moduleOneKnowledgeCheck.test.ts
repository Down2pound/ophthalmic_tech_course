import { describe, expect, it } from "vitest";
import {
  getModuleOneKnowledgeCheck,
  scoreModuleOneKnowledgeCheck,
} from "./moduleOneKnowledgeCheck";

describe("getModuleOneKnowledgeCheck", () => {
  it("returns quiz questions without the answer key", () => {
    const quiz = getModuleOneKnowledgeCheck();
    const serializedQuiz = JSON.stringify(quiz);

    expect(quiz.id).toBe("quiz-entering-ophthalmic-care");
    expect(quiz.questions).toHaveLength(4);
    expect(serializedQuiz).not.toContain("correctAnswer");
    expect(
      quiz.questions.every(question => !("correctAnswer" in question))
    ).toBe(true);
    expect(quiz.questions[0].options).toContain(
      "A clinical team member who gathers accurate information and performs starting tests"
    );
  });
});

describe("scoreModuleOneKnowledgeCheck", () => {
  it("scores submitted answers on the server", () => {
    expect(
      scoreModuleOneKnowledgeCheck({
        learnerEmail: " Learner@Example.com ",
        submittedAt: "2026-07-02T12:00:00.000Z",
        answers: [
          {
            questionId: "m1-q1",
            answer:
              "A clinical team member who gathers accurate information and performs starting tests",
          },
          {
            questionId: "m1-q2",
            answer:
              "That is a diagnosis question for the provider, and I will make sure they know your concern",
          },
          { questionId: "m1-q3", answer: "True" },
          {
            questionId: "m1-q4",
            answer: "A patient asks where the restroom is",
          },
        ],
      })
    ).toEqual({
      quizId: "quiz-entering-ophthalmic-care",
      learnerEmail: "learner@example.com",
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
    });
  });

  it("treats missing answers as incorrect", () => {
    expect(
      scoreModuleOneKnowledgeCheck({
        learnerEmail: "learner@example.com",
        submittedAt: "2026-07-02T12:00:00.000Z",
        answers: [],
      })
    ).toMatchObject({
      score: 0,
      correctCount: 0,
      passed: false,
    });
  });
});
