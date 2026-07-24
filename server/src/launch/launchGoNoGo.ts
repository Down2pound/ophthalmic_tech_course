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

function formatShareableLink({
  label,
  url,
  status,
}: {
  label: string;
  url: string;
  status: string;
}): string {
  return `- ${label}: ${status} - ${url}`;
}

function renderShareableLinkBuckets({
  baseUrl,
  decision,
}: {
  baseUrl: string;
  decision: LaunchGoNoGoDecision;
}): string[] {
  const previewStatus =
    decision.publicPreviewSharing === "go" ? "shareable" : "hold";
  const practiceStatus =
    decision.practiceInquiryCollection === "go"
      ? "shareable"
      : decision.practiceInquiryCollection === "caution"
        ? "review-only"
        : "hold";
  const paidStatus =
    decision.paidCheckoutSharing === "go" ? "shareable" : "do not share";

  return [
    "## Shareable Link Buckets",
    "",
    "Public preview links:",
    "",
    formatShareableLink({
      label: "Preview",
      url: `${baseUrl}/preview`,
      status: previewStatus,
    }),
    formatShareableLink({
      label: "Curriculum",
      url: `${baseUrl}/curriculum`,
      status: previewStatus,
    }),
    formatShareableLink({
      label: "Buyer guide",
      url: `${baseUrl}/buyer-guide`,
      status: previewStatus,
    }),
    formatShareableLink({
      label: "Policies",
      url: `${baseUrl}/policies`,
      status: previewStatus,
    }),
    "",
    "Practice outreach links:",
    "",
    formatShareableLink({
      label: "Practice packs",
      url: `${baseUrl}/practice-packs`,
      status: practiceStatus,
    }),
    formatShareableLink({
      label: "Onboarding overview",
      url: `${baseUrl}/onboarding`,
      status: practiceStatus,
    }),
    formatShareableLink({
      label: "Skills passport",
      url: `${baseUrl}/skills-passport`,
      status: practiceStatus,
    }),
    "",
    "Paid checkout links:",
    "",
    formatShareableLink({
      label: "Individual checkout",
      url: `${baseUrl}/checkout`,
      status: paidStatus,
    }),
    formatShareableLink({
      label: "Practice pack checkout",
      url: `${baseUrl}/practice-packs`,
      status: paidStatus,
    }),
    "",
    decision.paidCheckoutSharing === "go"
      ? "Paid links are marked shareable only because paid readiness is green. Still run one controlled internal live purchase before broad outreach."
      : "Paid links are listed for convenience, but they should not be sent to buyers until paid readiness is green and one internal live purchase works.",
    "",
  ];
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
    ...renderShareableLinkBuckets({ baseUrl: report.baseUrl, decision }),
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
