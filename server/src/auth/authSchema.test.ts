import { describe, expect, it } from "vitest";
import {
  authSchemaSql,
  authSchemaTables,
  getAuthSchemaChecklist,
} from "./authSchema";

describe("authSchemaSql", () => {
  it("defines passwordless users, sign-in tokens, and sessions", () => {
    expect(authSchemaTables).toEqual([
      "auth_users",
      "auth_magic_links",
      "auth_sessions",
    ]);
    expect(authSchemaSql).toContain("CREATE TABLE IF NOT EXISTS auth_users");
    expect(authSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS auth_magic_links"
    );
    expect(authSchemaSql).toContain("CREATE TABLE IF NOT EXISTS auth_sessions");
  });

  it("keeps learner identity and sign-in tokens safe enough for production storage", () => {
    expect(authSchemaSql).toContain("email TEXT NOT NULL UNIQUE");
    expect(authSchemaSql).toContain("token_hash TEXT NOT NULL UNIQUE");
    expect(authSchemaSql).not.toContain("token TEXT NOT NULL");
    expect(authSchemaSql).toContain("expires_at TIMESTAMPTZ NOT NULL");
    expect(authSchemaSql).toContain("revoked_at TIMESTAMPTZ");
  });
});

describe("getAuthSchemaChecklist", () => {
  it("summarizes the production gates for passwordless access", () => {
    expect(getAuthSchemaChecklist()).toEqual([
      "Run pnpm db:setup against managed PostgreSQL.",
      "Send passwordless sign-in links through a transactional email provider.",
      "Store only hashed magic-link tokens and secure HTTP-only session cookies.",
      "Attach durable enrollments to authenticated learner user records.",
    ]);
  });
});
