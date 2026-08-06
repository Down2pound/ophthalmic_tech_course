#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const guidePath = path.join(
  projectRoot,
  "docs",
  "launch",
  "first-week-sales-plan.md"
);
const recommendedReportPath = "launch-evidence/first-week-sales-plan.md";

async function main() {
  const guide = readFileSync(guidePath, "utf8");

  console.log(guide);

  if (process.env.LAUNCH_FIRST_WEEK_SALES_REPORT_PATH) {
    const reportPath = path.resolve(
      process.env.LAUNCH_FIRST_WEEK_SALES_REPORT_PATH
    );
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, guide, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "First week sales plan could not be created."
  );
  process.exitCode = 1;
});
