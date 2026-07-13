import { describe, expect, it } from "vitest";
import type { QueryParameters, Queryable } from "../db/postgres";
import { createPostgresAssessmentAttemptStore } from "./postgresAssessmentAttemptStore";

class FakeAssessmentDatabase implements Queryable {
  readonly calls: Array<{ sql: string; params?: QueryParameters }> = [];
  private readonly attempts: Record<string, Record<string, unknown>> = {};
  private readonly questionResults: Record<string, Record<string, unknown>> =
    {};

  async query<T extends Record<string, unknown>>(
    sql: string,
    params?: QueryParameters
  ): Promise<{ rows: T[] }> {
    this.calls.push({ sql, params });

    if (sql.includes("INSERT INTO assessment_attempts")) {
      const id = String(params?.[0]);

      if (this.attempts[id]) {
        return { rows: [] };
      }

      this.attempts[id] = {
        id,
        quiz_id: params?.[1],
        learner_email: params?.[2],
        submitted_at: params?.[3],
        attempt_number: params?.[4],
        score: params?.[5],
        correct_count: params?.[6],
        total_questions: params?.[7],
        passed: params?.[8],
        passing_score: params?.[9],
      };

      return { rows: [this.attempts[id] as T] };
    }

    if (sql.includes("INSERT INTO assessment_question_results")) {
      const id = String(params?.[0]);

      if (!this.questionResults[id]) {
        this.questionResults[id] = {
          id,
          attempt_id: params?.[1],
          question_id: params?.[2],
          is_correct: params?.[3],
        };
      }

      return { rows: [] };
    }

    if (
      sql.includes("FROM assessment_attempts") &&
      sql.includes("WHERE id = $1")
    ) {
      const row = this.attempts[String(params?.[0])];
      return { rows: row ? [row as T] : [] };
    }

    if (
      sql.includes("FROM assessment_question_results") &&
      sql.includes("WHERE attempt_id = $1")
    ) {
      const rows = Object.values(this.questionResults)
        .filter(row => row.attempt_id === params?.[0])
        .sort((left, right) =>
          String(left.question_id).localeCompare(String(right.question_id))
        );

      return { rows: rows as T[] };
    }

    if (
      sql.includes("FROM assessment_attempts") &&
      sql.includes("WHERE learner_email = $1")
    ) {
      const rows = Object.values(this.attempts)
        .filter(
          row =>
            row.learner_email === params?.[0] && row.quiz_id === params?.[1]
        )
        .sort(
          (left, right) =>
            new Date(String(left.submitted_at)).getTime() -
            new Date(String(right.submitted_at)).getTime()
        );

      return { rows: rows as T[] };
    }

    if (sql.includes("FROM assessment_attempts")) {
      return { rows: Object.values(this.attempts) as T[] };
    }

    return { rows: [] };
  }
}

describe("createPostgresAssessmentAttemptStore", () => {
  it("records attempts, question results, and learner progress", async () => {
    const db = new FakeAssessmentDatabase();
    const store = createPostgresAssessmentAttemptStore(db);

    const result = await store.recordAttempt({
      id: "attempt_123",
      quizId: "quiz-entering-ophthalmic-care",
      learnerEmail: " Learner@Example.com ",
      submittedAt: "2026-07-02T12:00:00.000Z",
      attemptNumber: 1,
      score: 75,
      correctCount: 3,
      totalQuestions: 4,
      passed: false,
      passingScore: 80,
      results: [
        { questionId: "m1-q1", isCorrect: true },
        { questionId: "m1-q2", isCorrect: false },
      ],
    });

    expect(result.created).toBe(true);
    expect(result.attempt).toMatchObject({
      id: "attempt_123",
      learnerEmail: "learner@example.com",
      score: 75,
      results: [
        { questionId: "m1-q1", isCorrect: true },
        { questionId: "m1-q2", isCorrect: false },
      ],
    });
    expect(
      await store.findAttemptsByLearnerAndQuiz(
        " learner@example.com ",
        "quiz-entering-ophthalmic-care"
      )
    ).toHaveLength(1);
    expect(
      await store.getLearnerQuizProgress(
        "learner@example.com",
        "quiz-entering-ophthalmic-care"
      )
    ).toMatchObject({
      attemptCount: 1,
      bestScore: 75,
      lastAttemptScore: 75,
      passed: false,
    });
    expect(
      db.calls.some(call =>
        call.sql.includes("INSERT INTO assessment_question_results")
      )
    ).toBe(true);
  });
});
