import type { CourseModule, Lesson } from "@shared/course/types";
import type { LearnerSessionAccess } from "./learnerSessionClient";

type Fetcher = typeof fetch;

export interface ProtectedModuleOneLessons {
  module: CourseModule;
  lessons: Lesson[];
  access: Extract<LearnerSessionAccess, { authenticated: true; hasAccess: true }>;
}

interface ProtectedLessonsErrorResponse {
  error?: string;
}

export async function fetchProtectedModuleOneLessons({
  fetcher = fetch,
}: {
  fetcher?: Fetcher;
} = {}): Promise<ProtectedModuleOneLessons> {
  const response = await fetcher("/api/learn/module-one/lessons", {
    credentials: "include",
  });
  const payload = (await response.json()) as
    | ProtectedModuleOneLessons
    | ProtectedLessonsErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Lesson content is unavailable right now."
    );
  }

  return payload as ProtectedModuleOneLessons;
}
