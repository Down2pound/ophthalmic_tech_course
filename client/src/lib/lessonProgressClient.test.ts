import { describe, expect, it } from "vitest";
import {
  fetchModuleOneLessonProgress,
  markModuleOneLessonComplete,
} from "./lessonProgressClient";

function createResponse(payload: unknown, ok = true) {
  return {
    ok,
    async json() {
      return payload;
    },
  } as Response;
}

const progress = {
  learnerEmail: "learner@example.com",
  moduleId: "entering-ophthalmic-care",
  completedLessonIds: ["m1-l1-what-techs-do"],
  completedCount: 1,
  totalLessons: 3,
  complete: false,
  updatedAt: "2026-07-02T12:00:00.000Z",
};

describe("lessonProgressClient", () => {
  it("fetches protected module progress", async () => {
    const calls: string[] = [];
    const fetcher = async (url: string | URL | Request) => {
      calls.push(String(url));
      return createResponse({ progress });
    };

    await expect(
      fetchModuleOneLessonProgress(fetcher as typeof fetch)
    ).resolves.toEqual(progress);
    expect(calls).toEqual(["/api/learn/module-one/progress"]);
  });

  it("marks a protected lesson complete", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return createResponse({ progress });
    };

    await expect(
      markModuleOneLessonComplete({
        lessonId: "m1-l1-what-techs-do",
        fetcher: fetcher as typeof fetch,
      })
    ).resolves.toEqual(progress);
    expect(calls).toEqual([
      {
        url: "/api/learn/module-one/lessons/m1-l1-what-techs-do/complete",
        init: { method: "POST" },
      },
    ]);
  });

  it("surfaces server progress errors", async () => {
    await expect(
      fetchModuleOneLessonProgress((async () =>
        createResponse(
          { error: "Lesson access required." },
          false
        )) as typeof fetch)
    ).rejects.toThrow("Lesson access required.");
  });
});
