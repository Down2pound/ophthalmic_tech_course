export const assessmentSchemaTables = [
  "assessment_attempts",
  "assessment_question_results",
] as const;

export const assessmentSchemaSql = `
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  learner_email TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  attempt_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  passing_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_question_results (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS assessment_attempts_learner_quiz_idx
  ON assessment_attempts (learner_email, quiz_id);

CREATE INDEX IF NOT EXISTS assessment_attempts_submitted_at_idx
  ON assessment_attempts (submitted_at);

CREATE UNIQUE INDEX IF NOT EXISTS assessment_question_results_attempt_question_idx
  ON assessment_question_results (attempt_id, question_id);
`;

export function getAssessmentSchemaChecklist(): string[] {
  return [
    "Run the assessment schema against managed PostgreSQL.",
    "Configure DATABASE_URL so assessment attempts use the PostgreSQL repository.",
    "Use durable attempts for refund rules, completion rules, and learner progress reporting.",
    "Keep answer keys server-side and store only scored results.",
  ];
}
