import { randomUUID } from "node:crypto";

export interface LessonCompletionRecord {
  id: string;
  learnerEmail: string;
  moduleId: string;
  lessonId: string;
  completedAt: string;
}

export interface ModuleLessonProgress {
  learnerEmail: string;
  moduleId: string;
  completedLessonIds: string[];
  completedCount: number;
  totalLessons: number;
  complete: boolean;
  updatedAt: string | null;
}

export type LessonProgressStoreResult<T> = T | Promise<T>;

export interface LessonProgressStore {
  recordLessonCompletion(
    completion: LessonCompletionRecord
  ): LessonProgressStoreResult<{
    created: boolean;
    completion: LessonCompletionRecord;
  }>;
  listCompletions(): LessonProgressStoreResult<LessonCompletionRecord[]>;
  findCompletionsByLearnerAndModule(
    learnerEmail: string,
    moduleId: string
  ): LessonProgressStoreResult<LessonCompletionRecord[]>;
  getModuleLessonProgress(input: {
    learnerEmail: string;
    moduleId: string;
    lessonIds: string[];
  }): LessonProgressStoreResult<ModuleLessonProgress>;
}

export function normalizeLearnerEmail(learnerEmail: string): string {
  return learnerEmail.trim().toLowerCase();
}

export function createLessonCompletionRecord({
  learnerEmail,
  moduleId,
  lessonId,
  completedAt = new Date().toISOString(),
  createId = () => `lesson_completion_${randomUUID()}`,
}: {
  learnerEmail: string;
  moduleId: string;
  lessonId: string;
  completedAt?: string;
  createId?: () => string;
}): LessonCompletionRecord {
  return {
    id: createId(),
    learnerEmail: normalizeLearnerEmail(learnerEmail),
    moduleId,
    lessonId,
    completedAt: new Date(completedAt).toISOString(),
  };
}

export function sortLessonCompletions(
  completions: LessonCompletionRecord[]
): LessonCompletionRecord[] {
  return [...completions].sort(
    (left, right) =>
      new Date(left.completedAt).getTime() -
      new Date(right.completedAt).getTime()
  );
}

export function buildModuleLessonProgress({
  learnerEmail,
  moduleId,
  lessonIds,
  completions,
}: {
  learnerEmail: string;
  moduleId: string;
  lessonIds: string[];
  completions: LessonCompletionRecord[];
}): ModuleLessonProgress {
  const allowedLessonIds = new Set(lessonIds);
  const sortedCompletions = sortLessonCompletions(
    completions.filter(completion => allowedLessonIds.has(completion.lessonId))
  );
  const completedLessonIds = Array.from(
    new Set(sortedCompletions.map(completion => completion.lessonId))
  );
  const lastCompletion = sortedCompletions[sortedCompletions.length - 1];

  return {
    learnerEmail: normalizeLearnerEmail(learnerEmail),
    moduleId,
    completedLessonIds,
    completedCount: completedLessonIds.length,
    totalLessons: lessonIds.length,
    complete:
      lessonIds.length > 0 &&
      lessonIds.every(lessonId => completedLessonIds.includes(lessonId)),
    updatedAt: lastCompletion?.completedAt ?? null,
  };
}

export function createInMemoryLessonProgressStore(): LessonProgressStore {
  const completionsById = new Map<string, LessonCompletionRecord>();

  function findCompletionsByLearnerAndModule(
    learnerEmail: string,
    moduleId: string
  ): LessonCompletionRecord[] {
    const normalizedEmail = normalizeLearnerEmail(learnerEmail);

    return sortLessonCompletions(
      Array.from(completionsById.values()).filter(
        completion =>
          completion.learnerEmail === normalizedEmail &&
          completion.moduleId === moduleId
      )
    );
  }

  return {
    recordLessonCompletion(completion) {
      const duplicate = Array.from(completionsById.values()).find(
        existing =>
          existing.learnerEmail ===
            normalizeLearnerEmail(completion.learnerEmail) &&
          existing.moduleId === completion.moduleId &&
          existing.lessonId === completion.lessonId
      );

      if (duplicate) {
        return { created: false, completion: duplicate };
      }

      const storedCompletion = {
        ...completion,
        learnerEmail: normalizeLearnerEmail(completion.learnerEmail),
      };
      completionsById.set(storedCompletion.id, storedCompletion);

      return { created: true, completion: storedCompletion };
    },
    listCompletions() {
      return sortLessonCompletions(Array.from(completionsById.values()));
    },
    findCompletionsByLearnerAndModule,
    getModuleLessonProgress({ learnerEmail, moduleId, lessonIds }) {
      return buildModuleLessonProgress({
        learnerEmail,
        moduleId,
        lessonIds,
        completions: findCompletionsByLearnerAndModule(learnerEmail, moduleId),
      });
    },
  };
}
