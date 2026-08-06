#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath = "launch-evidence/access-revocation-packet.md";
const targetTypes = new Set([
  "enrollment",
  "practice-seat-assignment",
  "practice-seat-pack",
]);

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalUrl() {
  return process.argv.find(
    arg => !arg.startsWith("--") && /^https?:\/\//i.test(arg)
  );
}

function normalizeBaseUrl(value) {
  const trimmedValue = value?.trim() || "";

  if (!trimmedValue) return "https://your-real-domain.example";

  try {
    const url = new URL(trimmedValue);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmedValue.replace(/\/+$/, "");
  }
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_ACCESS_REVOCATION_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function normalizeTargetType(value) {
  const normalizedValue = value?.trim() || "";
  return targetTypes.has(normalizedValue) ? normalizedValue : "";
}

function targetFieldName(targetType) {
  if (targetType === "enrollment") return "enrollmentId";
  if (targetType === "practice-seat-assignment") return "assignmentId";
  if (targetType === "practice-seat-pack") return "seatPackId";
  return "targetId";
}

function renderJsonBody(targetType, targetId) {
  if (!targetType || !targetId) {
    return [
      "{",
      '  "targetType": "[enrollment | practice-seat-assignment | practice-seat-pack]",',
      '  "targetId": "[copy exact ID from buyer lookup]"',
      "}",
    ].join("\n");
  }

  return JSON.stringify(
    {
      [targetFieldName(targetType)]: targetId,
    },
    null,
    2
  );
}

function renderPacket({
  baseUrl,
  buyerEmail,
  targetType,
  targetId,
  safeReason,
}) {
  return [
    "# OptiTech Academy Access Revocation Packet",
    "",
    "Simple translation: this is the careful removal checklist. Use it only after a refund, mistaken practice-seat assignment, or documented support correction.",
    "",
    "This packet does not revoke access by itself. It helps you copy exactly one safe target into the protected admin workflow or API.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, admin tokens, raw sign-in links, session cookies, database passwords, card numbers, patient information, protected health information, private learner details, or private employee details into this packet.",
    "",
    "## Case Labels",
    "",
    `- Production URL: ${baseUrl}`,
    `- Buyer or learner email: ${buyerEmail || "[fill buyer or learner email]"}`,
    `- Revocation target type: ${targetType || "[fill target type]"}`,
    `- Revocation target ID: ${targetId || "[fill exact target ID]"}`,
    `- Safe reason: ${safeReason || "[refund / mistaken assignment / support correction]"}`,
    "",
    "## Before Revoking",
    "",
    "- [ ] Published refund policy was reviewed before promising an outcome.",
    "- [ ] Stripe refund, dispute, or support decision is documented outside this packet.",
    "- [ ] Protected buyer lookup was run for the exact email.",
    "- [ ] The exact target ID was copied from buyer lookup or Practice Seat Manager.",
    "- [ ] Only one target is being revoked.",
    "- [ ] You understand the impact:",
    "- enrollment: removes one learner's course access.",
    "- practice-seat-assignment: removes one assigned learner seat and expires matching learner access.",
    "- practice-seat-pack: expires the whole practice pack and revokes active assignments.",
    "",
    "## Protected Endpoint",
    "",
    "```text",
    `POST ${baseUrl}/api/support/access-revocations`,
    "Header: x-admin-token: [paste only in the request tool, never in this file]",
    "```",
    "",
    "## Request Body",
    "",
    "```json",
    renderJsonBody(targetType, targetId),
    "```",
    "",
    "## Safer Owner Workflow",
    "",
    "1. Open `/practice-seat-admin` on the deployed site.",
    "2. Paste the private practice-seat admin token only into the protected admin page.",
    "3. Run buyer lookup for the buyer or learner email.",
    "4. Use the revocation panel to load exactly one target.",
    "5. Confirm the refund or support reason.",
    "6. Submit once.",
    "7. Run buyer lookup again to confirm the access state changed as expected.",
    "",
    "## Evidence To Save",
    "",
    "- [ ] Stripe refund ID or support case reference.",
    "- [ ] Buyer or learner email.",
    "- [ ] Revocation target type and target ID.",
    "- [ ] Date/time revoked.",
    "- [ ] Buyer lookup summary before revocation.",
    "- [ ] Buyer lookup summary after revocation.",
    "- [ ] Follow-up message sent, if needed.",
    "",
    "## Stop Rules",
    "",
    "- Stop if more than one target might be affected.",
    "- Stop if the buyer lookup does not show the target ID.",
    "- Stop if the email does not match the refund/support request.",
    "- Stop if you are unsure whether the practice pack or one seat should be revoked.",
    "- Stop if any note includes secrets, raw links, patient information, or protected health information.",
    "",
    "Related commands:",
    "",
    "```bash",
    `LAUNCH_BUYER_EMAIL=${buyerEmail || "buyer@example.com"} LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH=launch-evidence/first-buyer-proof.md pnpm launch:first-buyer-proof ${baseUrl}`,
    "pnpm launch:fulfillment",
    "pnpm launch:sales-tracker",
    "pnpm launch:emergency-stop",
    "```",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl = normalizeBaseUrl(
    getArgValue("base-url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      ""
  );
  const targetType = normalizeTargetType(
    getArgValue("target-type") || process.env.LAUNCH_ACCESS_REVOCATION_TARGET_TYPE
  );
  const targetId =
    getArgValue("target-id") ||
    process.env.LAUNCH_ACCESS_REVOCATION_TARGET_ID ||
    "";
  const buyerEmail =
    getArgValue("email") || process.env.LAUNCH_BUYER_EMAIL || "";
  const safeReason =
    getArgValue("reason") || process.env.LAUNCH_ACCESS_REVOCATION_REASON || "";
  const reportPath = getReportPath();
  const packet = renderPacket({
    baseUrl,
    buyerEmail,
    targetType,
    targetId,
    safeReason,
  });

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
      : "Access revocation packet could not be created."
  );
  process.exitCode = 1;
});
