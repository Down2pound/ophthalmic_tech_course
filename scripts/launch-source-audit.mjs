#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const notebookUrl =
  "https://notebook.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1";
const legacyNotebookUrl =
  "https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1";
const bootcampDriveUrl =
  "https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q";
const bootcampSiteDataUrl =
  "https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI";

const files = {
  sourceInventory: "shared/course/sourceInventory.ts",
  bootcampSourceMap: "shared/course/bootcampSourceMap.ts",
  bootcampSourceMapTest: "shared/course/bootcampSourceMap.test.ts",
  migrationChecklist: "docs/launch/bootcamp-content-migration-checklist.md",
  driveInventory: "docs/content/google-drive-source-inventory.md",
  readme: "README.md",
};

function formatStatus(ok) {
  return ok ? "ok" : "failed";
}

function addCheck(checks, label, ok, detail = "") {
  checks.push({ label, ok, detail });
}

function renderCheck(check) {
  return `- ${check.label}: ${formatStatus(check.ok)}${
    check.detail ? ` (${check.detail})` : ""
  }`;
}

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

function countSourceAssets(sourceMap) {
  return sourceMap.match(/^\s*storageKey:/gm)?.length ?? 0;
}

function countSourceDays(sourceMap) {
  return sourceMap.match(/^\s*day: \d+,/gm)?.length ?? 0;
}

function getReportPath() {
  const value = process.env.LAUNCH_SOURCE_AUDIT_REPORT_PATH || "";
  return value ? path.resolve(value) : "";
}

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, relativePath]) => [
      key,
      await readProjectFile(relativePath),
    ])
  )
);

const checks = [];
const sourceAssetCount = countSourceAssets(source.bootcampSourceMap);
const sourceDayCount = countSourceDays(source.bootcampSourceMap);

addCheck(
  checks,
  "Notebook source URL is recorded in source inventory",
  source.sourceInventory.includes(notebookUrl),
  files.sourceInventory
);
addCheck(
  checks,
  "Notebook source URL is recorded in typed Bootcamp source map",
  source.bootcampSourceMap.includes(notebookUrl),
  files.bootcampSourceMap
);
addCheck(
  checks,
  "Legacy NotebookLM URL is preserved for older references",
  source.bootcampSourceMap.includes(legacyNotebookUrl) &&
    source.driveInventory.includes(legacyNotebookUrl),
  `${files.bootcampSourceMap}, ${files.driveInventory}`
);
addCheck(
  checks,
  "Bootcamp Drive folder is recorded with the Notebook source",
  source.sourceInventory.includes(bootcampDriveUrl) &&
    source.bootcampSourceMap.includes(bootcampDriveUrl) &&
    source.migrationChecklist.includes(bootcampDriveUrl),
  "source inventory, source map, and migration checklist"
);
addCheck(
  checks,
  "Older structured course data source is still recorded",
  source.sourceInventory.includes(bootcampSiteDataUrl) &&
    source.bootcampSourceMap.includes(bootcampSiteDataUrl),
  "source inventory and source map"
);
addCheck(
  checks,
  "Notebook source is classified as a public-course candidate",
  source.sourceInventory.includes(
    'id: "notebooklm-bootcamp-course-materials"'
  ) &&
    source.sourceInventory.includes('sourceType: "notebooklm"') &&
    source.sourceInventory.includes(
      'classification: "public-course-candidate"'
    ),
  files.sourceInventory
);
addCheck(
  checks,
  "Migration checklist warns Notebook material needs export and review",
  source.migrationChecklist.includes("reuse rights") &&
    source.migrationChecklist.includes("clinical review") &&
    source.migrationChecklist.includes("accessible alternatives"),
  files.migrationChecklist
);
addCheck(
  checks,
  "Drive inventory explains Notebook access may require owner sign-in",
  source.driveInventory.includes(
    "NotebookLM may require the owner's logged-in Google session"
  ) &&
    source.driveInventory.includes(
      "Do not publish NotebookLM summaries without checking"
    ),
  files.driveInventory
);
addCheck(
  checks,
  "Typed Bootcamp source map still has ten days",
  sourceDayCount === 10,
  `${sourceDayCount} found`
);
addCheck(
  checks,
  "Typed Bootcamp source map still has more than thirty assets",
  sourceAssetCount > 30,
  `${sourceAssetCount} found`
);
addCheck(
  checks,
  "Source map test protects the Notebook URL",
  source.bootcampSourceMapTest.includes(
    "notebook.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1"
  ),
  files.bootcampSourceMapTest
);
addCheck(
  checks,
  "README points builders to the Bootcamp source path",
  source.readme.includes("Bootcamp source map") &&
    /source\s+content/.test(source.readme) &&
    source.readme.includes("rights review"),
  files.readme
);

const failedChecks = checks.filter(check => !check.ok);

const lines = [
  "# OptiTech Academy Course Source Audit",
  "",
  "Simple translation: this checks that the course supply closet is labeled before we turn materials into paid lessons.",
  "",
  `Notebook source: ${notebookUrl}`,
  `Bootcamp Drive source: ${bootcampDriveUrl}`,
  `Bootcamp days mapped: ${sourceDayCount}`,
  `Source assets mapped: ${sourceAssetCount}`,
  `Checks passed: ${checks.length - failedChecks.length}/${checks.length}`,
  "",
  "## Results",
  "",
  ...checks.map(renderCheck),
  "",
  "## Use Rule",
  "",
  "NotebookLM and Google Drive are source workspaces. Before anything becomes paid learner content, export the relevant material, preserve original file IDs or filenames, check it against the source files, confirm reuse rights, complete clinical review, complete accessibility review, and decide whether it belongs in the public course or private Spindel onboarding version.",
  "",
];

if (failedChecks.length > 0) {
  lines.push("## Fix Before Publishing");
  lines.push("");
  lines.push(
    "One or more source references are missing. Restore the Notebook, Drive, source-map, or checklist reference before publishing new course material."
  );
  lines.push("");
}

lines.push(
  "Do not paste Google session cookies, private share links, patient information, protected health information, private employee details, Stripe keys, webhook secrets, database passwords, or admin tokens into this report."
);
lines.push("");

const report = lines.join("\n");
const reportPath = getReportPath();

console.log(report);

if (reportPath) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, report, "utf8");
  console.log(`Report written: ${reportPath}`);
} else {
  console.log(
    "Recommended report path: launch-evidence/course-source-audit.md"
  );
}

process.exitCode = failedChecks.length > 0 ? 1 : 0;
