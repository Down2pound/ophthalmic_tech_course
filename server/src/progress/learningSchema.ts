export const learningSchemaTables = ["learning_lesson_completions"] as const;

export const learningSchemaSql = `
CREATE TABLE IF NOT EXISTS learning_lesson_completions (
  id TEXT PRIMARY KEY,
  learner_email TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learner_email, module_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS learning_lesson_completions_learner_module_idx
  ON learning_lesson_completions (learner_email, module_id);
`;

export function getLearningSchemaChecklist(): string[] {
  return [
    "Run pnpm db:setup against managed PostgreSQL.",
    "Configure DATABASE_URL so lesson completion uses the PostgreSQL repository.",
    "Use durable lesson completions for learner progress and completion rules.",
  ];
}
