import { describe, expect, it } from "vitest";
import { getWebhookFulfillmentGateStatus } from "./webhookFulfillmentGate";

describe("getWebhookFulfillmentGateStatus", () => {
  it("allows webhook fulfillment when durable launch tables are verified", () => {
    expect(
      getWebhookFulfillmentGateStatus({
        env: { DATABASE_URL: "redacted-database-url" },
        databaseReadiness: {
          schemaVerified: true,
          requiredTables: ["commerce_purchases"],
          checkedTableCount: 1,
          missingTables: [],
          checkFailed: false,
        },
      })
    ).toEqual({
      ready: true,
      warnings: [],
      missingVariables: [],
    });
  });

  it("blocks webhook fulfillment when DATABASE_URL is missing", () => {
    expect(
      getWebhookFulfillmentGateStatus({
        env: {},
        databaseReadiness: {
          schemaVerified: false,
          requiredTables: ["commerce_purchases"],
          checkedTableCount: 0,
          missingTables: ["commerce_purchases"],
          checkFailed: false,
        },
      })
    ).toEqual({
      ready: false,
      warnings: ["Database setup is missing: DATABASE_URL."],
      missingVariables: ["DATABASE_URL"],
    });
  });

  it("blocks webhook fulfillment when launch tables are missing", () => {
    expect(
      getWebhookFulfillmentGateStatus({
        env: { DATABASE_URL: "redacted-database-url" },
        databaseReadiness: {
          schemaVerified: false,
          requiredTables: ["commerce_purchases", "commerce_enrollments"],
          checkedTableCount: 2,
          missingTables: ["commerce_enrollments"],
          checkFailed: false,
        },
      })
    ).toMatchObject({
      ready: false,
      warnings: [
        "Launch database schema is not verified. Missing tables: commerce_enrollments.",
      ],
    });
  });

  it("blocks webhook fulfillment when the schema check fails", () => {
    expect(
      getWebhookFulfillmentGateStatus({
        env: { DATABASE_URL: "redacted-database-url" },
        databaseReadiness: {
          schemaVerified: false,
          requiredTables: ["commerce_purchases"],
          checkedTableCount: 0,
          missingTables: ["commerce_purchases"],
          checkFailed: true,
        },
      })
    ).toMatchObject({
      ready: false,
      warnings: [
        "Launch database schema check failed. Confirm the database is reachable and run pnpm db:setup.",
        "Launch database schema is not verified. Missing tables: commerce_purchases.",
      ],
    });
  });
});
