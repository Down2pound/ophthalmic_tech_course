#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(
  projectRoot,
  process.env.LAUNCH_EVIDENCE_DIR || "launch-evidence"
);

const evidenceFiles = [
  {
    source: "docs/launch/production-launch-package.md",
    target: "production-launch-package.md",
    description: "launch handoff checklist.",
  },
  {
    source: "docs/launch/deployment-guide.md",
    target: "deployment-guide.md",
    description: "beginner-friendly production setup recipe.",
  },
  {
    source: "docs/launch/render-deployment-guide.md",
    target: "render-deployment-guide.md",
    description: "Render Blueprint setup recipe.",
  },
  {
    source: "docs/launch/online-start-guide.md",
    target: "online-start-guide.md",
    description: "first-hour path from restored code to deployed closed checkout.",
  },
  {
    source: "docs/launch/jeffmini-resume-guide.md",
    target: "jeffmini-resume-guide.md",
    description: "home-PC restore and launch sequence for jeffmini.",
  },
  {
    source: "docs/launch/deployment-cutover-checklist.md",
    target: "deployment-cutover-checklist.md",
    description: "short first-deploy to paid-launch cutover sequence.",
  },
  {
    source: "docs/launch/domain-and-sharing-guide.md",
    target: "domain-and-sharing-guide.md",
    description: "production URL, sitemap, and shared-link setup recipe.",
  },
  {
    source: "docs/launch/github-and-source-backup-guide.md",
    target: "github-and-source-backup-guide.md",
    description: "GitHub push, portable backup, Drive, and NotebookLM source trail.",
  },
  {
    source: "docs/launch/home-pc-runbook.md",
    target: "home-pc-runbook.md",
    description: "beginner-friendly fallback for admin-blocked work computers.",
  },
  {
    source: "docs/launch/home-pc-command-cheatsheet.md",
    target: "home-pc-command-cheatsheet.md",
    description: "short command list for finishing checks on a home PC.",
  },
  {
    source: "docs/launch/first-customers-sales-packet.md",
    target: "first-customers-sales-packet.md",
    description: "first-buyer outreach scripts and feedback tracker.",
  },
  {
    source: "docs/launch/individual-learner-decision-one-pager.md",
    target: "individual-learner-decision-one-pager.md",
    description: "short learner-facing fit and purchase decision handout.",
  },
  {
    source: "docs/launch/practice-manager-approval-one-pager.md",
    target: "practice-manager-approval-one-pager.md",
    description: "short practice approval memo for managers and budget decision-makers.",
  },
  {
    source: "docs/launch/manual-payment-link-checklist.md",
    target: "manual-payment-link-checklist.md",
    description: "controlled first-buyer Stripe Payment Link setup and stop rules.",
  },
  {
    source: "docs/launch/static-first-sale-page-guide.md",
    target: "static-first-sale-page-guide.md",
    description: "static one-page first-sale fallback for controlled buyer conversations.",
  },
  {
    source: "docs/launch/first-buyer-fulfillment-checklist.md",
    target: "first-buyer-fulfillment-checklist.md",
    description: "first paid buyer receipt, access, and welcome checklist.",
  },
  {
    source: "docs/launch/revenue-and-sales-tracker-template.md",
    target: "revenue-and-sales-tracker-template.md",
    description: "safe lead, purchase, support, and weekly revenue tracker.",
  },
  {
    source: "docs/launch/stripe-setup-guide.md",
    target: "stripe-setup-guide.md",
    description: "Stripe checkout and webhook setup recipe.",
  },
  {
    source: "docs/launch/email-setup-guide.md",
    target: "email-setup-guide.md",
    description: "passwordless sign-in email setup recipe.",
  },
  {
    source: "docs/launch/database-setup-guide.md",
    target: "database-setup-guide.md",
    description: "managed PostgreSQL setup recipe.",
  },
  {
    source: "docs/launch/clinical-review-guide.md",
    target: "clinical-review-guide.md",
    description: "Module 1 review and signoff recipe.",
  },
  {
    source: "docs/launch/go-live-checklist.md",
    target: "go-live-checklist.md",
    description: "final launch-day sequence.",
  },
  {
    source: "docs/launch/production-env-checklist.md",
    target: "production-env-checklist.md",
    description: "safe fill-in checklist for host dashboard settings.",
  },
  {
    source: "docs/launch/manual-launch-qa-evidence.md",
    target: "manual-launch-qa-evidence.md",
    description: "safe template for Stripe, learner-flow, practice-pack, browser, and accessibility QA notes.",
  },
  {
    source: "docs/launch/runtime-readiness-snapshot-guide.md",
    target: "runtime-readiness-snapshot-guide.md",
    description: "how to save and interpret the deployed readiness endpoint.",
  },
  {
    source: "docs/launch/first-sale-support-runbook.md",
    target: "first-sale-support-runbook.md",
    description: "safe support checklist for buyer, learner, practice-seat, and refund issues.",
  },
  {
    source: "docs/launch/bootcamp-content-migration-checklist.md",
    target: "bootcamp-content-migration-checklist.md",
    description: "source-to-course checklist for Drive and NotebookLM Bootcamp assets.",
  },
  {
    source: "docs/launch/module-1-clinical-review-packet.md",
    target: "module-1-clinical-review-packet.md",
    description: "clinical reviewer packet.",
  },
];

const requiredSections = [
  {
    label: "Stripe checkout",
    variables: ["STRIPE_SECRET_KEY", "PUBLIC_APP_URL", "ENABLE_PAID_ENROLLMENT"],
  },
  {
    label: "Stripe webhook",
    variables: ["STRIPE_WEBHOOK_SECRET"],
  },
  {
    label: "Passwordless sign-in",
    variables: [
      "AUTH_SESSION_SECRET",
      "TRANSACTIONAL_EMAIL_API_URL",
      "TRANSACTIONAL_EMAIL_API_KEY",
      "SIGN_IN_FROM_EMAIL",
      "PUBLIC_APP_URL",
    ],
  },
  {
    label: "Practice seat admin",
    variables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
  },
  {
    label: "Alert admin",
    variables: ["ALERT_ADMIN_TOKEN"],
  },
  {
    label: "Database connection",
    variables: ["DATABASE_URL", "DATABASE_SSL"],
  },
  {
    label: "Module 1 clinical signoff",
    variables: [
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      "MODULE_ONE_CLINICAL_REVIEW_DATE",
      "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
    ],
  },
];

function isPresent(variableName) {
  return Boolean(process.env[variableName]?.trim());
}

function getMissingVariables(variables) {
  return variables.filter(variableName => !isPresent(variableName));
}

function getStripeMode() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() || "";
  if (!key) return "missing";
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  return "unknown";
}

function isFlagEnabled(variableName) {
  return process.env[variableName]?.trim().toLowerCase() === "true";
}

function createReadinessSnapshot(generatedAt) {
  const sections = requiredSections.map(section => {
    const missingVariables = getMissingVariables(section.variables);
    return {
      label: section.label,
      ready: missingVariables.length === 0,
      missingVariables,
    };
  });
  const missingBySection = Object.fromEntries(
    sections.map(section => [section.label, section.missingVariables])
  );
  const blockers = sections
    .filter(section => !section.ready)
    .map(section => section.label);
  const stripeSecretKeyMode = getStripeMode();
  const paidEnrollmentEnabled = isFlagEnabled("ENABLE_PAID_ENROLLMENT");
  const clinicalApproved = isFlagEnabled("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
  const databaseSchemaVerified = false;
  const warnings = [
    blockers.length > 0
      ? `Runtime setup is missing values for: ${blockers.join(", ")}.`
      : null,
    stripeSecretKeyMode === "test"
      ? "Stripe checkout is configured with a test-mode secret key. Use a live Stripe secret key before real sales."
      : null,
    stripeSecretKeyMode === "unknown"
      ? "Stripe checkout secret key does not look like a Stripe test or live secret key."
      : null,
    paidEnrollmentEnabled
      ? null
      : "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
    clinicalApproved
      ? null
      : "Module 1 clinical review signoff is missing or not approved.",
    "Database schema is not verified by this work-safe bundle command. Run `pnpm db:setup` and check `/api/launch/readiness` on the production host.",
  ].filter(Boolean);

  return {
    generatedAt,
    generator: "scripts/launch-evidence-bundle.mjs",
    secretSafety:
      "This snapshot records variable names and readiness labels only. It does not record secret values.",
    readyForPaidLaunch:
      blockers.length === 0 &&
      stripeSecretKeyMode === "live" &&
      paidEnrollmentEnabled &&
      clinicalApproved &&
      databaseSchemaVerified,
    salesChannels: {
      individualLearner: {
        ready: false,
        blockers: [
          ...blockers,
          databaseSchemaVerified ? null : "Database schema is not verified",
        ].filter(Boolean),
      },
      practicePacks: {
        ready: false,
        blockers: [
          ...blockers,
          databaseSchemaVerified ? null : "Database schema is not verified",
        ].filter(Boolean),
      },
    },
    runtimeSetup: sections,
    missingBySection,
    stripeSecretKeyMode,
    paidEnrollmentEnabled,
    databaseSchemaVerified,
    warnings,
    nextSetupSteps: [
      "Run `pnpm launch:env-template` and fill real values in the production host dashboard.",
      "Complete Module 1 clinical review before enabling public paid enrollment.",
      "Deploy to the production host, configure PostgreSQL, then run `pnpm db:setup`.",
      "Configure Stripe checkout, Stripe webhook, passwordless email, and admin tokens.",
      "Run the production smoke test and one low-risk internal live purchase before public sales.",
    ],
  };
}

function renderList(items, emptyText) {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function renderLaunchDoctorReport(snapshot) {
  return [
    "# OptiTech Academy Launch Doctor",
    "",
    `Generated at: ${snapshot.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Paid launch ready: ${snapshot.readyForPaidLaunch ? "yes" : "no"}`,
    `- Individual learner sales: ${snapshot.salesChannels.individualLearner.ready ? "ready" : "blocked"}`,
    `- Practice pack sales: ${snapshot.salesChannels.practicePacks.ready ? "ready" : "blocked"}`,
    `- Paid enrollment switch: ${snapshot.paidEnrollmentEnabled ? "on" : "off"}`,
    `- Database schema verified: ${snapshot.databaseSchemaVerified ? "yes" : "no"}`,
    "",
    "## Runtime Setup",
    "",
    ...snapshot.runtimeSetup.map(
      section => `- ${section.label}: ${section.ready ? "PASS" : "NEEDS WORK"}`
    ),
    "",
    "## Missing Environment Variables",
    "",
    ...snapshot.runtimeSetup.flatMap(section => [
      `### ${section.label}`,
      "",
      ...renderList(section.missingVariables, "No missing variables."),
      "",
    ]),
    "## Buyer Channel Readiness",
    "",
    "### Individual Learners",
    "",
    ...renderList(
      snapshot.salesChannels.individualLearner.blockers,
      "Ready to sell individual learner access."
    ),
    "",
    "### Practice Packs",
    "",
    ...renderList(
      snapshot.salesChannels.practicePacks.blockers,
      "Ready to sell practice pack access."
    ),
    "",
    "## Active Warnings",
    "",
    ...renderList(snapshot.warnings, "No active warnings."),
    "",
    "## Recommended Next Setup Steps",
    "",
    ...snapshot.nextSetupSteps.map(step => `- ${step}`),
    "",
  ].join("\n");
}

function renderReadme(generatedAt, snapshot) {
  return [
    "# OptiTech Academy Launch Evidence Bundle",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "This folder is safe to save to Google Drive. It intentionally excludes `.env`, live secrets, raw tokens, cookies, database passwords, and Stripe secret keys.",
    "",
    "## Included Files",
    "",
    ...evidenceFiles.map(file => `- \`${file.target}\`: ${file.description}`),
    "- `launch-doctor-report.md`: human-readable paid launch preflight report.",
    "- `runtime-readiness-snapshot.json`: safe readiness report with missing variable names, not secret values.",
    "",
    "## Current Snapshot",
    "",
    `- Ready for paid launch: ${snapshot.readyForPaidLaunch ? "yes" : "no"}`,
    `- Individual learner sales: ${snapshot.salesChannels.individualLearner.ready ? "ready" : "blocked"}`,
    `- Practice pack sales: ${snapshot.salesChannels.practicePacks.ready ? "ready" : "blocked"}`,
    `- Runtime warnings: ${snapshot.warnings.length}`,
    `- Launch blockers: ${snapshot.salesChannels.practicePacks.blockers.join(", ") || "none"}`,
    "",
    "## Still Needed Before Paid Enrollment",
    "",
    ...snapshot.nextSetupSteps.map(step => `- ${step}`),
    "",
  ].join("\n");
}

async function copyEvidenceFiles() {
  for (const file of evidenceFiles) {
    const sourcePath = path.join(projectRoot, file.source);
    const targetPath = path.join(outputDir, file.target);
    const content = await readFile(sourcePath, "utf8");
    await writeFile(targetPath, content);
  }
}

async function main() {
  const generatedAt = new Date().toISOString();
  const snapshot = createReadinessSnapshot(generatedAt);

  await rm(outputDir, { force: true, recursive: true });
  await mkdir(outputDir, { recursive: true });
  await copyEvidenceFiles();
  await writeFile(path.join(outputDir, "README.md"), renderReadme(generatedAt, snapshot));
  await writeFile(
    path.join(outputDir, "launch-doctor-report.md"),
    renderLaunchDoctorReport(snapshot)
  );
  await writeFile(
    path.join(outputDir, "runtime-readiness-snapshot.json"),
    `${JSON.stringify(snapshot, null, 2)}\n`
  );

  console.log(`Launch evidence bundle created at ${outputDir}`);
  for (const file of [
    "README.md",
    ...evidenceFiles.map(item => item.target),
    "launch-doctor-report.md",
    "runtime-readiness-snapshot.json",
  ]) {
    console.log(`- ${file}`);
  }
}

main().catch(error => {
  const message =
    error instanceof Error
      ? error.message
      : "Launch evidence bundle generation failed.";
  console.error(message);
  process.exitCode = 1;
});
