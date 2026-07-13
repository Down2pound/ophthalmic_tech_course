import { describe, expect, it } from "vitest";
import { getPaidCheckoutGateStatus } from "./paidCheckoutGate";

const verifiedDatabaseReadiness = {
  schemaVerified: true,
  requiredTables: ["commerce_purchases"],
  checkedTableCount: 1,
  missingTables: [],
  checkFailed: false,
};

const launchReadyEnv = {
  STRIPE_SECRET_KEY: "sk_test_secret_value",
  PUBLIC_APP_URL: "http://localhost:3000",
  ENABLE_PAID_ENROLLMENT: "true",
  STRIPE_WEBHOOK_SECRET: "whsec_secret_value",
  AUTH_SESSION_SECRET: "session-secret-value",
  TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
  TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value",
  SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
  PRACTICE_SEAT_ADMIN_TOKEN: "practice-seat-token",
  DATABASE_URL: "redacted-database-url",
  MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
  MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
  MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
  MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
  MODULE_ONE_CLINICAL_REVIEW_APPROVED: "true",
};

describe("getPaidCheckoutGateStatus", () => {
  it("allows checkout only when launch-critical runtime gates are ready", () => {
    expect(
      getPaidCheckoutGateStatus({
        env: launchReadyEnv,
        databaseReadiness: verifiedDatabaseReadiness,
      })
    ).toEqual({
      ready: true,
      warnings: [],
      missingVariables: [],
    });
  });

  it("blocks checkout when the paid enrollment switch is disabled", () => {
    expect(
      getPaidCheckoutGateStatus({
        env: {
          ...launchReadyEnv,
          ENABLE_PAID_ENROLLMENT: "false",
        },
        databaseReadiness: verifiedDatabaseReadiness,
      })
    ).toMatchObject({
      ready: false,
      warnings: [
        "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
      ],
    });
  });

  it("blocks checkout when clinical review is not approved", () => {
    expect(
      getPaidCheckoutGateStatus({
        env: {
          ...launchReadyEnv,
          MODULE_ONE_CLINICAL_REVIEW_APPROVED: "false",
        },
        databaseReadiness: verifiedDatabaseReadiness,
      })
    ).toMatchObject({
      ready: false,
      warnings: [
        "Module 1 clinical review signoff is missing or not approved.",
      ],
    });
  });

  it("blocks checkout when launch database tables are missing", () => {
    expect(
      getPaidCheckoutGateStatus({
        env: launchReadyEnv,
        databaseReadiness: {
          schemaVerified: false,
          requiredTables: ["commerce_purchases", "auth_users"],
          checkedTableCount: 2,
          missingTables: ["auth_users"],
          checkFailed: false,
        },
      })
    ).toMatchObject({
      ready: false,
      warnings: [
        "Launch database schema is not verified. Missing tables: auth_users.",
      ],
    });
  });

  it("reports missing variables without exposing secret values", () => {
    const status = getPaidCheckoutGateStatus({
      env: {},
      databaseReadiness: {
        schemaVerified: false,
        requiredTables: ["commerce_purchases"],
        checkedTableCount: 0,
        missingTables: ["commerce_purchases"],
        checkFailed: false,
      },
    });

    expect(status.ready).toBe(false);
    expect(status.missingVariables).toContain("STRIPE_SECRET_KEY");
    expect(status.missingVariables).toContain("DATABASE_URL");
    expect(JSON.stringify(status)).not.toContain("secret-value");
  });
});
