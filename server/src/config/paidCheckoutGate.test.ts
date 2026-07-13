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
  STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
  PUBLIC_APP_URL: "https://academy.spindeleye.com",
  ENABLE_PAID_ENROLLMENT: "true",
  STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdef",
  AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
  TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
  TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value-123456",
  SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
  PRACTICE_SEAT_ADMIN_TOKEN: "practice-seat-token-with-at-least-32-chars",
  DATABASE_URL: "postgres://optitech_user:credential@db.internal:5432/optitech",
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

  it("blocks checkout when copied example placeholders are still present", () => {
    const status = getPaidCheckoutGateStatus({
      env: {
        ...launchReadyEnv,
        STRIPE_SECRET_KEY: "sk_test_replace_with_your_secret_key",
        PUBLIC_APP_URL: "http://localhost:3000",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        DATABASE_URL: "replace_with_managed_postgres_connection_string",
        STRIPE_WEBHOOK_SECRET: "whsec_replace_with_your_webhook_signing_secret",
        AUTH_SESSION_SECRET: "replace_with_a_long_random_session_secret",
        PRACTICE_SEAT_ADMIN_TOKEN: "replace_with_a_long_random_admin_token",
      },
      databaseReadiness: verifiedDatabaseReadiness,
    });

    expect(status.ready).toBe(false);
    expect(status.missingVariables).toEqual(
      expect.arrayContaining([
        "STRIPE_SECRET_KEY",
        "PUBLIC_APP_URL",
        "STRIPE_WEBHOOK_SECRET",
        "AUTH_SESSION_SECRET",
        "TRANSACTIONAL_EMAIL_API_URL",
        "SIGN_IN_FROM_EMAIL",
        "PRACTICE_SEAT_ADMIN_TOKEN",
        "DATABASE_URL",
      ])
    );
    expect(JSON.stringify(status)).not.toContain("replace_with");
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
