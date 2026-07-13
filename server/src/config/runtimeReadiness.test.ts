import { describe, expect, it } from "vitest";
import { getRuntimeLaunchReadinessReport } from "./runtimeReadiness";

describe("getRuntimeLaunchReadinessReport", () => {
  it("combines launch blockers with runtime commerce setup", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        STRIPE_WEBHOOK_SECRET: "",
        AUTH_SESSION_SECRET: "session-secret",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "",
        DATABASE_URL: "",
      },
      now: () => "2026-06-26T12:00:00.000Z",
    });

    expect(report).toMatchObject({
      generatedAt: "2026-06-26T12:00:00.000Z",
      readyForPaidLaunch: false,
      commerce: {
        checkoutConfigured: true,
        webhookConfigured: false,
        missingCheckoutVariables: [],
        missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
      },
      auth: {
        passwordlessConfigured: false,
        missingPasswordlessVariables: ["TRANSACTIONAL_EMAIL_API_KEY"],
      },
      practiceSeatAdmin: {
        practiceSeatAdminConfigured: false,
        missingPracticeSeatAdminVariables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
      },
      database: {
        databaseConfigured: false,
        missingDatabaseVariables: ["DATABASE_URL"],
      },
    });
    expect(report.staticSummary.blockedCount).toBeGreaterThan(0);
    expect(report.launchActions.map(action => action.id)).toContain(
      "production-database"
    );
    expect(report.clinicalReviewPacket.lessons.length).toBeGreaterThan(0);
    expect(report.clinicalReviewPacket.signoffFields).toContain(
      "Clinical reviewer name"
    );
    expect(report.warnings).toContain(
      "Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."
    );
    expect(report.warnings).toContain(
      "Passwordless sign-in setup is missing: TRANSACTIONAL_EMAIL_API_KEY."
    );
    expect(report.warnings).toContain(
      "Practice seat assignment setup is missing: PRACTICE_SEAT_ADMIN_TOKEN."
    );
    expect(report.warnings).toContain(
      "Database setup is missing: DATABASE_URL."
    );
  });

  it("never includes actual secret values in warnings or missing variable lists", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        STRIPE_WEBHOOK_SECRET: "whsec_secret_value",
        AUTH_SESSION_SECRET: "session-secret-value",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "redacted-practice-token",
        DATABASE_URL: "redacted-database-url",
      },
    });

    const serializedReport = JSON.stringify(report);

    expect(serializedReport).not.toContain("sk_test_secret_value");
    expect(serializedReport).not.toContain("whsec_secret_value");
    expect(serializedReport).not.toContain("session-secret-value");
    expect(serializedReport).not.toContain("email-secret-value");
    expect(serializedReport).not.toContain("redacted-practice-token");
    expect(serializedReport).not.toContain("redacted-database-url");
  });
});
