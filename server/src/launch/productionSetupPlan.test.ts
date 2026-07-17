import { describe, expect, it } from "vitest";
import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import { renderProductionSetupPlan } from "./productionSetupPlan";

const baseReadinessReport: RuntimeLaunchReadinessReport = {
  generatedAt: "2026-07-17T12:00:00.000Z",
  readyForPaidLaunch: false,
  salesChannels: {
    individualLearner: {
      ready: false,
      blockers: ["Stripe checkout is not configured"],
    },
    practicePacks: {
      ready: false,
      blockers: ["Practice seat administration is not protected"],
    },
  },
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
    stripeSecretKeyMode: "missing",
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
    requiredTables: ["commerce_purchases"],
    checkedTableCount: 0,
    missingTables: ["commerce_purchases"],
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
  warnings: [],
  nextSetupSteps: [
    {
      title: "Finish Module 1 clinical review",
      detail: "Resolve corrections and set the MODULE_ONE_CLINICAL_* values.",
      command: "GET /api/launch/clinical-review-packet.md",
    },
    {
      title: "Connect hosted PostgreSQL",
      detail: "Set DATABASE_URL and DATABASE_SSL=true.",
      command: "DATABASE_URL=... DATABASE_SSL=true",
    },
  ],
  launchActions: [],
  clinicalReviewPacket: {
    moduleId: "entering-ophthalmic-care",
    moduleTitle: "Module 1: Entering Ophthalmic Care",
    purpose: "Clinical review",
    reviewerInstructions: [],
    signoffFields: [],
    lessons: [],
  },
};

describe("renderProductionSetupPlan", () => {
  it("renders a beginner-safe next-step plan without secret values", () => {
    const plan = renderProductionSetupPlan({
      readinessReport: baseReadinessReport,
      appUrl: "https://learn.example.com",
    });

    expect(plan).toContain("Launch Next-Step Command Center");
    expect(plan).toContain("Current phase: production setup");
    expect(plan).toContain("Paid launch ready: no");
    expect(plan).toContain("Finish Module 1 clinical review");
    expect(plan).toContain("Connect hosted PostgreSQL");
    expect(plan).toContain("PUBLIC_APP_URL=https://learn.example.com");
    expect(plan).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(plan).not.toContain("sk_live_");
    expect(plan).not.toContain("whsec_");
  });
});
