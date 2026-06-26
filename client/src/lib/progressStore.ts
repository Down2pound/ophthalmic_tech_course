const STORAGE_KEY = "optitech.learning.progress.v1";

export interface LearnerProgress {
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  updatedAt: string | null;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createEmptyProgress(): LearnerProgress {
  return {
    completedLessonIds: [],
    quizScores: {},
    updatedAt: null,
  };
}

export function loadProgress(storage: StorageLike): LearnerProgress {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return createEmptyProgress();

  try {
    const parsed = JSON.parse(raw) as LearnerProgress;
    if (
      !Array.isArray(parsed.completedLessonIds) ||
      typeof parsed.quizScores !== "object"
    ) {
      return createEmptyProgress();
    }
    return {
      completedLessonIds: parsed.completedLessonIds,
      quizScores: parsed.quizScores ?? {},
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(
  storage: StorageLike,
  progress: LearnerProgress
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(
  progress: LearnerProgress,
  lessonId: string
): LearnerProgress {
  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  return {
    ...progress,
    completedLessonIds,
    updatedAt: new Date().toISOString(),
  };
}

export function saveQuizScore(
  progress: LearnerProgress,
  quizId: string,
  score: number
): LearnerProgress {
  return {
    ...progress,
    quizScores: {
      ...progress.quizScores,
      [quizId]: score,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getProgressPercent(
  progress: LearnerProgress,
  totalLessons: number
): number {
  if (totalLessons <= 0) return 0;
  return Math.round((progress.completedLessonIds.length / totalLessons) * 100);
}

export function resetProgress(storage: StorageLike): void {
  storage.removeItem(STORAGE_KEY);
}
