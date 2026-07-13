import { describe, expect, it } from "vitest";
import { getRuntimeLaunchReadinessReport } from "./runtimeReadiness";

describe("getRuntimeLaunchReadinessReport", () => {
  it("combines launch blockers with runtime commerce setup", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
        ENABLE_PAID_ENROLLMENT: "false",
        STRIPE_WEBHOOK_SECRET: "",
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "",
        ALERT_ADMIN_TOKEN: "",
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
      salesChannels: {
        individualLearner: {
          ready: false,
        },
        practicePacks: {
          ready: false,
        },
      },
      commerce: {
        checkoutConfigured: true,
        paidEnrollmentEnabled: false,
        webhookConfigured: false,
        stripeSecretKeyMode: "test",
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
      alertAdmin: {
        alertAdminConfigured: false,
        missingAlertAdminVariables: ["ALERT_ADMIN_TOKEN"],
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
    expect(report.salesChannels.individualLearner.blockers).toContain(
      "Stripe live-mode secret key is not configured"
    );
    expect(report.salesChannels.practicePacks.blockers).toContain(
      "Practice seat administration is not protected"
    );
    expect(report.nextSetupSteps.map(step => step.title)).toEqual([
      "Finish Module 1 clinical review",
      "Connect hosted PostgreSQL",
      "Finish Stripe checkout and webhook setup",
      "Switch Stripe to live mode before real sales",
      "Configure passwordless sign-in email",
      "Protect practice seat assignment",
      "Protect alert-button administration",
      "Keep paid enrollment disabled until final proof",
    ]);
    expect(
      report.nextSetupSteps.find(
        step => step.title === "Connect hosted PostgreSQL"
      )
    ).toMatchObject({
      command: "DATABASE_URL=... DATABASE_SSL=true",
    });
    expect(report.clinicalReviewPacket.lessons.length).toBeGreaterThan(0);
    expect(report.clinicalReviewPacket.signoffFields).toContain(
      "Clinical reviewer name"
    );
    expect(report.warnings).toContain(
      "Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."
    );
    expect(report.warnings).toContain(
      "Stripe checkout is configured with a test-mode secret key. Use a live Stripe secret key before real sales."
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
      "Alert administration setup is missing: ALERT_ADMIN_TOKEN."
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
    expect(report.salesChannels.individualLearner.blockers).not.toContain(
      "Module 1 clinical review is not approved"
    );
  });

  it("blocks paid launch when DATABASE_URL exists but launch tables are missing", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdef",
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value-123456",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "practice-seat-token-with-at-least-32-chars",
        ALERT_ADMIN_TOKEN: "alert-admin-token-with-at-least-32-chars",
        DATABASE_URL:
          "postgres://optitech_user:credential@db.internal:5432/optitech",
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
    expect(report.salesChannels.individualLearner).toMatchObject({
      ready: false,
      blockers: ["Hosted database schema is not verified"],
    });
    expect(report.salesChannels.practicePacks).toMatchObject({
      ready: false,
      blockers: ["Hosted database schema is not verified"],
    });
    expect(report.warnings).toContain(
      "Launch database schema is not verified. Missing tables: auth_users."
    );
    expect(report.nextSetupSteps).toContainEqual({
      title: "Create launch database tables",
      detail:
        "Run the setup command against the same hosted database used by the deployed app, then recheck launch readiness.",
      command: "pnpm db:setup",
    });
  });

  it("never includes actual secret values in warnings or missing variable lists", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdef",
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-secret-value-123456",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PRACTICE_SEAT_ADMIN_TOKEN: "practice-seat-token-with-at-least-32-chars",
        ALERT_ADMIN_TOKEN: "alert-admin-token-with-at-least-32-chars",
        DATABASE_URL:
          "postgres://optitech_user:credential@db.internal:5432/optitech",
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

    expect(serializedReport).not.toContain("sk_live_1234567890abcdef");
    expect(serializedReport).not.toContain("whsec_1234567890abcdef");
    expect(serializedReport).not.toContain(
      "session-secret-value-with-at-least-32-chars"
    );
    expect(serializedReport).not.toContain("email-secret-value-123456");
    expect(serializedReport).not.toContain(
      "practice-seat-token-with-at-least-32-chars"
    );
    expect(serializedReport).not.toContain(
      "alert-admin-token-with-at-least-32-chars"
    );
    expect(serializedReport).not.toContain(
      "postgres://optitech_user:credential@db.internal:5432/optitech"
    );
    expect(serializedReport).not.toContain("email-secret-value-123456");
  });
});
