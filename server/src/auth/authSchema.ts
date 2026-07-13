export const authSchemaTables = [
  "auth_users",
  "auth_magic_links",
  "auth_sessions",
] as const;

export const authSchemaSql = `
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
`;

export function getAuthSchemaChecklist(): string[] {
  return [
    "Run pnpm db:setup against managed PostgreSQL.",
    "Send passwordless sign-in links through a transactional email provider.",
    "Store only hashed magic-link tokens and secure HTTP-only session cookies.",
    "Attach durable enrollments to authenticated learner user records.",
  ];
}
