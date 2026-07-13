import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderModuleOneClinicalReviewPacketMarkdown } from "../../../shared/course/clinicalReviewPacket";
import { renderFirstSaleSupportRunbook } from "./firstSaleSupportRunbook";
import { renderLaunchDoctorReport } from "./launchDoctor";
import { renderManualQaTemplate } from "./manualQaTemplate";
import { renderProductionEnvChecklist } from "./productionEnvChecklist";
import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export interface LaunchEvidenceBundleInput {
  outputDir: string;
  projectRoot?: string;
  generatedAt?: string;
  readinessReport?: RuntimeLaunchReadinessReport;
}

export interface LaunchEvidenceBundleResult {
  outputDir: string;
  files: string[];
}

function renderReadme({
  generatedAt,
  readinessReport,
}: {
  generatedAt: string;
  readinessReport: RuntimeLaunchReadinessReport;
}): string {
  return [
    "# OptiTech Academy Launch Evidence Bundle",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "This folder is safe to save to Google Drive. It intentionally excludes `.env`, live secrets, raw tokens, cookies, database passwords, and Stripe secret keys.",
    "",
    "## Included Files",
    "",
    "- `production-launch-package.md`: launch handoff checklist.",
    "- `deployment-guide.md`: beginner-friendly production setup recipe.",
    "- `stripe-setup-guide.md`: Stripe checkout and webhook setup recipe.",
    "- `email-setup-guide.md`: passwordless sign-in email setup recipe.",
    "- `database-setup-guide.md`: managed PostgreSQL setup recipe.",
    "- `clinical-review-guide.md`: Module 1 review and signoff recipe.",
    "- `go-live-checklist.md`: final launch-day sequence.",
    "- `production-env-checklist.md`: safe fill-in checklist for host dashboard settings.",
    "- `launch-doctor-report.md`: human-readable paid launch preflight report.",
    "- `manual-launch-qa-evidence.md`: safe template for Stripe, learner-flow, practice-pack, browser, and accessibility QA notes.",
    "- `first-sale-support-runbook.md`: safe support checklist for buyer, learner, practice-seat, and refund issues.",
    "- `module-1-clinical-review-packet.md`: clinical reviewer packet.",
    "- `runtime-readiness-snapshot.json`: safe readiness report with missing variable names, not secret values.",
    "",
    "## Current Snapshot",
    "",
    `- Ready for paid launch: ${readinessReport.readyForPaidLaunch ? "yes" : "no"}`,
    `- Runtime warnings: ${readinessReport.warnings.length}`,
    `- Launch blockers: ${readinessReport.staticSummary.blockers.join(", ") || "none"}`,
    "",
    "## Still Needed Before Paid Enrollment",
    "",
    ...readinessReport.launchActions.map(
      action => `- ${action.title}: ${action.action}`
    ),
    "",
  ].join("\n");
}

export async function createLaunchEvidenceBundle({
  outputDir,
  projectRoot = process.cwd(),
  generatedAt = new Date().toISOString(),
  readinessReport = getRuntimeLaunchReadinessReport({ now: () => generatedAt }),
}: LaunchEvidenceBundleInput): Promise<LaunchEvidenceBundleResult> {
  const resolvedOutputDir = path.resolve(projectRoot, outputDir);
  const launchPackagePath = path.resolve(
    projectRoot,
    "docs/launch/production-launch-package.md"
  );
  const files = [
    "README.md",
    "production-launch-package.md",
    "deployment-guide.md",
    "stripe-setup-guide.md",
    "email-setup-guide.md",
    "database-setup-guide.md",
    "clinical-review-guide.md",
    "go-live-checklist.md",
    "production-env-checklist.md",
    "launch-doctor-report.md",
    "manual-launch-qa-evidence.md",
    "first-sale-support-runbook.md",
    "module-1-clinical-review-packet.md",
    "runtime-readiness-snapshot.json",
  ];

  await rm(resolvedOutputDir, { force: true, recursive: true });
  await mkdir(resolvedOutputDir, { recursive: true });

  const launchPackage = await readFile(launchPackagePath, "utf8");
  const deploymentGuide = await readFile(
    path.resolve(projectRoot, "docs/launch/deployment-guide.md"),
    "utf8"
  );
  const stripeSetupGuide = await readFile(
    path.resolve(projectRoot, "docs/launch/stripe-setup-guide.md"),
    "utf8"
  );
  const emailSetupGuide = await readFile(
    path.resolve(projectRoot, "docs/launch/email-setup-guide.md"),
    "utf8"
  );
  const databaseSetupGuide = await readFile(
    path.resolve(projectRoot, "docs/launch/database-setup-guide.md"),
    "utf8"
  );
  const clinicalReviewGuide = await readFile(
    path.resolve(projectRoot, "docs/launch/clinical-review-guide.md"),
    "utf8"
  );
  const goLiveChecklist = await readFile(
    path.resolve(projectRoot, "docs/launch/go-live-checklist.md"),
    "utf8"
  );

  await writeFile(
    path.join(resolvedOutputDir, "README.md"),
    renderReadme({ generatedAt, readinessReport })
  );
  await writeFile(
    path.join(resolvedOutputDir, "production-launch-package.md"),
    launchPackage
  );
  await writeFile(
    path.join(resolvedOutputDir, "deployment-guide.md"),
    deploymentGuide
  );
  await writeFile(
    path.join(resolvedOutputDir, "stripe-setup-guide.md"),
    stripeSetupGuide
  );
  await writeFile(
    path.join(resolvedOutputDir, "email-setup-guide.md"),
    emailSetupGuide
  );
  await writeFile(
    path.join(resolvedOutputDir, "database-setup-guide.md"),
    databaseSetupGuide
  );
  await writeFile(
    path.join(resolvedOutputDir, "clinical-review-guide.md"),
    clinicalReviewGuide
  );
  await writeFile(
    path.join(resolvedOutputDir, "go-live-checklist.md"),
    goLiveChecklist
  );
  await writeFile(
    path.join(resolvedOutputDir, "production-env-checklist.md"),
    renderProductionEnvChecklist({ generatedAt })
  );
  await writeFile(
    path.join(resolvedOutputDir, "launch-doctor-report.md"),
    renderLaunchDoctorReport({ readinessReport })
  );
  await writeFile(
    path.join(resolvedOutputDir, "manual-launch-qa-evidence.md"),
    renderManualQaTemplate({ generatedAt })
  );
  await writeFile(
    path.join(resolvedOutputDir, "first-sale-support-runbook.md"),
    renderFirstSaleSupportRunbook({ generatedAt })
  );
  await writeFile(
    path.join(resolvedOutputDir, "module-1-clinical-review-packet.md"),
    renderModuleOneClinicalReviewPacketMarkdown()
  );
  await writeFile(
    path.join(resolvedOutputDir, "runtime-readiness-snapshot.json"),
    `${JSON.stringify(readinessReport, null, 2)}\n`
  );

  return {
    outputDir: resolvedOutputDir,
    files,
  };
}
