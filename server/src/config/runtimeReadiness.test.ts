import { describe, expect, it } from "vitest";
import { getRuntimeLaunchReadinessReport } from "./runtimeReadiness";

describe("getRuntimeLaunchReadinessReport", () => {
  it("combines launch blockers with runtime commerce setup", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        ENABLE_PAID_ENROLLMENT: "false",
        STRIPE_WEBHOOK_SECRET: "",
        AUTH_SESSION_SECRET: "session-secret",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "",
        DATABASE_URL: "",
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "false",
      },
      now: () => "2026-06-26T12:00:00.000Z",
    });

    expect(report).toMatchObject({
      generatedAt: "2026-06-26T12:00:00.000Z",
      readyForPaidLaunch: false,
      commerce: {
        checkoutConfigured: true,
        paidEnrollmentEnabled: false,
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
      databaseReadiness: {
        schemaVerified: false,
        checkedTableCount: 0,
      },
      clinicalReview: {
        moduleOneReviewConfigured: false,
        moduleOneReviewApproved: false,
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
      "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true."
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
    expect(report.warnings).toContain(
      "Module 1 clinical review signoff is missing or not approved."
    );
    expect(report.warnings).toContain(
      "Module 1 clinical review setup is missing: MODULE_ONE_CLINICAL_REVIEWER_NAME, MODULE_ONE_CLINICAL_REVIEWER_ROLE, MODULE_ONE_CLINICAL_REVIEW_DATE, MODULE_ONE_CLINICAL_APPROVED_VERSION."
    );
  });

  it("marks the clinical review launch gate ready when Module 1 signoff is approved", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "true",
      },
      databaseReadiness: {
        schemaVerified: true,
        requiredTables: ["commerce_purchases"],
        checkedTableCount: 1,
        missingTables: [],
        checkFailed: false,
      },
    });

    expect(report.clinicalReview).toMatchObject({
      moduleOneReviewConfigured: true,
      moduleOneReviewApproved: true,
      reviewerName: "Dr. Reviewer",
      reviewerRole: "Ophthalmologist",
      reviewDate: "2026-07-13",
      approvedVersion: "module-one-v1",
    });
    expect(
      report.launchChecklist.find(item => item.id === "clinical-review")
    ).toMatchObject({
      status: "ready",
      nextAction:
        "Keep the approved packet with launch records and repeat clinical review whenever lesson content changes.",
    });
    expect(report.warnings).not.toContain(
      "Module 1 clinical review signoff is missing or not approved."
    );
  });

  it("blocks paid launch when DATABASE_URL exists but launch tables are missing", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_secret_value",
        AUTH_SESSION_SECRET: "session-secret-value",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "redacted-practice-token",
        DATABASE_URL: "redacted-database-url",
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "true",
      },
      databaseReadiness: {
        schemaVerified: false,
        requiredTables: ["commerce_purchases", "auth_users"],
        checkedTableCount: 2,
        missingTables: ["auth_users"],
        checkFailed: false,
      },
    });

    expect(report.readyForPaidLaunch).toBe(false);
    expect(report.warnings).toContain(
      "Launch database schema is not verified. Missing tables: auth_users."
    );
  });

  it("never includes actual secret values in warnings or missing variable lists", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_secret_value",
        AUTH_SESSION_SECRET: "session-secret-value",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "redacted-practice-token",
        DATABASE_URL: "redacted-database-url",
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "true",
      },
      databaseReadiness: {
        schemaVerified: false,
        requiredTables: ["commerce_purchases"],
        checkedTableCount: 1,
        missingTables: ["commerce_purchases"],
        checkFailed: false,
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
