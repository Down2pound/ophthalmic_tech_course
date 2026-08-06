#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const checklistPath = path.join(
  projectRoot,
  "docs",
  "launch",
  "first-buyer-fulfillment-checklist.md"
);
const recommendedReportPath =
  "launch-evidence/first-buyer-fulfillment-checklist.md";

async function main() {
  const checklist = readFileSync(checklistPath, "utf8");

  console.log(checklist);

  if (process.env.LAUNCH_FULFILLMENT_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_FULFILLMENT_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, checklist, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "First buyer fulfillment checklist could not be created."
  );
  process.exitCode = 1;
});
