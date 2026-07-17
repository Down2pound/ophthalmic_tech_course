import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export interface ProductionSetupPlanInput {
  readinessReport?: RuntimeLaunchReadinessReport;
  appUrl?: string;
}

function status(value: boolean): string {
  return value ? "done" : "needs work";
}

function renderList(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function getCurrentPhase(readiness: RuntimeLaunchReadinessReport): string {
  if (readiness.readyForPaidLaunch) return "ready for final paid launch proof";
  if (!readiness.database.databaseConfigured) return "production setup";
  if (!readiness.databaseReadiness.schemaVerified) return "database setup";
  if (
    !readiness.commerce.checkoutConfigured ||
    !readiness.commerce.webhookConfigured
  ) {
    return "Stripe setup";
  }
  if (!readiness.auth.passwordlessConfigured) return "email setup";
  if (!readiness.clinicalReview.moduleOneReviewApproved) {
    return "clinical signoff";
  }
  if (!readiness.commerce.paidEnrollmentEnabled) {
    return "final paid-enrollment switch";
  }
  return "launch verification";
}

export function renderProductionSetupPlan({
  readinessReport = getRuntimeLaunchReadinessReport(),
  appUrl = process.env.PUBLIC_APP_URL || "https://your-real-domain.example",
}: ProductionSetupPlanInput = {}): string {
  const readiness = readinessReport;
  const nextSteps = readiness.nextSetupSteps ?? [];

  return [
    "# OptiTech Academy Launch Next-Step Command Center",
    "",
    "Simple translation: this is the dashboard note that tells you what to do next before real people pay for the course.",
    "",
    "Do not paste real Stripe keys, webhook secrets, database passwords, email API keys, admin tokens, session cookies, raw sign-in links, patient information, or private learner details into this output.",
    "",
    "## Current Phase",
    "",
    `- Current phase: ${getCurrentPhase(readiness)}`,
    `- Paid launch ready: ${readiness.readyForPaidLaunch ? "yes" : "no"}`,
    `- Individual learner sales: ${readiness.salesChannels.individualLearner.ready ? "ready" : "blocked"}`,
    `- Practice pack sales: ${readiness.salesChannels.practicePacks.ready ? "ready" : "blocked"}`,
    `- Production URL being checked: ${appUrl}`,
    "",
    "## Setup Gates",
    "",
    `- Clinical signoff: ${status(readiness.clinicalReview.moduleOneReviewApproved)}`,
    `- Hosted database connection: ${status(readiness.database.databaseConfigured)}`,
    `- Database tables verified: ${status(readiness.databaseReadiness.schemaVerified)}`,
    `- Stripe checkout: ${status(readiness.commerce.checkoutConfigured)}`,
    `- Stripe webhook: ${status(readiness.commerce.webhookConfigured)}`,
    `- Stripe live mode: ${status(readiness.commerce.stripeSecretKeyMode === "live")}`,
    `- Passwordless email: ${status(readiness.auth.passwordlessConfigured)}`,
    `- Practice-seat admin token: ${status(readiness.practiceSeatAdmin.practiceSeatAdminConfigured)}`,
    `- Alert admin token: ${status(readiness.alertAdmin.alertAdminConfigured)}`,
    `- Paid enrollment switch: ${readiness.commerce.paidEnrollmentEnabled ? "on" : "off"}`,
    "",
    "## Next Best Actions",
    "",
    ...nextSteps
      .slice(0, 5)
      .flatMap((step, index) => [
        `${index + 1}. ${step.title}`,
        `   ${step.detail}`,
        step.command ? `   Command or setting: \`${step.command}\`` : "",
      ])
      .filter(Boolean),
    ...(nextSteps.length === 0
      ? [
          "1. Run the production smoke test and one low-risk internal live purchase before public sales.",
        ]
      : []),
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
    ...renderList(
      [
        "Module 1 clinical review is approved and recorded.",
        "Stripe live checkout and webhook are configured.",
        "Passwordless email sends sign-in links from a verified sender.",
        "Hosted PostgreSQL is connected and `pnpm db:setup` has run.",
        "Practice-seat and alert admin tokens are set.",
        "`/api/launch/readiness` reports ready for paid launch.",
        "One low-risk internal live purchase works end to end.",
      ],
      "All paid launch gates are already satisfied."
    ),
    "",
    "Keep `ENABLE_PAID_ENROLLMENT=false` until those checks are true.",
    "",
    "Related commands: `pnpm launch:blockers`, `pnpm launch:doctor`, `pnpm launch:render-setup`, `pnpm launch:env-template`, `pnpm launch:secrets`.",
    "",
  ].join("\n");
}
