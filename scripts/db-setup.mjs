#!/usr/bin/env node
import pg from "pg";

const { Pool } = pg;

const launchDatabaseSchemas = [
  {
    id: "commerce",
    tables: [
      "commerce_purchases",
      "commerce_enrollments",
      "commerce_practice_seat_packs",
      "commerce_practice_seat_assignments",
      "commerce_practice_inquiries",
      "commerce_learner_interests",
    ],
    sql: `
CREATE TABLE IF NOT EXISTS commerce_purchases (
  id TEXT PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  checkout_session_id TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT NOT NULL,
  access_months INTEGER NOT NULL,
  seat_count INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_enrollments (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES commerce_purchases(id),
  checkout_session_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  learner_email TEXT NOT NULL,
  status TEXT NOT NULL,
  access_started_at TIMESTAMPTZ NOT NULL,
  access_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commerce_purchases_purchaser_email_idx
  ON commerce_purchases (purchaser_email);

CREATE INDEX IF NOT EXISTS commerce_enrollments_learner_email_idx
  ON commerce_enrollments (learner_email);

CREATE UNIQUE INDEX IF NOT EXISTS commerce_enrollments_source_learner_idx
  ON commerce_enrollments (checkout_session_id, learner_email);

CREATE TABLE IF NOT EXISTS commerce_practice_seat_packs (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES commerce_purchases(id),
  checkout_session_id TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  assigned_seats INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  access_started_at TIMESTAMPTZ NOT NULL,
  access_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (total_seats > 0),
  CHECK (assigned_seats >= 0),
  CHECK (assigned_seats <= total_seats)
);

CREATE INDEX IF NOT EXISTS commerce_practice_seat_packs_purchaser_email_idx
  ON commerce_practice_seat_packs (purchaser_email);

CREATE TABLE IF NOT EXISTS commerce_practice_seat_assignments (
  id TEXT PRIMARY KEY,
  seat_pack_id TEXT NOT NULL REFERENCES commerce_practice_seat_packs(id),
  learner_email TEXT NOT NULL,
  status TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seat_pack_id, learner_email)
);

CREATE INDEX IF NOT EXISTS commerce_practice_seat_assignments_learner_email_idx
  ON commerce_practice_seat_assignments (learner_email);

CREATE TABLE IF NOT EXISTS commerce_practice_inquiries (
  id TEXT PRIMARY KEY,
  practice_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  estimated_learner_count INTEGER,
  target_timeline TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS commerce_practice_inquiries_contact_email_idx
  ON commerce_practice_inquiries (contact_email);

CREATE TABLE IF NOT EXISTS commerce_learner_interests (
  id TEXT PRIMARY KEY,
  learner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  background TEXT NOT NULL,
  goal TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS commerce_learner_interests_email_idx
  ON commerce_learner_interests (email);
`,
  },
  {
    id: "auth",
    tables: ["auth_users", "auth_magic_links", "auth_sessions"],
    sql: `
CREATE TABLE IF NOT EXISTS auth_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'learner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_magic_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth_users(id),
  token_hash TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth_users(id),
  session_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS auth_magic_links_user_id_idx
  ON auth_magic_links (user_id);

CREATE INDEX IF NOT EXISTS auth_magic_links_email_idx
  ON auth_magic_links (email);

CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx
  ON auth_sessions (user_id);
`,
  },
  {
    id: "learning",
    tables: ["learning_lesson_completions"],
    sql: `
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
`,
  },
  {
    id: "assessment",
    tables: ["assessment_attempts", "assessment_question_results"],
    sql: `
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
`,
  },
];

function createPool() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to set up the launch database.");
  }

  return new Pool({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "true",
          },
  });
}

async function setupLaunchDatabase(pool) {
  const appliedSchemas = [];

  for (const schema of launchDatabaseSchemas) {
    await pool.query(schema.sql);
    appliedSchemas.push({
      id: schema.id,
      tables: schema.tables,
    });
  }

  return { appliedSchemas };
}

async function main() {
  const pool = createPool();

  try {
    const result = await setupLaunchDatabase(pool);

    console.log("Launch database setup complete.");
    for (const schema of result.appliedSchemas) {
      console.log(`- ${schema.id}: ${schema.tables.join(", ")}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Launch database setup failed.";
  console.error(message);
  process.exitCode = 1;
});
