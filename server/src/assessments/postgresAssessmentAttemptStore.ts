import type { Queryable } from "../db/postgres";
import {
  buildLearnerQuizProgress,
  normalizeLearnerEmail,
  sortAssessmentAttempts,
  type AssessmentAttemptRecord,
  type AssessmentAttemptStore,
} from "./assessmentAttemptStore";

interface AssessmentAttemptRow extends Record<string, unknown> {
  id: string;
  quiz_id: string;
  learner_email: string;
  submitted_at: Date | string;
  attempt_number: number;
  score: number;
  correct_count: number;
  total_questions: number;
  passed: boolean;
  passing_score: number;
}

interface AssessmentQuestionResultRow extends Record<string, unknown> {
  id: string;
  attempt_id: string;
  question_id: string;
  is_correct: boolean;
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function questionResultId(attemptId: string, questionId: string): string {
  return `${attemptId}_${questionId}`;
}

function mapAttemptRow(
  row: AssessmentAttemptRow,
  results: AssessmentQuestionResultRow[]
): AssessmentAttemptRecord {
  return {
    id: row.id,
    quizId: row.quiz_id,
    learnerEmail: row.learner_email,
    submittedAt: toIsoString(row.submitted_at),
    attemptNumber: row.attempt_number,
    score: row.score,
    correctCount: row.correct_count,
    totalQuestions: row.total_questions,
    passed: row.passed,
    passingScore: row.passing_score,
    results: results.map(result => ({
      questionId: result.question_id,
      isCorrect: result.is_correct,
    })),
  };
}

async function loadQuestionResults(
  db: Queryable,
  attemptId: string
): Promise<AssessmentQuestionResultRow[]> {
  const result = await db.query<AssessmentQuestionResultRow>(
    `
    SELECT id, attempt_id, question_id, is_correct
    FROM assessment_question_results
    WHERE attempt_id = $1
    ORDER BY question_id ASC
    `,
    [attemptId]
  );

  return result.rows;
}

async function loadAttemptById(
  db: Queryable,
  id: string
): Promise<AssessmentAttemptRecord | undefined> {
  const attemptResult = await db.query<AssessmentAttemptRow>(
    `
    SELECT *
    FROM assessment_attempts
    WHERE id = $1
    `,
    [id]
  );
  const attemptRow = attemptResult.rows[0];

  if (!attemptRow) {
    return undefined;
  }

  return mapAttemptRow(attemptRow, await loadQuestionResults(db, id));
}

async function mapAttemptRows(
  db: Queryable,
  rows: AssessmentAttemptRow[]
): Promise<AssessmentAttemptRecord[]> {
  const attempts = await Promise.all(
    rows.map(async row =>
      mapAttemptRow(row, await loadQuestionResults(db, row.id))
    )
  );

  return sortAssessmentAttempts(attempts);
}

export function createPostgresAssessmentAttemptStore(
  db: Queryable
): AssessmentAttemptStore {
  return {
    async recordAttempt(attempt) {
      const normalizedEmail = normalizeLearnerEmail(attempt.learnerEmail);
      const result = await db.query<AssessmentAttemptRow>(
        `
        INSERT INTO assessment_attempts (
          id, quiz_id, learner_email, submitted_at, attempt_number, score,
          correct_count, total_questions, passed, passing_score
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
        `,
        [
          attempt.id,
          attempt.quizId,
          normalizedEmail,
          attempt.submittedAt,
          attempt.attemptNumber,
          attempt.score,
          attempt.correctCount,
          attempt.totalQuestions,
          attempt.passed,
          attempt.passingScore,
        ]
      );

      if (!result.rows[0]) {
        const existingAttempt = await loadAttemptById(db, attempt.id);

        if (!existingAttempt) {
          throw new Error("Assessment attempt could not be loaded.");
        }

        return { created: false, attempt: existingAttempt };
      }

      for (const questionResult of attempt.results) {
        await db.query(
          `
          INSERT INTO assessment_question_results (
            id, attempt_id, question_id, is_correct
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING
          `,
          [
            questionResultId(attempt.id, questionResult.questionId),
            attempt.id,
            questionResult.questionId,
            questionResult.isCorrect,
          ]
        );
      }

      const storedAttempt = await loadAttemptById(db, attempt.id);

      if (!storedAttempt) {
        throw new Error("Assessment attempt could not be loaded.");
      }

      return { created: true, attempt: storedAttempt };
    },
    async listAttempts() {
      const result = await db.query<AssessmentAttemptRow>(
        `
        SELECT *
        FROM assessment_attempts
        ORDER BY submitted_at ASC
        `
      );

      return mapAttemptRows(db, result.rows);
    },
    async findAttemptsByLearnerAndQuiz(learnerEmail, quizId) {
      const result = await db.query<AssessmentAttemptRow>(
        `
        SELECT *
        FROM assessment_attempts
        WHERE learner_email = $1 AND quiz_id = $2
        ORDER BY submitted_at ASC
        `,
        [normalizeLearnerEmail(learnerEmail), quizId]
      );

      return mapAttemptRows(db, result.rows);
    },
    async getLearnerQuizProgress(learnerEmail, quizId) {
      const attempts = await this.findAttemptsByLearnerAndQuiz(
        learnerEmail,
        quizId
      );

      return buildLearnerQuizProgress({ learnerEmail, quizId, attempts });
    },
  };
}
