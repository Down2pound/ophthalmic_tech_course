#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath =
  "launch-evidence/live-purchase-rehearsal-report.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalUrl() {
  return process.argv.slice(2).find(arg => !arg.startsWith("--")) ?? "";
}

function safeValue(value, fallback = "[fill after purchase]") {
  return value && value.trim() ? value.trim() : fallback;
}

const evidenceItems = [
  "Production URL tested",
  "Commit deployed",
  "Readiness result before purchase",
  "Checkout availability result before purchase",
  "Offer purchased",
  "Buyer email used",
  "Stripe Checkout session ID",
  "Stripe event ID",
  "Webhook delivery status",
  "App access result",
  "Email delivery result",
  "Refund or keep-access decision",
];

function renderLivePurchaseRehearsal({
  baseUrl = "",
  buyerEmail = "",
  offer = "",
  generatedAt = new Date().toISOString(),
} = {}) {
  return [
    "# OptiTech Academy Live Purchase Rehearsal",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Use this only after test-mode checkout, email sign-in, production database setup, clinical review, and deployed smoke testing already pass.",
    "",
    "Beginner translation: this is the tiny real-money test before you invite real customers. You are checking that the cash register, receipt, access list, and sign-in email all work together.",
    "",
    "Do not paste Stripe secret keys, webhook signing secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, or protected health information into this checklist.",
    "",
    "## Before The Live Purchase",
    "",
    "1. Confirm the deployed app is the commit you meant to launch.",
    "2. Confirm `/api/health` returns `ok: true`.",
    "3. Confirm `/api/launch/readiness` says the database, Stripe, email, clinical review, and admin protections are ready.",
    "4. Confirm `/api/checkout/availability` says enrollment is open.",
    "5. Confirm live Stripe keys and the live webhook are configured in the host dashboard.",
    "6. Confirm the webhook listens for `checkout.session.completed`.",
    "7. Confirm `ENABLE_PAID_ENROLLMENT=true` only after all earlier checks passed.",
    "",
    "## Recommended Low-Risk Purchase",
    "",
    "- Buy the lowest-price public offer first: Founding Learner Access.",
    "- Use an internal email address that you can access.",
    "- Use a real payment method only if you are authorized to do so.",
    "- Keep the test boring: one purchase, one email, one result.",
    "",
    "## Planned Purchase",
    "",
    `- Production URL: ${safeValue(baseUrl)}`,
    `- Buyer email: ${safeValue(buyerEmail)}`,
    `- Offer: ${safeValue(offer, "Founding Learner Access")}`,
    `- Recommended report path: ${recommendedReportPath}`,
    "",
    "## What To Prove",
    "",
    "- Stripe creates a successful live Checkout session.",
    "- The live webhook receives `checkout.session.completed`.",
    "- The app creates durable learner access in the production database.",
    "- The welcome or sign-in email arrives.",
    "- The learner can sign in and open Module 1.",
    "- `/api/launch/readiness` still reports ready after the purchase.",
    "",
    "## Evidence To Save",
    "",
    ...evidenceItems.map(item => `- [ ] ${item}: [fill after purchase]`),
    "",
    "Then run:",
    "",
    "```bash",
    "pnpm launch:fulfillment",
    "pnpm launch:sales-tracker",
    "```",
    "",
    "Use the fulfillment checklist and `first-buyer-fulfillment-checklist.csv` to confirm the buyer received access without a manual rescue.",
    "",
    "Save evidence in launch notes or the launch evidence folder without including secrets, raw tokens, card numbers, or private clinical data.",
    "",
    "## If Anything Fails",
    "",
    "1. Immediately turn paid enrollment back off by setting `ENABLE_PAID_ENROLLMENT=false` in the production host dashboard.",
    "2. Redeploy or restart the app if the host requires it.",
    "3. Confirm `/api/checkout/availability` says enrollment is paused.",
    "4. Run `pnpm launch:emergency-stop` and follow the red-button checklist.",
    "5. Check Stripe webhook delivery and the app logs.",
    "6. Fix the issue in test mode first.",
    "7. Repeat `pnpm launch:smoke` before another live purchase rehearsal.",
    "",
    "## After It Passes",
    "",
    "1. Decide whether to refund the internal purchase or keep it as a real internal license.",
    "2. Run `pnpm launch:fulfillment` and save the safe evidence.",
    "3. Run the final production smoke test again.",
    "4. Send only the first controlled sales links from `pnpm launch:first-sales` and `pnpm launch:first-buyer`.",
    "5. Watch the first real buyer closely before broad promotion.",
    "",
    "Related guides:",
    "",
    "- docs/launch/go-live-checklist.md",
    "- docs/launch/paid-launch-emergency-stop.md",
    "- docs/launch/stripe-setup-guide.md",
    "- docs/launch/first-sale-support-runbook.md",
    "",
  ].join("\n");
}

async function main() {
  const report = renderLivePurchaseRehearsal({
    baseUrl:
      getArgValue("url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      "",
    buyerEmail:
      getArgValue("email") || process.env.LAUNCH_LIVE_PURCHASE_EMAIL || "",
    offer:
      getArgValue("offer") ||
      process.env.LAUNCH_LIVE_PURCHASE_OFFER ||
      "Founding Learner Access",
  });

  console.log(report);

  if (process.env.LAUNCH_LIVE_PURCHASE_REPORT_PATH) {
    const reportPath = path.resolve(
      process.env.LAUNCH_LIVE_PURCHASE_REPORT_PATH
    );
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, report, "utf8");
    console.log(`Report written: ${reportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Live purchase rehearsal report failed."
  );
  process.exitCode = 1;
});
