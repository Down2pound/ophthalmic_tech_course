import { describe, expect, it } from "vitest";
import {
  assessmentSchemaSql,
  assessmentSchemaTables,
  getAssessmentSchemaChecklist,
} from "./assessmentSchema";

describe("assessmentSchemaSql", () => {
  it("defines durable assessment attempt and result tables", () => {
    expect(assessmentSchemaTables).toEqual([
      "assessment_attempts",
      "assessment_question_results",
    ]);
    expect(assessmentSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS assessment_attempts"
    );
    expect(assessmentSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS assessment_question_results"
    );
    expect(assessmentSchemaSql).toContain("learner_email TEXT NOT NULL");
    expect(assessmentSchemaSql).toContain("quiz_id TEXT NOT NULL");
    expect(assessmentSchemaSql).toContain("score INTEGER NOT NULL");
    expect(assessmentSchemaSql).toContain("passed BOOLEAN NOT NULL");
    expect(assessmentSchemaSql).toContain(
      "attempt_id TEXT NOT NULL REFERENCES assessment_attempts"
    );
    expect(assessmentSchemaSql).toContain("question_id TEXT NOT NULL");
    expect(assessmentSchemaSql).toContain("is_correct BOOLEAN NOT NULL");
  });

  it("supports learner progress and refund/completion audits", () => {
    expect(assessmentSchemaSql).toContain(
      "CREATE INDEX IF NOT EXISTS assessment_attempts_learner_quiz_idx"
    );
    expect(assessmentSchemaSql).toContain(
      "CREATE INDEX IF NOT EXISTS assessment_attempts_submitted_at_idx"
    );
    expect(assessmentSchemaSql).toContain(
      "CREATE UNIQUE INDEX IF NOT EXISTS assessment_question_results_attempt_question_idx"
    );
  });
});

describe("getAssessmentSchemaChecklist", () => {
  it("summarizes production migration steps", () => {
    expect(getAssessmentSchemaChecklist()).toEqual([
      "Run the assessment schema against managed PostgreSQL.",
      "Configure DATABASE_URL so assessment attempts use the PostgreSQL repository.",
      "Use durable attempts for refund rules, completion rules, and learner progress reporting.",
      "Keep answer keys server-side and store only scored results.",
    ]);
  });
});
