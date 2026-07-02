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

export interface AssessmentAttemptStore {
  recordAttempt(
    attempt: AssessmentAttemptRecord
  ): { created: boolean; attempt: AssessmentAttemptRecord };
  listAttempts(): AssessmentAttemptRecord[];
  findAttemptsByLearnerAndQuiz(
    learnerEmail: string,
    quizId: string
  ): AssessmentAttemptRecord[];
  getLearnerQuizProgress(
    learnerEmail: string,
    quizId: string
  ): LearnerQuizProgress | null;
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
    learnerEmail: score.learnerEmail.trim().toLowerCase(),
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

export function createInMemoryAssessmentAttemptStore(): AssessmentAttemptStore {
  const attemptsById = new Map<string, AssessmentAttemptRecord>();

  function findAttemptsByLearnerAndQuiz(
    learnerEmail: string,
    quizId: string
  ): AssessmentAttemptRecord[] {
    const normalizedEmail = learnerEmail.trim().toLowerCase();

    return Array.from(attemptsById.values())
      .filter(
        (attempt) =>
          attempt.learnerEmail === normalizedEmail && attempt.quizId === quizId
      )
      .sort(
        (left, right) =>
          new Date(left.submittedAt).getTime() -
          new Date(right.submittedAt).getTime()
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
      const attempts = findAttemptsByLearnerAndQuiz(learnerEmail, quizId);
      const lastAttempt = attempts[attempts.length - 1];

      if (!lastAttempt) {
        return null;
      }

      const bestScore = Math.max(...attempts.map((attempt) => attempt.score));
      const firstPassedAttempt = attempts.find((attempt) => attempt.passed);

      return {
        learnerEmail: learnerEmail.trim().toLowerCase(),
        quizId,
        attemptCount: attempts.length,
        bestScore,
        lastAttemptScore: lastAttempt.score,
        passed: attempts.some((attempt) => attempt.passed),
        firstPassedAt: firstPassedAttempt?.submittedAt,
        lastAttemptAt: lastAttempt.submittedAt,
      };
    },
  };
}
