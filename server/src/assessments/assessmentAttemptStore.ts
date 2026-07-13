import { randomUUID } from "node:crypto";
import type { KnowledgeCheckScore } from "./moduleOneKnowledgeCheck";

export interface AssessmentAttemptRecord {
  id: string;
  quizId: string;
  learnerEmail: string;
  submittedAt: string;
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  results: KnowledgeCheckScore["results"];
}

export interface LearnerQuizProgress {
  learnerEmail: string;
  quizId: string;
  attemptCount: number;
  bestScore: number;
  lastAttemptScore: number;
  passed: boolean;
  firstPassedAt?: string;
  lastAttemptAt: string;
}

export type AssessmentStoreResult<T> = T | Promise<T>;

export interface AssessmentAttemptStore {
  recordAttempt(attempt: AssessmentAttemptRecord): AssessmentStoreResult<{
    created: boolean;
    attempt: AssessmentAttemptRecord;
  }>;
  listAttempts(): AssessmentStoreResult<AssessmentAttemptRecord[]>;
  findAttemptsByLearnerAndQuiz(
    learnerEmail: string,
    quizId: string
  ): AssessmentStoreResult<AssessmentAttemptRecord[]>;
  getLearnerQuizProgress(
    learnerEmail: string,
    quizId: string
  ): AssessmentStoreResult<LearnerQuizProgress | null>;
}

export function createAssessmentAttemptRecord({
  score,
  attemptNumber,
  createId = () => `assessment_attempt_${randomUUID()}`,
}: {
  score: KnowledgeCheckScore;
  attemptNumber: number;
  createId?: () => string;
}): AssessmentAttemptRecord {
  return {
    id: createId(),
    quizId: score.quizId,
    learnerEmail: normalizeLearnerEmail(score.learnerEmail),
    submittedAt: score.submittedAt,
    attemptNumber,
    score: score.score,
    correctCount: score.correctCount,
    totalQuestions: score.totalQuestions,
    passed: score.passed,
    passingScore: score.passingScore,
    results: score.results,
  };
}

export function normalizeLearnerEmail(learnerEmail: string): string {
  return learnerEmail.trim().toLowerCase();
}

export function sortAssessmentAttempts(
  attempts: AssessmentAttemptRecord[]
): AssessmentAttemptRecord[] {
  return [...attempts].sort(
    (left, right) =>
      new Date(left.submittedAt).getTime() -
      new Date(right.submittedAt).getTime()
  );
}

export function buildLearnerQuizProgress({
  learnerEmail,
  quizId,
  attempts,
}: {
  learnerEmail: string;
  quizId: string;
  attempts: AssessmentAttemptRecord[];
}): LearnerQuizProgress | null {
  const sortedAttempts = sortAssessmentAttempts(attempts);
  const lastAttempt = sortedAttempts[sortedAttempts.length - 1];

  if (!lastAttempt) {
    return null;
  }

  const bestScore = Math.max(...sortedAttempts.map(attempt => attempt.score));
  const firstPassedAttempt = sortedAttempts.find(attempt => attempt.passed);

  return {
    learnerEmail: normalizeLearnerEmail(learnerEmail),
    quizId,
    attemptCount: sortedAttempts.length,
    bestScore,
    lastAttemptScore: lastAttempt.score,
    passed: sortedAttempts.some(attempt => attempt.passed),
    firstPassedAt: firstPassedAttempt?.submittedAt,
    lastAttemptAt: lastAttempt.submittedAt,
  };
}

export function createInMemoryAssessmentAttemptStore(): AssessmentAttemptStore {
  const attemptsById = new Map<string, AssessmentAttemptRecord>();

  function findAttemptsByLearnerAndQuiz(
    learnerEmail: string,
    quizId: string
  ): AssessmentAttemptRecord[] {
    const normalizedEmail = normalizeLearnerEmail(learnerEmail);

    return sortAssessmentAttempts(
      Array.from(attemptsById.values()).filter(
        attempt =>
          attempt.learnerEmail === normalizedEmail && attempt.quizId === quizId
      )
    );
  }

  return {
    recordAttempt(attempt) {
      const existing = attemptsById.get(attempt.id);

      if (existing) {
        return { created: false, attempt: existing };
      }

      attemptsById.set(attempt.id, attempt);

      return { created: true, attempt };
    },
    listAttempts() {
      return Array.from(attemptsById.values());
    },
    findAttemptsByLearnerAndQuiz,
    getLearnerQuizProgress(learnerEmail, quizId) {
      return buildLearnerQuizProgress({
        learnerEmail,
        quizId,
        attempts: findAttemptsByLearnerAndQuiz(learnerEmail, quizId),
      });
    },
  };
}
