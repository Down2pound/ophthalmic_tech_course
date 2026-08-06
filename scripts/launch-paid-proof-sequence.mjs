#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const recommendedReportPath = "launch-evidence/paid-launch-proof-sequence.md";

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

function normalizeEmail(value, fallback) {
  const trimmedValue = value?.trim().toLowerCase() || "";
  return trimmedValue || fallback;
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_PAID_PROOF_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

async function readTextIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function getCurrentCommit() {
  const dotGitPath = path.join(projectRoot, ".git");
  const dotGitContent = await readTextIfExists(dotGitPath);
  const gitDir = dotGitContent.startsWith("gitdir:")
    ? path.resolve(projectRoot, dotGitContent.replace("gitdir:", "").trim())
    : dotGitPath;
  const head = (await readTextIfExists(path.join(gitDir, "HEAD"))).trim();

  if (!head) return "CURRENT_COMMIT";
  if (!head.startsWith("ref:")) return head.slice(0, 7);

  const ref = head.replace("ref:", "").trim();
  const commit = (await readTextIfExists(path.join(gitDir, ref))).trim();
  return commit ? commit.slice(0, 7) : "CURRENT_COMMIT";
}

function renderPacket({ baseUrl, expectedCommit, testEmail, buyerEmail }) {
  return [
    "# OptiTech Academy Paid Launch Proof Sequence",
    "",
    "Simple translation: this is the money-path checklist. It proves the online store, cash register, receipt, email, access list, and first buyer support path work before you send paid links broadly.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, email API keys, database passwords, raw checkout URLs, raw sign-in links, session cookies, card numbers, patient information, protected health information, private learner details, or private employee details into this packet.",
    "",
    "## Launch Labels",
    "",
    `- Production URL: ${baseUrl}`,
    `- Expected deployed commit: ${expectedCommit}`,
    `- Internal test email: ${testEmail}`,
    `- First buyer email placeholder: ${buyerEmail}`,
    "",
    "## Run In This Order",
    "",
    "1. Confirm the deployed site is the exact commit you meant to launch.",
    "2. Confirm the public buyer pages and safety headers load.",
    "3. Confirm checkout can create a Stripe-hosted Checkout session.",
    "4. Confirm passwordless sign-in email can be requested.",
    "5. Save the live readiness snapshot.",
    "6. Run the live purchase rehearsal packet before turning on broad outreach.",
    "7. After one controlled real payment, save first-buyer proof.",
    "8. After access works, prepare the first-buyer feedback packet.",
    "9. If anything fails, use the emergency stop checklist before sending more links.",
    "",
    "## Commands",
    "",
    "```bash",
    `LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=${baseUrl} LAUNCH_EXPECTED_COMMIT=${expectedCommit} LAUNCH_SMOKE_REPORT_PATH=launch-evidence/deployment-smoke-report.md pnpm launch:smoke`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_CHECKOUT_SMOKE_REPORT_PATH=launch-evidence/checkout-session-smoke-report.md pnpm launch:checkout-smoke -- --email=${testEmail} --offer=founding-learner`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_EMAIL_SMOKE_REPORT_PATH=launch-evidence/passwordless-email-smoke-report.md pnpm launch:email-smoke -- --email=${testEmail}`,
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:readiness-snapshot ${baseUrl}`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_LIVE_PURCHASE_EMAIL=${testEmail} LAUNCH_LIVE_PURCHASE_REPORT_PATH=launch-evidence/live-purchase-rehearsal-report.md pnpm launch:live-purchase-test ${baseUrl}`,
    `LAUNCH_BUYER_EMAIL=${buyerEmail} LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH=launch-evidence/first-buyer-proof.md pnpm launch:first-buyer-proof ${baseUrl}`,
    "pnpm launch:fulfillment",
    `LAUNCH_FIRST_BUYER_FEEDBACK_REPORT_PATH=launch-evidence/first-buyer-feedback-packet.md pnpm launch:first-buyer-feedback ${baseUrl} -- --buyer-type=individual --email=${buyerEmail} --offer=founding-learner`,
    "pnpm launch:sales-tracker",
    `LAUNCH_ACCESS_REVOCATION_REPORT_PATH=launch-evidence/access-revocation-packet.md pnpm launch:access-revocation ${baseUrl} -- --email=${buyerEmail} --target-type=enrollment --target-id=enrollment_example --reason=refund`,
    "pnpm launch:emergency-stop",
    "```",
    "",
    "## Evidence Gate",
    "",
    "- [ ] Smoke test shows the deployed commit matches the expected commit.",
    "- [ ] Checkout smoke returns a Stripe-hosted URL, but the raw URL was not saved.",
    "- [ ] Email smoke is accepted and the inbox test confirms the link opens the deployed domain.",
    "- [ ] Readiness snapshot is saved and reviewed.",
    "- [ ] Live purchase rehearsal packet is filled before `ENABLE_PAID_ENROLLMENT=true` is used.",
    "- [ ] First controlled live purchase creates access without a manual rescue.",
    "- [ ] First-buyer proof packet and fulfillment checklist are saved.",
    "- [ ] First-buyer feedback packet is prepared after support issues are resolved.",
    "- [ ] Outreach stays controlled until the first real buyer path works.",
    "",
    "## Stop Rules",
    "",
    "- If checkout opens the wrong offer or wrong price, stop.",
    "- If the webhook does not deliver `checkout.session.completed`, stop.",
    "- If the buyer pays but access does not appear, stop.",
    "- If passwordless email sends a localhost, preview, or wrong-domain link, stop.",
    "- If the deployed commit does not match the expected commit, stop.",
    "- If any stop rule triggers, set `ENABLE_PAID_ENROLLMENT=false`, restart or redeploy if needed, and run `pnpm launch:emergency-stop`.",
    "",
    "Related files:",
    "",
    "- docs/launch/stripe-setup-guide.md",
    "- docs/launch/email-setup-guide.md",
    "- docs/launch/go-live-checklist.md",
    "- docs/launch/first-buyer-fulfillment-checklist.md",
    "- scripts/launch-first-buyer-feedback.mjs",
    "- docs/launch/paid-launch-emergency-stop.md",
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
  const expectedCommit =
    getArgValue("expected-commit") ||
    process.env.LAUNCH_EXPECTED_COMMIT ||
    (await getCurrentCommit());
  const testEmail = normalizeEmail(
    getArgValue("email") || process.env.LAUNCH_TEST_EMAIL,
    "internal.test@example.com"
  );
  const buyerEmail = normalizeEmail(
    getArgValue("buyer-email") || process.env.LAUNCH_BUYER_EMAIL,
    "buyer@example.com"
  );
  const reportPath = getReportPath();
  const packet = renderPacket({
    baseUrl,
    expectedCommit,
    testEmail,
    buyerEmail,
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
      : "Paid launch proof sequence could not be created."
  );
  process.exitCode = 1;
});
