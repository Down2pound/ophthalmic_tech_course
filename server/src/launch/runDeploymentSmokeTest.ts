import { runDeploymentSmokeTest } from "./deploymentSmokeTest";

async function main() {
  const baseUrl =
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const report = await runDeploymentSmokeTest({ baseUrl });

  console.log(`Deployment smoke test for ${report.baseUrl}`);
  console.log(`- Health: ${report.healthOk ? "ok" : "failed"}`);
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

  if (!report.healthOk || !report.readyForPaidLaunch) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Deployment smoke test failed.";
  console.error(message);
  process.exitCode = 1;
});
