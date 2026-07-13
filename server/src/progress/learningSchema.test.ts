import { describe, expect, it } from "vitest";
import {
  getLearningSchemaChecklist,
  learningSchemaSql,
  learningSchemaTables,
} from "./learningSchema";

describe("learningSchemaSql", () => {
  it("defines durable lesson completion storage", () => {
    expect(learningSchemaTables).toEqual(["learning_lesson_completions"]);
    expect(learningSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS learning_lesson_completions"
    );
    expect(learningSchemaSql).toContain("learner_email TEXT NOT NULL");
    expect(learningSchemaSql).toContain("module_id TEXT NOT NULL");
    expect(learningSchemaSql).toContain("lesson_id TEXT NOT NULL");
    expect(learningSchemaSql).toContain(
      "UNIQUE (learner_email, module_id, lesson_id)"
    );
  });
});

describe("getLearningSchemaChecklist", () => {
  it("summarizes durable lesson progress setup", () => {
    expect(getLearningSchemaChecklist()).toEqual([
      "Run pnpm db:setup against managed PostgreSQL.",
      "Configure DATABASE_URL so lesson completion uses the PostgreSQL repository.",
      "Use durable lesson completions for learner progress and completion rules.",
    ]);
  });
});
