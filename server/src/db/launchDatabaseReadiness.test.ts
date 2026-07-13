import { describe, expect, it } from "vitest";
import type { QueryParameters, Queryable } from "./postgres";
import { getLaunchDatabaseReadiness } from "./launchDatabaseReadiness";

function createTableCheckDb(existingTables: string[]): Queryable {
  return {
    async query<T extends Record<string, unknown>>(
      _sql: string,
      params?: QueryParameters
    ) {
      const tableName = String(params?.[0] ?? "");

      return {
        rows: [
          {
            existing_table: existingTables.includes(tableName)
              ? tableName
              : null,
          },
        ] as T[],
      };
    },
  };
}

describe("getLaunchDatabaseReadiness", () => {
  const schemas = [
    {
      id: "commerce" as const,
      tables: ["commerce_purchases", "commerce_enrollments"] as const,
      sql: "CREATE TABLE commerce_purchases ();",
    },
    {
      id: "auth" as const,
      tables: ["auth_users"] as const,
      sql: "CREATE TABLE auth_users ();",
    },
  ];

  it("reports the launch schema verified when every required table exists", async () => {
    await expect(
      getLaunchDatabaseReadiness({
        db: createTableCheckDb([
          "commerce_purchases",
          "commerce_enrollments",
          "auth_users",
        ]),
        schemas,
      })
    ).resolves.toEqual({
      schemaVerified: true,
      requiredTables: [
        "commerce_purchases",
        "commerce_enrollments",
        "auth_users",
      ],
      checkedTableCount: 3,
      missingTables: [],
      checkFailed: false,
    });
  });

  it("reports missing launch tables", async () => {
    await expect(
      getLaunchDatabaseReadiness({
        db: createTableCheckDb(["commerce_purchases"]),
        schemas,
      })
    ).resolves.toMatchObject({
      schemaVerified: false,
      checkedTableCount: 3,
      missingTables: ["commerce_enrollments", "auth_users"],
      checkFailed: false,
    });
  });

  it("does not verify schema when no database connection is available", async () => {
    await expect(
      getLaunchDatabaseReadiness({ db: null, schemas })
    ).resolves.toMatchObject({
      schemaVerified: false,
      checkedTableCount: 0,
      missingTables: [
        "commerce_purchases",
        "commerce_enrollments",
        "auth_users",
      ],
      checkFailed: false,
    });
  });

  it("fails closed when the database table check cannot run", async () => {
    const db: Queryable = {
      async query() {
        throw new Error("connection failed");
      },
    };

    await expect(
      getLaunchDatabaseReadiness({ db, schemas })
    ).resolves.toMatchObject({
      schemaVerified: false,
      checkedTableCount: 0,
      missingTables: [
        "commerce_purchases",
        "commerce_enrollments",
        "auth_users",
      ],
      checkFailed: true,
    });
  });
});
