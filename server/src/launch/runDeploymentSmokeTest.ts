import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { runDeploymentSmokeTest } from "./deploymentSmokeTest";
import { renderDeploymentSmokeReport } from "./deploymentSmokeTest";

async function main() {
  const baseUrl =
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const report = await runDeploymentSmokeTest({ baseUrl });
  const renderedReport = renderDeploymentSmokeReport(report);

  console.log(`Deployment smoke test for ${report.baseUrl}`);
  console.log(`- Health: ${report.healthOk ? "ok" : "failed"}`);
  console.log(
    `- Public buyer pages: ${report.publicPagesOk ? "ok" : "failed"}`
  );
  for (const page of report.publicPages) {
    console.log(
      `  - ${page.path}: ${page.ok ? "ok" : "failed"} (HTTP ${page.status})`
    );
  }
  console.log(
    `- Paid launch readiness: ${
      report.readyForPaidLaunch ? "ready" : "not ready"
    }`
  );

  if (report.blockers.length > 0) {
    console.log(`- Blockers: ${report.blockers.join(", ")}`);
  }

  if (report.warnings.length > 0) {
    console.log("- Warnings:");
    for (const warning of report.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (!report.readyForPaidLaunch && report.launchActions.length > 0) {
    console.log("- Next launch actions:");
    for (const action of report.launchActions.slice(0, 3)) {
      console.log(`  - ${action.title}: ${action.action}`);
    }
  }

  if (process.env.LAUNCH_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_SMOKE_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, renderedReport);
    console.log(`- Report written: ${reportPath}`);
  }

  if (!report.healthOk || !report.publicPagesOk || !report.readyForPaidLaunch) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Deployment smoke test failed.";
  console.error(message);
  process.exitCode = 1;
});
