export interface ModuleLessonProgress {
  learnerEmail: string;
  moduleId: string;
  completedLessonIds: string[];
  completedCount: number;
  totalLessons: number;
  complete: boolean;
  updatedAt: string | null;
}

export interface ModuleLessonProgressResponse {
  progress: ModuleLessonProgress;
}

async function parseProgressResponse(response: Response) {
  const payload = (await response.json()) as
    | ModuleLessonProgressResponse
    | { error?: string };

  if (response.ok && "progress" in payload) {
    return payload.progress;
  }

  throw new Error(
    "error" in payload && payload.error
      ? payload.error
      : "Lesson progress is unavailable."
  );
}

export async function fetchModuleOneLessonProgress(
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher("/api/learn/module-one/progress");
  return parseProgressResponse(response);
}

export async function markModuleOneLessonComplete({
  lessonId,
  fetcher = fetch,
}: {
  lessonId: string;
  fetcher?: typeof fetch;
}) {
  const response = await fetcher(
    `/api/learn/module-one/lessons/${encodeURIComponent(lessonId)}/complete`,
    { method: "POST" }
  );

  return parseProgressResponse(response);
}
