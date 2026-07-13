import { describe, expect, it } from "vitest";
import {
  buildModuleLessonProgress,
  createInMemoryLessonProgressStore,
  createLessonCompletionRecord,
} from "./lessonProgressStore";

describe("createLessonCompletionRecord", () => {
  it("normalizes learner email and completion timestamp", () => {
    expect(
      createLessonCompletionRecord({
        learnerEmail: " Learner@Example.com ",
        moduleId: "entering-ophthalmic-care",
        lessonId: "m1-l1-what-techs-do",
        completedAt: "2026-07-02T12:00:00.000Z",
        createId: () => "completion_123",
      })
    ).toEqual({
      id: "completion_123",
      learnerEmail: "learner@example.com",
      moduleId: "entering-ophthalmic-care",
      lessonId: "m1-l1-what-techs-do",
      completedAt: "2026-07-02T12:00:00.000Z",
    });
  });
});

describe("buildModuleLessonProgress", () => {
  it("reports module completion from durable lesson records", () => {
    expect(
      buildModuleLessonProgress({
        learnerEmail: " Learner@Example.com ",
        moduleId: "entering-ophthalmic-care",
        lessonIds: ["lesson-1", "lesson-2"],
        completions: [
          {
            id: "completion_2",
            learnerEmail: "learner@example.com",
            moduleId: "entering-ophthalmic-care",
            lessonId: "lesson-2",
            completedAt: "2026-07-02T12:10:00.000Z",
          },
          {
            id: "completion_1",
            learnerEmail: "learner@example.com",
            moduleId: "entering-ophthalmic-care",
            lessonId: "lesson-1",
            completedAt: "2026-07-02T12:00:00.000Z",
          },
        ],
      })
    ).toEqual({
      learnerEmail: "learner@example.com",
      moduleId: "entering-ophthalmic-care",
      completedLessonIds: ["lesson-1", "lesson-2"],
      completedCount: 2,
      totalLessons: 2,
      complete: true,
      updatedAt: "2026-07-02T12:10:00.000Z",
    });
  });
});

describe("createInMemoryLessonProgressStore", () => {
  it("records one completion per learner, module, and lesson", async () => {
    const store = createInMemoryLessonProgressStore();
    const completion = createLessonCompletionRecord({
      learnerEmail: "learner@example.com",
      moduleId: "entering-ophthalmic-care",
      lessonId: "m1-l1-what-techs-do",
      completedAt: "2026-07-02T12:00:00.000Z",
      createId: () => "completion_123",
    });

    expect(await store.recordLessonCompletion(completion)).toMatchObject({
      created: true,
    });
    expect(await store.recordLessonCompletion(completion)).toMatchObject({
      created: false,
    });
    expect(await store.listCompletions()).toHaveLength(1);
    expect(
      await store.getModuleLessonProgress({
        learnerEmail: " learner@example.com ",
        moduleId: "entering-ophthalmic-care",
        lessonIds: ["m1-l1-what-techs-do", "m1-l2-patient-journey"],
      })
    ).toMatchObject({
      completedLessonIds: ["m1-l1-what-techs-do"],
      completedCount: 1,
      totalLessons: 2,
      complete: false,
    });
  });
});
