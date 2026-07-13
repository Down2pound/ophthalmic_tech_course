import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getDeploymentSmokeExitCode,
  renderDeploymentSmokeConsoleSummary,
  runDeploymentSmokeTest,
} from "./deploymentSmokeTest";
import { renderDeploymentSmokeReport } from "./deploymentSmokeTest";

async function main() {
  const baseUrl =
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const allowNotReady = process.env.LAUNCH_SMOKE_ALLOW_NOT_READY === "true";
  const testPracticeInquiry =
    process.env.LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY === "true";
  const report = await runDeploymentSmokeTest({ baseUrl, testPracticeInquiry });
  const renderedReport = renderDeploymentSmokeReport(report);

  console.log(renderDeploymentSmokeConsoleSummary({ report, allowNotReady }));

  if (process.env.LAUNCH_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_SMOKE_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, renderedReport);
    console.log(`- Report written: ${reportPath}`);
  }

  process.exitCode = getDeploymentSmokeExitCode(report, { allowNotReady });
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Deployment smoke test failed.";
  console.error(message);
  process.exitCode = 1;
});
