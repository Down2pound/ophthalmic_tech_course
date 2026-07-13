import { describe, expect, it } from "vitest";
import type { QueryParameters, Queryable } from "../db/postgres";
import { createPostgresLessonProgressStore } from "./postgresLessonProgressStore";

class FakeLearningDatabase implements Queryable {
  readonly calls: Array<{ sql: string; params?: QueryParameters }> = [];
  private readonly completions: Record<string, Record<string, unknown>> = {};

  async query<T extends Record<string, unknown>>(
    sql: string,
    params?: QueryParameters
  ): Promise<{ rows: T[] }> {
    this.calls.push({ sql, params });

    if (sql.includes("INSERT INTO learning_lesson_completions")) {
      const key = `${params?.[1]}:${params?.[2]}:${params?.[3]}`;

      if (this.completions[key]) {
        return { rows: [] };
      }

      this.completions[key] = {
        id: params?.[0],
        learner_email: params?.[1],
        module_id: params?.[2],
        lesson_id: params?.[3],
        completed_at: params?.[4],
      };

      return { rows: [this.completions[key] as T] };
    }

    if (
      sql.includes("FROM learning_lesson_completions") &&
      sql.includes("lesson_id = $3")
    ) {
      const key = `${params?.[0]}:${params?.[1]}:${params?.[2]}`;
      const row = this.completions[key];
      return { rows: row ? [row as T] : [] };
    }

    if (sql.includes("FROM learning_lesson_completions")) {
      const rows = Object.values(this.completions).filter(
        row =>
          row.learner_email === params?.[0] && row.module_id === params?.[1]
      );

      return { rows: rows as T[] };
    }

    return { rows: [] };
  }
}

describe("createPostgresLessonProgressStore", () => {
  it("stores durable lesson completion and reports progress", async () => {
    const db = new FakeLearningDatabase();
    const store = createPostgresLessonProgressStore(db);

    const result = await store.recordLessonCompletion({
      id: "completion_123",
      learnerEmail: " Learner@Example.com ",
      moduleId: "entering-ophthalmic-care",
      lessonId: "m1-l1-what-techs-do",
      completedAt: "2026-07-02T12:00:00.000Z",
    });

    expect(result).toMatchObject({
      created: true,
      completion: {
        learnerEmail: "learner@example.com",
        lessonId: "m1-l1-what-techs-do",
      },
    });
    expect(
      await store.getModuleLessonProgress({
        learnerEmail: "learner@example.com",
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
