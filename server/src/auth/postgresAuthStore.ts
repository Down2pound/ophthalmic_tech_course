import type { Queryable } from "../db/postgres";
import type { MagicLinkStore } from "./magicLinkStore";
import type { MagicLinkRecord } from "./passwordlessSignIn";
import type { AuthSessionRecord, AuthSessionStore } from "./sessionStore";

interface UserRow extends Record<string, unknown> {
  id: string;
  email: string;
}

interface MagicLinkRow extends Record<string, unknown> {
  id: string;
  email: string;
  token_hash: string;
  purpose: "sign-in";
  created_at: Date | string;
  expires_at: Date | string;
  consumed_at: Date | string | null;
}

interface SessionRow extends Record<string, unknown> {
  id: string;
  email: string;
  session_hash: string;
  created_at: Date | string;
  expires_at: Date | string;
  last_seen_at: Date | string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function userIdFromEmail(email: string): string {
  return `user_${normalizeEmail(email).replace(/[^a-z0-9]/g, "_")}`;
}

function mapMagicLink(row: MagicLinkRow): MagicLinkRecord {
  return {
    id: row.id,
    email: row.email,
    tokenHash: row.token_hash,
    purpose: row.purpose,
    createdAt: toIsoString(row.created_at),
    expiresAt: toIsoString(row.expires_at),
    ...(row.consumed_at ? { consumedAt: toIsoString(row.consumed_at) } : {}),
  };
}

function mapSession(row: SessionRow): AuthSessionRecord {
  return {
    id: row.id,
    email: row.email,
    sessionHash: row.session_hash,
    createdAt: toIsoString(row.created_at),
    expiresAt: toIsoString(row.expires_at),
    lastSeenAt: toIsoString(row.last_seen_at),
  };
}

async function ensureUser(db: Queryable, email: string): Promise<UserRow> {
  const normalizedEmail = normalizeEmail(email);
  const result = await db.query<UserRow>(
    `
    INSERT INTO auth_users (id, email)
    VALUES ($1, $2)
    ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
    RETURNING id, email
    `,
    [userIdFromEmail(normalizedEmail), normalizedEmail]
  );

  return result.rows[0];
}

export function createPostgresMagicLinkStore(db: Queryable): MagicLinkStore {
  return {
    async storeMagicLink(magicLink) {
      const normalizedEmail = normalizeEmail(magicLink.email);
      const user = await ensureUser(db, normalizedEmail);
      const result = await db.query<MagicLinkRow>(
        `
        INSERT INTO auth_magic_links (
          id, user_id, token_hash, email, purpose, expires_at, consumed_at, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
        `,
        [
          magicLink.id,
          user.id,
          magicLink.tokenHash,
          normalizedEmail,
          magicLink.purpose,
          magicLink.expiresAt,
          magicLink.consumedAt ?? null,
          magicLink.createdAt,
        ]
      );

      if (result.rows[0]) {
        return { created: true, magicLink: mapMagicLink(result.rows[0]) };
      }

      const existing = await db.query<MagicLinkRow>(
        "SELECT * FROM auth_magic_links WHERE id = $1",
        [magicLink.id]
      );

      return { created: false, magicLink: mapMagicLink(existing.rows[0]) };
    },
    async listMagicLinks() {
      const result = await db.query<MagicLinkRow>(
        "SELECT * FROM auth_magic_links ORDER BY created_at DESC"
      );

      return result.rows.map(mapMagicLink);
    },
    async findMagicLinksByEmail(email) {
      const result = await db.query<MagicLinkRow>(
        "SELECT * FROM auth_magic_links WHERE email = $1 ORDER BY created_at DESC",
        [normalizeEmail(email)]
      );

      return result.rows.map(mapMagicLink);
    },
    async findMagicLinkByTokenHash(tokenHash) {
      const result = await db.query<MagicLinkRow>(
        "SELECT * FROM auth_magic_links WHERE token_hash = $1",
        [tokenHash]
      );

      return result.rows[0] ? mapMagicLink(result.rows[0]) : undefined;
    },
    async markMagicLinkConsumed(id, consumedAt) {
      const result = await db.query<MagicLinkRow>(
        `
        UPDATE auth_magic_links
        SET consumed_at = COALESCE(consumed_at, $2)
        WHERE id = $1
        RETURNING *
        `,
        [id, consumedAt]
      );

      return result.rows[0] ? mapMagicLink(result.rows[0]) : undefined;
    },
  };
}

export function createPostgresAuthSessionStore(
  db: Queryable
): AuthSessionStore {
  return {
    async storeSession(session) {
      const normalizedEmail = normalizeEmail(session.email);
      const user = await ensureUser(db, normalizedEmail);
      const result = await db.query<SessionRow>(
        `
        INSERT INTO auth_sessions (
          id, user_id, session_hash, expires_at, created_at, last_seen_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
        RETURNING id, session_hash, created_at, expires_at, last_seen_at,
          $7::text AS email
        `,
        [
          session.id,
          user.id,
          session.sessionHash,
          session.expiresAt,
          session.createdAt,
          session.lastSeenAt,
          normalizedEmail,
        ]
      );

      if (result.rows[0]) {
        return { created: true, session: mapSession(result.rows[0]) };
      }

      const existing = await db.query<SessionRow>(
        `
        SELECT s.id, u.email, s.session_hash, s.created_at, s.expires_at, s.last_seen_at
        FROM auth_sessions s
        JOIN auth_users u ON u.id = s.user_id
        WHERE s.id = $1
        `,
        [session.id]
      );

      return { created: false, session: mapSession(existing.rows[0]) };
    },
    async listSessions() {
      const result = await db.query<SessionRow>(
        `
        SELECT s.id, u.email, s.session_hash, s.created_at, s.expires_at, s.last_seen_at
        FROM auth_sessions s
        JOIN auth_users u ON u.id = s.user_id
        ORDER BY s.created_at DESC
        `
      );

      return result.rows.map(mapSession);
    },
    async findSessionByHash(sessionHash) {
      const result = await db.query<SessionRow>(
        `
        SELECT s.id, u.email, s.session_hash, s.created_at, s.expires_at, s.last_seen_at
        FROM auth_sessions s
        JOIN auth_users u ON u.id = s.user_id
        WHERE s.session_hash = $1 AND s.revoked_at IS NULL
        `,
        [sessionHash]
      );

      return result.rows[0] ? mapSession(result.rows[0]) : undefined;
    },
  };
}
