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
      "deployment-guide.md",
      "stripe-setup-guide.md",
      "production-env-checklist.md",
      "launch-doctor-report.md",
      "manual-launch-qa-evidence.md",
      "first-sale-support-runbook.md",
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
    const productionEnvChecklist = await readFile(
      path.join(result.outputDir, "production-env-checklist.md"),
      "utf8"
    );
    const deploymentGuide = await readFile(
      path.join(result.outputDir, "deployment-guide.md"),
      "utf8"
    );
    const stripeSetupGuide = await readFile(
      path.join(result.outputDir, "stripe-setup-guide.md"),
      "utf8"
    );
    const launchDoctorReport = await readFile(
      path.join(result.outputDir, "launch-doctor-report.md"),
      "utf8"
    );
    const manualQaEvidence = await readFile(
      path.join(result.outputDir, "manual-launch-qa-evidence.md"),
      "utf8"
    );
    const supportRunbook = await readFile(
      path.join(result.outputDir, "first-sale-support-runbook.md"),
      "utf8"
    );

    expect(readme).toContain("safe to save to Google Drive");
    expect(readme).toContain("Ready for paid launch: no");
    expect(productionEnvChecklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(deploymentGuide).toContain("OptiTech Academy Deployment Guide");
    expect(deploymentGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(stripeSetupGuide).toContain("OptiTech Academy Stripe Setup Guide");
    expect(stripeSetupGuide).toContain("checkout.session.completed");
    expect(productionEnvChecklist).toContain("`STRIPE_SECRET_KEY`");
    expect(launchDoctorReport).toContain("OptiTech Academy Launch Doctor");
    expect(launchDoctorReport).toContain("Paid launch ready: no");
    expect(manualQaEvidence).toContain(
      "OptiTech Academy Manual Launch QA Evidence"
    );
    expect(manualQaEvidence).toContain("Test the paid learner flow end to end");
    expect(supportRunbook).toContain(
      "OptiTech Academy First Sale Support Runbook"
    );
    expect(supportRunbook).toContain(
      "Payment Succeeded But Access Is Missing"
    );
    expect(supportRunbook).not.toContain("sk_test_");
    expect(supportRunbook).not.toContain("whsec_");
    expect(readinessSnapshot).toContain("STRIPE_SECRET_KEY");
    expect(readinessSnapshot).not.toContain("sk_test_");
    expect(readinessSnapshot).not.toContain("whsec_");
  });
});
