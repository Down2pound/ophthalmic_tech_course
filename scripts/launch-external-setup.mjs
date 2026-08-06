#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const worksheetPath = path.join(
  projectRoot,
  "docs",
  "launch",
  "external-setup-worksheet.md"
);
const recommendedReportPath = "launch-evidence/external-setup-session.md";

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

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_EXTERNAL_SETUP_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
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

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "America/New_York",
  }).format(new Date());
}

function renderSessionPacket({ baseUrl }) {
  return [
    "# OptiTech Academy External Setup Session Packet",
    "",
    `Session date: ${todayLabel()}`,
    `Production URL target: ${baseUrl}`,
    "",
    "Simple translation: this is the home-PC setup game plan. Open the outside accounts, paste secret values only into those dashboards, then save proof that each piece works.",
    "",
    "Do not paste real Stripe keys, webhook secrets, email API keys, database passwords, generated admin tokens, session cookies, raw sign-in links, card numbers, patient information, protected health information, private learner details, or private employer details into this packet.",
    "",
    "## Open These First",
    "",
    "- GitHub branch: https://github.com/Down2pound/ophthalmic_tech_course/tree/codex/optitech-product-spec",
    "- Render dashboard: https://dashboard.render.com/",
    "- Stripe dashboard: https://dashboard.stripe.com/",
    "- Resend dashboard: https://resend.com/",
    "- Main launch checklist: docs/launch/go-live-checklist.md",
    "- External setup worksheet: docs/launch/external-setup-worksheet.md",
    "",
    "## One-Session Command Order",
    "",
    "Run these from the project folder on the home PC:",
    "",
    "```bash",
    "pnpm install",
    "pnpm launch:preflight",
    `LAUNCH_ENV_TEMPLATE_REPORT_PATH=launch-evidence/host-dashboard-env-template.md pnpm launch:env-template ${baseUrl}`,
    "pnpm launch:render-setup",
    "pnpm launch:stripe-products",
    "pnpm launch:email-setup",
    "pnpm launch:admin-tokens",
    "pnpm launch:clinical-review-request",
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke`,
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:readiness-snapshot`,
    "pnpm launch:dashboard-proof",
    "```",
    "",
    "Use this only after the dashboard values are complete and you are intentionally proving paid launch:",
    "",
    "```bash",
    "pnpm launch:dashboard-proof -- --paid",
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:go-no-go`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_LIVE_PURCHASE_REPORT_PATH=launch-evidence/live-purchase-rehearsal-report.md pnpm launch:live-purchase-test -- --email=internal.test@example.com`,
    "```",
    "",
    "## Dashboard Values To Finish",
    "",
    "- [ ] `PUBLIC_APP_URL`: real Render or custom https URL.",
    "- [ ] `DATABASE_URL`: hosted PostgreSQL connection in Render or another provider.",
    "- [ ] `DATABASE_SSL`: `true` for production.",
    "- [ ] `STRIPE_SECRET_KEY`: Stripe server key, pasted only into the host dashboard.",
    "- [ ] `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret for `/api/stripe/webhook`.",
    "- [ ] `TRANSACTIONAL_EMAIL_API_URL`: email provider send endpoint.",
    "- [ ] `TRANSACTIONAL_EMAIL_API_KEY`: email provider key, pasted only into the host dashboard.",
    "- [ ] `SIGN_IN_FROM_EMAIL`: verified sender address.",
    "- [ ] `AUTH_SESSION_SECRET`: generated secret, stored only in the host dashboard.",
    "- [ ] `PRACTICE_SEAT_ADMIN_TOKEN`: generated admin token, stored only in the host dashboard.",
    "- [ ] `ALERT_ADMIN_TOKEN`: generated admin token, stored only in the host dashboard.",
    "- [ ] `MODULE_ONE_CLINICAL_*`: clinical signoff fields.",
    "- [ ] `ENABLE_PAID_ENROLLMENT`: keep `false` until all proof is done.",
    "",
    "## Proof To Save",
    "",
    "- [ ] GitHub branch shows the commit being deployed.",
    "- [ ] Render deploy succeeded.",
    "- [ ] `/api/health` works on the production URL.",
    "- [ ] `pnpm db:setup` ran against hosted PostgreSQL.",
    "- [ ] Stripe webhook listens for `checkout.session.completed`.",
    "- [ ] Passwordless email arrives and opens the deployed app.",
    "- [ ] Clinical review is documented before paid enrollment opens.",
    "- [ ] `pnpm launch:dashboard-proof -- --paid` passes without printing private values.",
    "- [ ] One controlled internal live purchase proves payment, webhook fulfillment, sign-in, and Module 1 access.",
    "",
    "## Stop Rules",
    "",
    "- Stop if clinical review is not approved.",
    "- Stop if `PUBLIC_APP_URL` is not a real https URL.",
    "- Stop if Stripe webhook delivery fails.",
    "- Stop if passwordless email does not arrive.",
    "- Stop if the first live purchase needs manual rescue.",
    "- Stop if any command asks you to paste secret values into GitHub, Google Drive, chat, tickets, screenshots, or this packet.",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl = normalizeBaseUrl(
    getArgValue("base-url") ||
      getArgValue("public-app-url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      ""
  );
  const worksheet = await readFile(worksheetPath, "utf8");
  const sessionPacket = renderSessionPacket({ baseUrl });
  const reportPath = getReportPath();
  const output = [sessionPacket, "---", "", worksheet].join("\n");

  console.log(output);

  if (reportPath) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, output, "utf8");
    console.log(`Saved external setup session packet: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "External setup session packet could not be created."
  );
  process.exitCode = 1;
});
