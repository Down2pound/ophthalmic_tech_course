import { describe, expect, it, vi } from "vitest";
import { fetchRuntimeLaunchReadiness } from "./launchReadinessClient";

const runtimeReport = {
  generatedAt: "2026-06-26T12:00:00.000Z",
  readyForPaidLaunch: false,
  salesChannels: {
    individualLearner: {
      ready: false,
      blockers: ["Stripe checkout is not configured"],
    },
    practicePacks: {
      ready: false,
      blockers: [
        "Stripe checkout is not configured",
        "Practice seat administration is not protected",
      ],
    },
  },
  staticSummary: {
    ready: false,
    readyCount: 1,
    inProgressCount: 2,
    blockedCount: 4,
    blockers: ["Clinical content review"],
  },
  launchChecklist: [
    {
      id: "clinical-review",
      title: "Clinical content review",
      status: "blocked",
      evidence: "Clinical review required.",
      nextAction: "Collect clinical review signoff.",
    },
  ],
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
    missingModuleOneReviewVariables: [
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
    ],
    reviewerName: "",
    reviewerRole: "",
    reviewDate: "",
    approvedVersion: "",
  },
  warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
  nextSetupSteps: [
    {
      title: "Finish Stripe checkout and webhook setup",
      detail: "Add Stripe keys.",
      command: "POST /api/stripe/webhook",
    },
  ],
  launchActions: [
    {
      id: "production-database",
      title: "Create and initialize hosted PostgreSQL",
      status: "app-command",
      whyItMatters: "Durable records are required.",
      action: "Run pnpm db:setup.",
      evidenceNeeded: "Database setup succeeds.",
    },
  ],
  clinicalReviewPacket: {
    moduleId: "entering-ophthalmic-care",
    moduleTitle: "Module 1: Entering Ophthalmic Care",
    purpose: "Support clinical review.",
    reviewerInstructions: ["Read every lesson."],
    signoffFields: ["Clinical reviewer name"],
    lessons: [
      {
        lessonId: "m1-l1-what-techs-do",
        title: "What Ophthalmic Technicians Do",
        outcome: "Describe the technician role.",
        scopeNote: "No diagnosis.",
        reviewStatus: "draft-reviewed-for-structure",
        clinicalReviewer: "Clinical review required before production sale",
        sourceTitles: ["Source"],
        reviewQuestions: ["Is the lesson clinically accurate?"],
      },
    ],
  },
};

describe("fetchRuntimeLaunchReadiness", () => {
  it("returns the runtime readiness report", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => runtimeReport,
    });

    await expect(fetchRuntimeLaunchReadiness({ fetcher })).resolves.toEqual(
      runtimeReport
    );
    expect(fetcher).toHaveBeenCalledWith("/api/launch/readiness");
  });

  it("surfaces readiness fetch failures", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Readiness unavailable" }),
    });

    await expect(fetchRuntimeLaunchReadiness({ fetcher })).rejects.toThrow(
      "Readiness unavailable"
    );
  });
});
