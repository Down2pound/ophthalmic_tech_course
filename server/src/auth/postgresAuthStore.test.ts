import { describe, expect, it } from "vitest";
import type { QueryParameters, Queryable } from "../db/postgres";
import {
  createPostgresAuthSessionStore,
  createPostgresMagicLinkStore,
} from "./postgresAuthStore";
import { hashSessionToken } from "./sessionStore";

class FakeAuthDatabase implements Queryable {
  readonly calls: Array<{ sql: string; params?: QueryParameters }> = [];

  async query<T extends Record<string, unknown>>(
    sql: string,
    params?: QueryParameters
  ): Promise<{ rows: T[] }> {
    this.calls.push({ sql, params });

    if (sql.includes("INSERT INTO auth_users")) {
      return {
        rows: [{ id: params?.[0], email: params?.[1] } as T],
      };
    }

    if (sql.includes("INSERT INTO auth_magic_links")) {
      return {
        rows: [
          {
            id: params?.[0],
            token_hash: params?.[2],
            email: params?.[3],
            purpose: params?.[4],
            expires_at: params?.[5],
            consumed_at: params?.[6],
            created_at: params?.[7],
          } as T,
        ],
      };
    }

    if (sql.includes("INSERT INTO auth_sessions")) {
      return {
        rows: [
          {
            id: params?.[0],
            session_hash: params?.[2],
            expires_at: params?.[3],
            created_at: params?.[4],
            last_seen_at: params?.[5],
            email: params?.[6],
          } as T,
        ],
      };
    }

    return { rows: [] };
  }
}

describe("PostgreSQL auth stores", () => {
  it("stores normalized magic links without raw tokens", async () => {
    const db = new FakeAuthDatabase();
    const store = createPostgresMagicLinkStore(db);

    const result = await store.storeMagicLink({
      id: "magic_link_123",
      email: " Learner@Example.com ",
      tokenHash: "stored-token-hash",
      purpose: "sign-in",
      createdAt: "2026-07-02T12:00:00.000Z",
      expiresAt: "2026-07-02T12:15:00.000Z",
    });

    expect(result).toEqual({
      created: true,
      magicLink: {
        id: "magic_link_123",
        email: "learner@example.com",
        tokenHash: "stored-token-hash",
        purpose: "sign-in",
        createdAt: "2026-07-02T12:00:00.000Z",
        expiresAt: "2026-07-02T12:15:00.000Z",
      },
    });
    expect(db.calls[0].params).toEqual([
      "user_learner_example_com",
      "learner@example.com",
    ]);
    expect(JSON.stringify(db.calls)).not.toContain("valid-raw-token");
  });

  it("stores sessions with hashed tokens and joined learner email", async () => {
    const db = new FakeAuthDatabase();
    const store = createPostgresAuthSessionStore(db);

    const result = await store.storeSession({
      id: "session_123",
      email: " Learner@Example.com ",
      sessionHash: hashSessionToken("private-session-token"),
      createdAt: "2026-07-02T12:05:00.000Z",
      expiresAt: "2026-08-01T12:05:00.000Z",
      lastSeenAt: "2026-07-02T12:05:00.000Z",
    });

    expect(result.created).toBe(true);
    expect(result.session).toMatchObject({
      id: "session_123",
      email: "learner@example.com",
      createdAt: "2026-07-02T12:05:00.000Z",
      expiresAt: "2026-08-01T12:05:00.000Z",
    });
    expect(result.session.sessionHash).toBe(
      hashSessionToken("private-session-token")
    );
    expect(JSON.stringify(db.calls)).not.toContain("private-session-token");
  });
});
