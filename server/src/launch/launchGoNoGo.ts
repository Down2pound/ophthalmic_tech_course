import type { DeploymentSmokeTestReport } from "./deploymentSmokeTest";

export type LaunchDecision = "go" | "caution" | "no-go";

export interface LaunchGoNoGoDecision {
  publicPreviewSharing: LaunchDecision;
  practiceInquiryCollection: LaunchDecision;
  paidCheckoutSharing: LaunchDecision;
  summary: string;
  nextActions: string[];
}

function basicDeploymentOk(report: DeploymentSmokeTestReport): boolean {
  return (
    report.healthOk &&
    report.publicPagesOk &&
    report.checkoutAvailabilityOk &&
    report.securityHeadersOk &&
    report.robotsTxtOk
  );
}

export function getLaunchGoNoGoDecision(
  report: DeploymentSmokeTestReport
): LaunchGoNoGoDecision {
  const deploymentOk = basicDeploymentOk(report);
  const practiceInquiryCollection: LaunchDecision = report.practiceInquiry
    .tested
    ? report.practiceInquiry.ok
      ? "go"
      : "no-go"
    : "caution";

  if (!deploymentOk) {
    return {
      publicPreviewSharing: "no-go",
      practiceInquiryCollection:
        practiceInquiryCollection === "go"
          ? "caution"
          : practiceInquiryCollection,
      paidCheckoutSharing: "no-go",
      summary:
        "Do not share the site yet. One or more basic deployment checks failed.",
      nextActions: [
        "Fix failed health, public page, checkout availability, security header, or robots.txt checks.",
        "Rerun `LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=<your-url> pnpm launch:smoke`.",
        "Keep `ENABLE_PAID_ENROLLMENT=false` until the final paid smoke test passes.",
      ],
    };
  }

  if (!report.readyForPaidLaunch) {
    return {
      publicPreviewSharing: "go",
      practiceInquiryCollection,
      paidCheckoutSharing: "no-go",
      summary:
        "The public site can be shared carefully, but paid checkout links should stay closed.",
      nextActions: [
        "Share the home page, free preview, buyer guide, curriculum, policies, or practice inquiry path.",
        "Do not send paid checkout links broadly yet.",
        "Clear the launch blockers reported by `/api/launch/readiness`.",
        "After setup is complete, run one internal live purchase and the final production smoke test.",
      ],
    };
  }

  return {
    publicPreviewSharing: "go",
    practiceInquiryCollection,
    paidCheckoutSharing: "go",
    summary:
      "The deployment checks and paid launch readiness are green. Run one controlled live purchase before broad outreach.",
    nextActions: [
      "Run `pnpm launch:live-purchase-test` with a low-risk internal buyer.",
      "Confirm payment, webhook fulfillment, sign-in email, learner access, and support path.",
      "Then start with `pnpm launch:first-week-sales` instead of broad public marketing.",
    ],
  };
}

function renderDecision(decision: LaunchDecision): string {
  if (decision === "go") return "GO";
  if (decision === "caution") return "CAUTION";
  return "NO-GO";
}

function renderList(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

export function renderLaunchGoNoGoReport(
  report: DeploymentSmokeTestReport
): string {
  const decision = getLaunchGoNoGoDecision(report);

  return [
    "# OptiTech Academy Launch Go/No-Go Report",
    "",
    `Deployment URL: ${report.baseUrl}`,
    `Generated at: ${report.generatedAt}`,
    "",
    "Simple translation: this tells you what you are allowed to share right now.",
    "",
    "## Decision",
    "",
    `- Public preview links: ${renderDecision(decision.publicPreviewSharing)}`,
    `- Practice inquiry collection: ${renderDecision(
      decision.practiceInquiryCollection
    )}`,
    `- Paid checkout links: ${renderDecision(decision.paidCheckoutSharing)}`,
    "",
    decision.summary,
    "",
    "## Evidence",
    "",
    `- Health endpoint: ${report.healthOk ? "ok" : "failed"}`,
    `- Public buyer pages: ${report.publicPagesOk ? "ok" : "failed"}`,
    `- Checkout availability endpoint: ${
      report.checkoutAvailabilityOk ? "ok" : "failed"
    }`,
    `- Security headers: ${report.securityHeadersOk ? "ok" : "failed"}`,
    `- Robots.txt rules: ${report.robotsTxtOk ? "ok" : "failed"}`,
    `- Practice inquiry capture: ${
      report.practiceInquiry.tested
        ? report.practiceInquiry.ok
          ? "ok"
          : "failed"
        : "not tested"
    }`,
    `- Paid launch readiness: ${report.readyForPaidLaunch ? "ready" : "not ready"}`,
    "",
    "## Blockers From Readiness",
    "",
    ...renderList(report.blockers, "No readiness blockers reported."),
    "",
    "## Warnings",
    "",
    ...renderList(report.warnings, "No warnings reported."),
    "",
    "## Next Actions",
    "",
    ...decision.nextActions.map(action => `- ${action}`),
    "",
    "## Safe Outreach Rule",
    "",
    "Until paid checkout links are GO, send the overview, free preview, buyer guide, curriculum, policies, or practice inquiry path instead of direct paid checkout links.",
    "",
    "Do not paste real Stripe keys, webhook secrets, database passwords, email API keys, admin tokens, session cookies, raw sign-in links, patient information, protected health information, private learner details, or private employer details into this report.",
    "",
  ].join("\n");
}
