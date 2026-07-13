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
      "render-deployment-guide.md",
      "domain-and-sharing-guide.md",
      "home-pc-runbook.md",
      "home-pc-command-cheatsheet.md",
      "first-customers-sales-packet.md",
      "first-buyer-fulfillment-checklist.md",
      "revenue-and-sales-tracker-template.md",
      "stripe-setup-guide.md",
      "email-setup-guide.md",
      "database-setup-guide.md",
      "clinical-review-guide.md",
      "go-live-checklist.md",
      "production-env-checklist.md",
      "launch-doctor-report.md",
      "manual-launch-qa-evidence.md",
      "first-sale-support-runbook.md",
      "bootcamp-content-migration-checklist.md",
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
    const renderDeploymentGuide = await readFile(
      path.join(result.outputDir, "render-deployment-guide.md"),
      "utf8"
    );
    const domainAndSharingGuide = await readFile(
      path.join(result.outputDir, "domain-and-sharing-guide.md"),
      "utf8"
    );
    const homePcRunbook = await readFile(
      path.join(result.outputDir, "home-pc-runbook.md"),
      "utf8"
    );
    const homePcCommandCheatsheet = await readFile(
      path.join(result.outputDir, "home-pc-command-cheatsheet.md"),
      "utf8"
    );
    const firstCustomersSalesPacket = await readFile(
      path.join(result.outputDir, "first-customers-sales-packet.md"),
      "utf8"
    );
    const firstBuyerFulfillmentChecklist = await readFile(
      path.join(result.outputDir, "first-buyer-fulfillment-checklist.md"),
      "utf8"
    );
    const revenueAndSalesTrackerTemplate = await readFile(
      path.join(result.outputDir, "revenue-and-sales-tracker-template.md"),
      "utf8"
    );
    const stripeSetupGuide = await readFile(
      path.join(result.outputDir, "stripe-setup-guide.md"),
      "utf8"
    );
    const emailSetupGuide = await readFile(
      path.join(result.outputDir, "email-setup-guide.md"),
      "utf8"
    );
    const databaseSetupGuide = await readFile(
      path.join(result.outputDir, "database-setup-guide.md"),
      "utf8"
    );
    const clinicalReviewGuide = await readFile(
      path.join(result.outputDir, "clinical-review-guide.md"),
      "utf8"
    );
    const goLiveChecklist = await readFile(
      path.join(result.outputDir, "go-live-checklist.md"),
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
    const bootcampContentMigrationChecklist = await readFile(
      path.join(result.outputDir, "bootcamp-content-migration-checklist.md"),
      "utf8"
    );

    expect(readme).toContain("safe to save to Google Drive");
    expect(readme).toContain("Ready for paid launch: no");
    expect(productionEnvChecklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(deploymentGuide).toContain("OptiTech Academy Deployment Guide");
    expect(deploymentGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(renderDeploymentGuide).toContain(
      "OptiTech Academy Render Deployment Guide"
    );
    expect(renderDeploymentGuide).toContain("render.yaml");
    expect(renderDeploymentGuide).toContain("pre-deploy database setup");
    expect(renderDeploymentGuide).toContain("pnpm db:setup");
    expect(renderDeploymentGuide).not.toContain("sk_test_");
    expect(renderDeploymentGuide).not.toContain("whsec_");
    expect(domainAndSharingGuide).toContain(
      "OptiTech Academy Domain And Sharing Guide"
    );
    expect(domainAndSharingGuide).toContain("PUBLIC_APP_URL");
    expect(domainAndSharingGuide).toContain("pnpm launch:sitemap");
    expect(homePcRunbook).toContain("OptiTech Academy Home PC Runbook");
    expect(homePcRunbook).toContain("spawn EPERM");
    expect(homePcRunbook).toContain("pnpm launch:preflight");
    expect(homePcCommandCheatsheet).toContain(
      "OptiTech Academy Home PC Command Cheat Sheet"
    );
    expect(homePcCommandCheatsheet).toContain(
      "LAUNCH_SMOKE_ALLOW_NOT_READY=true"
    );
    expect(homePcCommandCheatsheet).toContain("pnpm db:setup");
    expect(homePcCommandCheatsheet).not.toContain("sk_test_");
    expect(homePcCommandCheatsheet).not.toContain("whsec_");
    expect(firstCustomersSalesPacket).toContain(
      "OptiTech Academy First Customers Sales Packet"
    );
    expect(firstCustomersSalesPacket).toContain("Five seats for $799");
    expect(firstCustomersSalesPacket).toContain("Do not promise certification");
    expect(firstBuyerFulfillmentChecklist).toContain(
      "OptiTech Academy First Buyer Fulfillment Checklist"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "Individual Learner Fulfillment"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "Practice Pack Fulfillment"
    );
    expect(revenueAndSalesTrackerTemplate).toContain(
      "OptiTech Academy Revenue And Sales Tracker Template"
    );
    expect(revenueAndSalesTrackerTemplate).toContain("Weekly Business Review");
    expect(revenueAndSalesTrackerTemplate).toContain(
      "Do not paste secrets, private medical details, or raw access links"
    );
    expect(revenueAndSalesTrackerTemplate).not.toContain("sk_test_");
    expect(revenueAndSalesTrackerTemplate).not.toContain("whsec_");
    expect(stripeSetupGuide).toContain("OptiTech Academy Stripe Setup Guide");
    expect(stripeSetupGuide).toContain("checkout.session.completed");
    expect(emailSetupGuide).toContain("OptiTech Academy Email Setup Guide");
    expect(emailSetupGuide).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(databaseSetupGuide).toContain(
      "OptiTech Academy Database Setup Guide"
    );
    expect(databaseSetupGuide).toContain("pnpm db:setup");
    expect(clinicalReviewGuide).toContain(
      "OptiTech Academy Clinical Review Guide"
    );
    expect(clinicalReviewGuide).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=true"
    );
    expect(goLiveChecklist).toContain("OptiTech Academy Go-Live Checklist");
    expect(goLiveChecklist).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(productionEnvChecklist).toContain("`STRIPE_SECRET_KEY`");
    expect(launchDoctorReport).toContain("OptiTech Academy Launch Doctor");
    expect(launchDoctorReport).toContain("Paid launch ready: no");
    expect(manualQaEvidence).toContain(
      "OptiTech Academy Manual Launch QA Evidence"
    );
    expect(manualQaEvidence).toContain("Test the paid learner flow end to end");
    expect(manualQaEvidence).toContain(
      "Individual checkout success return URL:"
    );
    expect(manualQaEvidence).toContain(
      "Practice checkout success return URL:"
    );
    expect(supportRunbook).toContain(
      "OptiTech Academy First Sale Support Runbook"
    );
    expect(supportRunbook).toContain(
      "Payment Succeeded But Access Is Missing"
    );
    expect(bootcampContentMigrationChecklist).toContain(
      "OptiTech Academy Bootcamp Content Migration Checklist"
    );
    expect(bootcampContentMigrationChecklist).toContain(
      "Bootcamp days mapped: 10"
    );
    expect(bootcampContentMigrationChecklist).toContain(
      "NotebookLM source workspace"
    );
    expect(supportRunbook).not.toContain("sk_test_");
    expect(supportRunbook).not.toContain("whsec_");
    expect(bootcampContentMigrationChecklist).not.toContain("sk_test_");
    expect(bootcampContentMigrationChecklist).not.toContain("whsec_");
    expect(readinessSnapshot).toContain("STRIPE_SECRET_KEY");
    expect(readinessSnapshot).not.toContain("sk_test_");
    expect(readinessSnapshot).not.toContain("whsec_");
  });
});
