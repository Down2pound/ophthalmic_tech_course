#!/usr/bin/env node
import { getExitCode, runSmokeTest } from "./launch-smoke.mjs";

function basicDeploymentOk(report) {
  return (
    report.healthOk &&
    report.publicPagesOk &&
    report.checkoutAvailabilityOk &&
    report.securityHeadersOk &&
    report.robotsTxtOk
  );
}

function getDecision(report) {
  const deploymentOk = basicDeploymentOk(report);
  const learnerInterestCollection = report.learnerInterest.tested
    ? report.learnerInterest.ok
      ? "go"
      : "no-go"
    : "caution";
  const practiceInquiryCollection = report.practiceInquiry.tested
    ? report.practiceInquiry.ok
      ? "go"
      : "no-go"
    : "caution";

  if (!deploymentOk) {
    return {
      publicPreviewSharing: "no-go",
      learnerInterestCollection:
        learnerInterestCollection === "go"
          ? "caution"
          : learnerInterestCollection,
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
      learnerInterestCollection,
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
    learnerInterestCollection,
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

function renderDecision(decision) {
  if (decision === "go") return "GO";
  if (decision === "caution") return "CAUTION";
  return "NO-GO";
}

function renderList(items, emptyText) {
  if (!items || items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function shareableLink({ label, url, status }) {
  return `- ${label}: ${status} - ${url}`;
}

function renderShareableLinks({ baseUrl, decision }) {
  const previewStatus =
    decision.publicPreviewSharing === "go" ? "shareable" : "hold";
  const practiceStatus =
    decision.practiceInquiryCollection === "go"
      ? "shareable"
      : decision.practiceInquiryCollection === "caution"
        ? "review-only"
        : "hold";
  const learnerStatus =
    decision.learnerInterestCollection === "go"
      ? "shareable"
      : decision.learnerInterestCollection === "caution"
        ? "review-only"
        : "hold";
  const paidStatus =
    decision.paidCheckoutSharing === "go" ? "shareable" : "do not share";

  return [
    "## Shareable Link Buckets",
    "",
    "Public preview links:",
    "",
    shareableLink({
      label: "First buyer page",
      url: `${baseUrl}/first-sale`,
      status: previewStatus,
    }),
    shareableLink({
      label: "Preview",
      url: `${baseUrl}/preview`,
      status: previewStatus,
    }),
    shareableLink({
      label: "Curriculum",
      url: `${baseUrl}/curriculum`,
      status: previewStatus,
    }),
    shareableLink({
      label: "Buyer guide",
      url: `${baseUrl}/buyer-guide`,
      status: previewStatus,
    }),
    shareableLink({
      label: "Policies",
      url: `${baseUrl}/policies`,
      status: previewStatus,
    }),
    "",
    "Individual learner interest links:",
    "",
    shareableLink({
      label: "Individual enrollment and interest list",
      url: `${baseUrl}/checkout`,
      status: learnerStatus,
    }),
    shareableLink({
      label: "First buyer page",
      url: `${baseUrl}/first-sale`,
      status: learnerStatus,
    }),
    "",
    "Practice outreach links:",
    "",
    shareableLink({
      label: "Practice packs",
      url: `${baseUrl}/practice-packs`,
      status: practiceStatus,
    }),
    shareableLink({
      label: "Onboarding overview",
      url: `${baseUrl}/onboarding`,
      status: practiceStatus,
    }),
    shareableLink({
      label: "Skills passport",
      url: `${baseUrl}/skills-passport`,
      status: practiceStatus,
    }),
    "",
    "Paid checkout links:",
    "",
    shareableLink({
      label: "Individual checkout",
      url: `${baseUrl}/checkout`,
      status: paidStatus,
    }),
    shareableLink({
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

function renderReport(report) {
  const decision = getDecision(report);

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
    `- Learner interest collection: ${renderDecision(decision.learnerInterestCollection)}`,
    `- Practice inquiry collection: ${renderDecision(decision.practiceInquiryCollection)}`,
    `- Paid checkout links: ${renderDecision(decision.paidCheckoutSharing)}`,
    "",
    decision.summary,
    "",
    ...renderShareableLinks({ baseUrl: report.baseUrl, decision }),
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
    `- Learner interest capture: ${
      report.learnerInterest.tested
        ? report.learnerInterest.ok
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

async function main() {
  const baseUrl = process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const testPracticeInquiry =
    process.env.LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY === "true";
  const testLearnerInterest =
    process.env.LAUNCH_SMOKE_TEST_LEARNER_INTEREST === "true";
  const report = await runSmokeTest({
    baseUrl,
    testPracticeInquiry,
    testLearnerInterest,
  });

  console.log(renderReport(report));

  process.exitCode = getExitCode(report, {
    allowNotReady: true,
  });
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Launch go/no-go report failed.";
  console.error(message);
  process.exitCode = 1;
});
