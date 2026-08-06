#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath =
  "launch-evidence/module-1-clinical-signoff-packet.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function valueFromArgOrEnv(argName, envName, fallback) {
  return getArgValue(argName) || process.env[envName]?.trim() || fallback;
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function renderValue(value) {
  return value || "[fill after approval]";
}

function renderPacket({
  reviewerName,
  reviewerRole,
  reviewDate,
  approvedVersion,
  correctionsRequested,
  correctionsResolvedDate,
}) {
  return [
    "# OptiTech Academy Module 1 Clinical Signoff Packet",
    "",
    "Simple translation: this is the approval receipt. Keep it with launch evidence after a qualified eye-care reviewer approves Module 1.",
    "",
    "Do not use this packet to approve the course by yourself. Use it only after the reviewer has read the clinical review packet, asked for any needed corrections, and confirmed that the corrected version is approved.",
    "",
    "Do not paste patient information, real chart details, protected health information, private employer data, Stripe secret keys, webhook secrets, email API keys, database passwords, admin tokens, raw sign-in links, or session cookies into this packet.",
    "",
    "## Reviewer Signoff Record",
    "",
    `- Reviewer name: ${renderValue(reviewerName)}`,
    `- Reviewer role or credentials: ${renderValue(reviewerRole)}`,
    `- Review date: ${renderValue(reviewDate)}`,
    `- Approved module version: ${renderValue(approvedVersion)}`,
    `- Corrections requested: ${renderValue(correctionsRequested)}`,
    `- Corrections resolved date: ${renderValue(correctionsResolvedDate)}`,
    "- Final approval status: [approved / not approved yet]",
    "",
    "## Reviewer Confirmation",
    "",
    "- [ ] I reviewed the Module 1 clinical review packet.",
    "- [ ] I checked clinical accuracy for an entry-level ophthalmic learner.",
    "- [ ] I checked that learners are not told to diagnose, treat, or work beyond supervision.",
    "- [ ] I checked patient-facing scripts, scope notes, safety language, sources, and quiz questions.",
    "- [ ] Required corrections were either not needed or have been resolved.",
    "- [ ] Module 1 is approved for paid learner access at the approved version listed above.",
    "",
    "Reviewer signature or written approval location: [email thread, signed PDF, Drive file, or internal approval note]",
    "",
    "## Host Dashboard Values After Approval",
    "",
    "Keep `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until the reviewer has approved the corrected content. After approval, paste these values into the production host dashboard.",
    "",
    "```text",
    `MODULE_ONE_CLINICAL_REVIEWER_NAME=${reviewerName}`,
    `MODULE_ONE_CLINICAL_REVIEWER_ROLE=${reviewerRole}`,
    `MODULE_ONE_CLINICAL_REVIEW_DATE=${reviewDate}`,
    `MODULE_ONE_CLINICAL_APPROVED_VERSION=${approvedVersion}`,
    "MODULE_ONE_CLINICAL_REVIEW_APPROVED=true",
    "```",
    "",
    "## Re-Review Rule",
    "",
    "Repeat clinical review and set `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` again if Module 1 clinical content, scope language, patient scripts, safety warnings, sources, or quiz questions change.",
    "",
    "Helpful commands:",
    "",
    "```bash",
    "pnpm launch:clinical-review-request",
    "pnpm launch:clinical-review",
    "LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH=launch-evidence/module-1-clinical-signoff-packet.md pnpm launch:clinical-signoff -- --reviewer-name=\"Dr. Reviewer\" --reviewer-role=\"Ophthalmologist\" --review-date=\"2026-08-06\" --approved-version=\"module-one-v1\"",
    "```",
    "",
  ].join("\n");
}

async function main() {
  const packet = renderPacket({
    reviewerName: valueFromArgOrEnv(
      "reviewer-name",
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      ""
    ),
    reviewerRole: valueFromArgOrEnv(
      "reviewer-role",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      ""
    ),
    reviewDate: valueFromArgOrEnv(
      "review-date",
      "MODULE_ONE_CLINICAL_REVIEW_DATE",
      ""
    ),
    approvedVersion: valueFromArgOrEnv(
      "approved-version",
      "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      ""
    ),
    correctionsRequested: valueFromArgOrEnv(
      "corrections-requested",
      "LAUNCH_CLINICAL_CORRECTIONS_REQUESTED",
      "None listed"
    ),
    correctionsResolvedDate: valueFromArgOrEnv(
      "corrections-resolved-date",
      "LAUNCH_CLINICAL_CORRECTIONS_RESOLVED_DATE",
      ""
    ),
  });

  const reportPath = getReportPath();
  console.log(packet);

  if (reportPath) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, packet, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Clinical signoff packet could not be created."
  );
  process.exitCode = 1;
});
