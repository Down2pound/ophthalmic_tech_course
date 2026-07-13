import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderModuleOneClinicalReviewPacketMarkdown } from "../../../shared/course/clinicalReviewPacket";
import { renderLaunchDoctorReport } from "./launchDoctor";
import { renderManualQaTemplate } from "./manualQaTemplate";
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
    "- `launch-doctor-report.md`: human-readable paid launch preflight report.",
    "- `manual-launch-qa-evidence.md`: safe template for Stripe, learner-flow, practice-pack, browser, and accessibility QA notes.",
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
    "launch-doctor-report.md",
    "manual-launch-qa-evidence.md",
    "module-1-clinical-review-packet.md",
    "runtime-readiness-snapshot.json",
  ];

  await rm(resolvedOutputDir, { force: true, recursive: true });
  await mkdir(resolvedOutputDir, { recursive: true });

  const launchPackage = await readFile(launchPackagePath, "utf8");

  await writeFile(
    path.join(resolvedOutputDir, "README.md"),
    renderReadme({ generatedAt, readinessReport })
  );
  await writeFile(
    path.join(resolvedOutputDir, "production-launch-package.md"),
    launchPackage
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
