import {
  getDeploymentSmokeExitCode,
  runDeploymentSmokeTest,
} from "./deploymentSmokeTest";
import { renderLaunchGoNoGoReport } from "./launchGoNoGo";

async function main() {
  const baseUrl =
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const testPracticeInquiry =
    process.env.LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY === "true";
  const report = await runDeploymentSmokeTest({ baseUrl, testPracticeInquiry });

  console.log(renderLaunchGoNoGoReport(report));

  process.exitCode = getDeploymentSmokeExitCode(report, {
    allowNotReady: true,
  });
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Launch go/no-go report failed.";
  console.error(message);
  process.exitCode = 1;
});
