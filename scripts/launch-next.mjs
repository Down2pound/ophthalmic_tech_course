#!/usr/bin/env node

const appUrl = process.env.PUBLIC_APP_URL || "https://your-real-domain.example";

const setupGroups = [
  {
    label: "Clinical signoff",
    variables: [
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      "MODULE_ONE_CLINICAL_REVIEW_DATE",
      "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
    ],
    nextTitle: "Finish Module 1 clinical review",
    nextDetail:
      "Download the review packet, resolve corrections, then record the MODULE_ONE_CLINICAL_* signoff values in the host dashboard.",
    nextCommand: "pnpm launch:clinical-review-request",
  },
  {
    label: "Hosted database connection",
    variables: ["DATABASE_URL", "DATABASE_SSL"],
    nextTitle: "Connect hosted PostgreSQL",
    nextDetail:
      "Use the Render Blueprint database or set DATABASE_URL and DATABASE_SSL=true in the production host dashboard.",
    nextCommand: "pnpm launch:database-setup",
  },
  {
    label: "Stripe checkout and webhook",
    variables: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "PUBLIC_APP_URL",
      "ENABLE_PAID_ENROLLMENT",
    ],
    nextTitle: "Finish Stripe checkout and webhook setup",
    nextDetail:
      "Create live products, set the Stripe secret key, create the checkout.session.completed webhook, and save the webhook signing secret.",
    nextCommand: "pnpm launch:stripe-products",
  },
  {
    label: "Passwordless email",
    variables: [
      "AUTH_SESSION_SECRET",
      "TRANSACTIONAL_EMAIL_API_URL",
      "TRANSACTIONAL_EMAIL_API_KEY",
      "SIGN_IN_FROM_EMAIL",
      "PUBLIC_APP_URL",
    ],
    nextTitle: "Configure passwordless sign-in email",
    nextDetail:
      "Add the transactional email API URL, API key, and verified from-address so buyers can receive sign-in links.",
    nextCommand: "pnpm launch:email-setup",
  },
  {
    label: "Practice-seat admin token",
    variables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
    nextTitle: "Protect practice seat assignment",
    nextDetail:
      "Set a strong practice-seat admin token before selling team packs to clinics.",
    nextCommand: "pnpm launch:admin-tokens",
  },
  {
    label: "Alert admin token",
    variables: ["ALERT_ADMIN_TOKEN"],
    nextTitle: "Protect alert-button administration",
    nextDetail:
      "Set a strong alert admin token before deploying the alert-button editor with the public app.",
    nextCommand: "pnpm launch:admin-tokens",
  },
];

function isBlank(value) {
  return !value || value.trim().length === 0;
}

function isPlaceholder(value) {
  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.includes("replace_with") ||
    normalizedValue.includes("_replace_") ||
    normalizedValue.includes("your_") ||
    normalizedValue.includes("your-") ||
    normalizedValue.includes("example.com") ||
    normalizedValue.includes(".example") ||
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
      value.trim()
    )
  );
}

function missingVariables(variables) {
  return variables.filter(variableName => {
    const value = process.env[variableName];
    return isBlank(value) || isPlaceholder(value);
  });
}

function isFlagEnabled(variableName) {
  return process.env[variableName]?.trim().toLowerCase() === "true";
}

function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY?.trim() || "";
  if (!key) return "missing";
  if (key.startsWith("sk_" + "test_")) return "test";
  if (key.startsWith("sk_" + "live_")) return "live";
  return "unknown";
}

const statuses = setupGroups.map(group => ({
  ...group,
  missing: missingVariables(group.variables),
}));

const clinicalReady =
  statuses[0].missing.length === 0 &&
  isFlagEnabled("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
const databaseReady = statuses[1].missing.length === 0;
const stripeReady = statuses[2].missing.length === 0 && stripeMode() === "live";
const emailReady = statuses[3].missing.length === 0;
const practiceAdminReady = statuses[4].missing.length === 0;
const alertAdminReady = statuses[5].missing.length === 0;
const paidEnrollmentOn = isFlagEnabled("ENABLE_PAID_ENROLLMENT");
const readyForPaidLaunch =
  clinicalReady &&
  databaseReady &&
  stripeReady &&
  emailReady &&
  practiceAdminReady &&
  alertAdminReady &&
  paidEnrollmentOn;

function currentPhase() {
  if (readyForPaidLaunch) return "ready for final paid launch proof";
  if (!clinicalReady) return "clinical signoff";
  if (!databaseReady) return "production database setup";
  if (!stripeReady) return "Stripe live checkout setup";
  if (!emailReady) return "passwordless email setup";
  if (!practiceAdminReady || !alertAdminReady) return "admin protection setup";
  if (!paidEnrollmentOn) return "final paid-enrollment switch";
  return "launch verification";
}

function statusLine(ready) {
  return ready ? "done" : "needs work";
}

const nextActions = statuses
  .filter(group => group.missing.length > 0)
  .slice(0, 5)
  .flatMap((group, index) => [
    `${index + 1}. ${group.nextTitle}`,
    `   ${group.nextDetail}`,
    `   Command: \`${group.nextCommand}\``,
    `   Missing or placeholder settings: ${group.missing.join(", ")}`,
  ]);

if (!paidEnrollmentOn) {
  const missingGroupCount = statuses.filter(
    group => group.missing.length > 0
  ).length;
  const nextNumber = Math.min(missingGroupCount, 5) + 1;
  if (nextActions.length < 20) {
    nextActions.push(
      `${nextNumber}. Keep paid enrollment disabled until final proof`,
      "   Turn this on only after clinical review, Stripe, email, database, deployed smoke test, and buyer-flow QA all pass.",
      "   Setting for final launch only: `ENABLE_PAID_ENROLLMENT=true`"
    );
  }
}

const lines = [
  "# OptiTech Academy Launch Next-Step Command Center",
  "",
  "Simple translation: this is the dashboard note that tells you what to do next before real people pay for the course.",
  "",
  "This command is work-computer-safe. It uses plain Node and does not print secret values.",
  "",
  "Do not paste real Stripe keys, webhook secrets, database passwords, email API keys, admin tokens, session cookies, raw sign-in links, patient information, or private learner details into this output.",
  "",
  "## Current Phase",
  "",
  `- Current phase: ${currentPhase()}`,
  `- Paid launch ready from environment only: ${readyForPaidLaunch ? "maybe" : "no"}`,
  `- Individual learner sales: ${readyForPaidLaunch ? "environment-ready" : "blocked"}`,
  `- Practice pack sales: ${readyForPaidLaunch ? "environment-ready" : "blocked"}`,
  `- Production URL being checked: ${appUrl}`,
  "",
  "## Setup Gates",
  "",
  `- Clinical signoff: ${statusLine(clinicalReady)}`,
  `- Hosted database connection: ${statusLine(databaseReady)}`,
  "- Database tables verified: needs production check with `pnpm db:setup` and `/api/launch/readiness`",
  `- Stripe live checkout and webhook: ${statusLine(stripeReady)}`,
  `- Stripe key mode: ${stripeMode()}`,
  `- Passwordless email: ${statusLine(emailReady)}`,
  `- Practice-seat admin token: ${statusLine(practiceAdminReady)}`,
  `- Alert admin token: ${statusLine(alertAdminReady)}`,
  `- Paid enrollment switch: ${paidEnrollmentOn ? "on" : "off"}`,
  "",
  "## Next Best Actions",
  "",
  ...(nextActions.length === 0
    ? [
        "1. Run the production smoke test and one low-risk internal live purchase before public sales.",
      ]
    : nextActions),
  "",
  "## Home PC Commands",
  "",
  "Run these after Git works and the latest code is on the home PC:",
  "",
  "```bash",
  "pnpm install",
  "pnpm check",
  "pnpm test",
  "pnpm launch:secret-scan",
  "pnpm build",
  "pnpm launch:preflight",
  "```",
  "",
  "## Production Host Commands",
  "",
  "Use these when the app is deployed and `PUBLIC_APP_URL` is the real HTTPS domain:",
  "",
  "```bash",
  `PUBLIC_APP_URL=${appUrl} pnpm launch:sitemap`,
  `PUBLIC_APP_URL=${appUrl} pnpm launch:first-sales`,
  `LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=${appUrl} pnpm launch:smoke`,
  "```",
  "",
  "Only after every blocker is cleared:",
  "",
  "```bash",
  "pnpm launch:live-purchase-test",
  `LAUNCH_BASE_URL=${appUrl} pnpm launch:smoke`,
  "```",
  "",
  "## Do Not Turn On Yet Unless All Are True",
  "",
  "- Module 1 clinical review is approved and recorded.",
  "- Stripe live checkout and webhook are configured.",
  "- Passwordless email sends sign-in links from a verified sender.",
  "- Hosted PostgreSQL is connected and `pnpm db:setup` has run.",
  "- Practice-seat and alert admin tokens are set.",
  "- `/api/launch/readiness` reports ready for paid launch.",
  "- One low-risk internal live purchase works end to end.",
  "",
  "Keep `ENABLE_PAID_ENROLLMENT=false` until those checks are true.",
  "",
  "Related commands: `pnpm launch:blockers`, `pnpm launch:doctor`, `pnpm launch:render-setup`, `pnpm launch:env-template`, `pnpm launch:secrets`.",
  "",
];

console.log(lines.join("\n"));
