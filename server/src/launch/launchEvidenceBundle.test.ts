import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createLaunchEvidenceBundle } from "./launchEvidenceBundle";
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
  warnings: ["Stripe checkout setup is missing: STRIPE_SECRET_KEY."],
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

describe("createLaunchEvidenceBundle", () => {
  it("writes the safe launch handoff files", async () => {
    const projectRoot = process.cwd();
    const outputParent = await mkdtemp(
      path.join(tmpdir(), "optitech-launch-evidence-")
    );

    const result = await createLaunchEvidenceBundle({
      projectRoot,
      outputDir: outputParent,
      generatedAt: "2026-07-13T12:00:00.000Z",
      readinessReport,
    });

    expect(result.files).toEqual([
      "README.md",
      "production-launch-package.md",
      "module-1-clinical-review-packet.md",
      "runtime-readiness-snapshot.json",
    ]);

    const readme = await readFile(
      path.join(result.outputDir, "README.md"),
      "utf8"
    );
    const readinessSnapshot = await readFile(
      path.join(result.outputDir, "runtime-readiness-snapshot.json"),
      "utf8"
    );

    expect(readme).toContain("safe to save to Google Drive");
    expect(readme).toContain("Ready for paid launch: no");
    expect(readinessSnapshot).toContain("STRIPE_SECRET_KEY");
    expect(readinessSnapshot).not.toContain("sk_test_");
    expect(readinessSnapshot).not.toContain("whsec_");
  });
});
