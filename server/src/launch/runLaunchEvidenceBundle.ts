import { createLaunchEvidenceBundle } from "./launchEvidenceBundle";

async function main() {
  const outputDir = process.env.LAUNCH_EVIDENCE_DIR || "launch-evidence";
  const result = await createLaunchEvidenceBundle({ outputDir });

  console.log(`Launch evidence bundle created at ${result.outputDir}`);
  for (const file of result.files) {
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
