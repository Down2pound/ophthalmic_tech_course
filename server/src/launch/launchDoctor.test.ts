import { describe, expect, it } from "vitest";
import { renderLaunchDoctorReport } from "./launchDoctor";
import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

const readinessReport: RuntimeLaunchReadinessReport = {
  generatedAt: "2026-07-13T12:00:00.000Z",
  readyForPaidLaunch: false,
  staticSummary: {
    ready: false,
    readyCount: 1,
    inProgressCount: 1,
    blockedCount: 1,
    blockers: ["Clinical content review"],
  },
  launchChecklist: [],
  commerce: {
    checkoutConfigured: false,
    paidEnrollmentEnabled: false,
    webhookConfigured: false,
    missingCheckoutVariables: ["STRIPE_SECRET_KEY"],
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
    requiredTables: ["commerce_purchases", "auth_users"],
    checkedTableCount: 1,
    missingTables: ["auth_users"],
    checkFailed: false,
  },
  clinicalReview: {
    moduleOneReviewConfigured: false,
    moduleOneReviewApproved: false,
    missingModuleOneReviewVariables: ["MODULE_ONE_CLINICAL_REVIEWER_NAME"],
    reviewerName: "",
    reviewerRole: "",
    reviewDate: "",
    approvedVersion: "",
  },
  warnings: [
    "Stripe checkout setup is missing: STRIPE_SECRET_KEY.",
    "Database setup is missing: DATABASE_URL.",
  ],
  nextSetupSteps: [
    {
      title: "Connect hosted PostgreSQL",
      detail: "Set DATABASE_URL in the production host dashboard.",
      command: "DATABASE_URL=...",
    },
  ],
  launchActions: [
    {
      id: "clinical-review-signoff",
      title: "Get clinical review signoff",
      status: "external",
      whyItMatters: "Paid clinical education needs review.",
      action: "Have a reviewer approve Module 1.",
      evidenceNeeded: "Reviewer signoff.",
    },
  ],
  clinicalReviewPacket: {
    moduleId: "entering-ophthalmic-care",
    moduleTitle: "Module 1: Entering Ophthalmic Care",
    purpose: "Support clinical review.",
    reviewerInstructions: [],
    signoffFields: [],
    lessons: [],
  },
};

describe("renderLaunchDoctorReport", () => {
  it("renders a safe human-readable launch status report", () => {
    const report = renderLaunchDoctorReport({ readinessReport });

    expect(report).toContain("# OptiTech Academy Launch Doctor");
    expect(report).toContain("- Paid launch ready: no");
    expect(report).toContain("- Stripe checkout: NEEDS WORK");
    expect(report).toContain("- STRIPE_SECRET_KEY");
    expect(report).toContain("- auth_users");
    expect(report).toContain("## Recommended Next Setup Steps");
    expect(report).toContain("Connect hosted PostgreSQL");
    expect(report).toContain("Command or setting: `DATABASE_URL=...`");
    expect(report).toContain(
      "Get clinical review signoff: Have a reviewer approve Module 1."
    );
    expect(report).not.toContain("sk_test_");
    expect(report).not.toContain("whsec_");
  });
});
