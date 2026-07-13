import { createHash, randomBytes as nodeRandomBytes } from "node:crypto";
import type { AuthStoreResult } from "./magicLinkStore";

export interface AuthSessionRecord {
  id: string;
  email: string;
  sessionHash: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
}

export interface AuthSessionStore {
  storeSession(
    session: AuthSessionRecord
  ): AuthStoreResult<{ created: boolean; session: AuthSessionRecord }>;
  listSessions(): AuthStoreResult<AuthSessionRecord[]>;
  findSessionByHash(
    sessionHash: string
  ): AuthStoreResult<AuthSessionRecord | undefined>;
}

interface CreateAuthSessionInput {
  email: string;
  rawSessionToken: string;
  id: string;
  createdAt: string;
  expiresInDays?: number;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function toBase64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function createRawSessionToken(
  randomBytes: (size: number) => Buffer = nodeRandomBytes
): string {
  return toBase64Url(randomBytes(32));
}

export function hashSessionToken(rawSessionToken: string): string {
  return createHash("sha256").update(rawSessionToken).digest("hex");
}

export function createAuthSession({
  email,
  rawSessionToken,
  id,
  createdAt,
  expiresInDays = 30,
}: CreateAuthSessionInput): AuthSessionRecord {
  const createdDate = new Date(createdAt);

  return {
    id,
    email: email.trim().toLowerCase(),
    sessionHash: hashSessionToken(rawSessionToken),
    createdAt: createdDate.toISOString(),
    expiresAt: addDays(createdDate, expiresInDays).toISOString(),
    lastSeenAt: createdDate.toISOString(),
  };
}

export function createInMemoryAuthSessionStore(): AuthSessionStore {
  const sessionsById = new Map<string, AuthSessionRecord>();

  return {
    storeSession(session) {
      const existing = sessionsById.get(session.id);

      if (existing) {
        return { created: false, session: existing };
      }

      sessionsById.set(session.id, session);

      return { created: true, session };
    },
    listSessions() {
      return Array.from(sessionsById.values());
    },
    findSessionByHash(sessionHash) {
      return Array.from(sessionsById.values()).find(
        session => session.sessionHash === sessionHash
      );
    },
  };
}
