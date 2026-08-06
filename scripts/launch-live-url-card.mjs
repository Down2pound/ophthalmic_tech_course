#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rawUrl =
  process.argv[2]?.trim() ||
  process.env.LAUNCH_BASE_URL?.trim() ||
  process.env.PUBLIC_APP_URL?.trim() ||
  "https://your-real-domain.example";
const recommendedReportPath = "launch-evidence/live-url-command-card.md";

function normalizeBaseUrl(value) {
  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.replace(/\/+$/, "");
  }
}

function getWarnings(value) {
  const warnings = [];

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (url.protocol !== "https:") {
      warnings.push("Use an https URL before sending links to buyers.");
    }

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      warnings.push(
        "Do not use localhost for Stripe, email, sitemap, or buyers."
      );
    }

    if (hostname.endsWith(".example") || hostname === "example.com") {
      warnings.push(
        "Replace the example URL with the real Render or custom domain."
      );
    }
  } catch {
    warnings.push(
      "The URL could not be parsed. Use a full URL like https://your-domain.com."
    );
  }

  return warnings;
}

const baseUrl = normalizeBaseUrl(rawUrl);
const warnings = getWarnings(baseUrl);
const expectedCommit =
  process.env.LAUNCH_EXPECTED_COMMIT?.trim() || "paste-current-git-commit";

function getReportPath() {
  const value = process.env.LAUNCH_LIVE_URL_REPORT_PATH?.trim() || "";
  return value ? path.resolve(value) : "";
}

const buyerLinks = [
  ["First-buyer overview", "/first-sale"],
  ["Individual checkout or interest list", "/checkout"],
  ["Practice packs", "/practice-packs"],
  ["Free lesson preview", "/preview"],
  ["Buyer guide", "/buyer-guide"],
  ["Curriculum", "/curriculum"],
  ["Policies", "/policies"],
  ["Sitemap", "/sitemap.xml"],
  ["Robots", "/robots.txt"],
];

const endpointLinks = [
  ["Health", "/api/health"],
  ["Launch readiness", "/api/launch/readiness"],
  ["Checkout availability", "/api/checkout/availability"],
];

function link(path) {
  return `${baseUrl}${path}`;
}

const lines = [
  "# OptiTech Academy Live URL Command Card",
  "",
  `Production URL: ${baseUrl}`,
  "",
  "Simple translation: this turns your live website address into the exact checks and links you need before sending the course to buyers.",
  "",
  "Do not paste Stripe secret keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, or protected health information into this card.",
  "",
  "## URL Warnings",
  "",
  ...(warnings.length > 0
    ? warnings.map(warning => `- ${warning}`)
    : ["- No obvious URL warning found."]),
  "",
  "## Browser Checks",
  "",
  ...endpointLinks.map(([label, path]) => `- ${label}: ${link(path)}`),
  ...buyerLinks.map(([label, path]) => `- ${label}: ${link(path)}`),
  "",
  "## PowerShell Commands",
  "",
  "```powershell",
  `$env:LAUNCH_BASE_URL="${baseUrl}"`,
  `$env:LAUNCH_EXPECTED_COMMIT="${expectedCommit}"`,
  "$env:PUBLIC_APP_URL=$env:LAUNCH_BASE_URL",
  '$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"',
  "pnpm launch:smoke",
  '$env:LAUNCH_SOURCE_AUDIT_REPORT_PATH="launch-evidence/course-source-audit.md"',
  "pnpm launch:source-audit",
  "pnpm launch:sitemap",
  "pnpm launch:owner-go-no-go",
  '$env:LAUNCH_CHECKOUT_SMOKE_REPORT_PATH="launch-evidence/checkout-session-smoke-report.md"',
  "pnpm launch:checkout-smoke -- --email=internal.test@example.com --offer=founding-learner",
  "pnpm launch:email-smoke -- --email=internal.test@example.com",
  '$env:LAUNCH_LEAD_PIPELINE_SMOKE_REPORT_PATH="launch-evidence/lead-pipeline-smoke-report.md"',
  "pnpm launch:lead-pipeline-smoke",
  '$env:LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH="launch-evidence/module-1-clinical-signoff-packet.md"',
  'pnpm launch:clinical-signoff -- --reviewer-name="Dr. Reviewer" --reviewer-role="Ophthalmologist" --review-date="2026-08-06" --approved-version="module-one-v1"',
  '$env:LAUNCH_GO_LIVE_REPORT_PATH="launch-evidence/go-live-packet.md"',
  "pnpm launch:go-live",
  '$env:LAUNCH_PAID_PROOF_REPORT_PATH="launch-evidence/paid-launch-proof-sequence.md"',
  "pnpm launch:paid-proof",
  '$env:LAUNCH_FIRST_SALES_REPORT_PATH="launch-evidence/first-sales-link-packet.md"',
  "pnpm launch:first-sales",
  '$env:LAUNCH_FIRST_10_CUSTOMERS_REPORT_PATH="launch-evidence/first-10-customers-plan.md"',
  "pnpm launch:first-10-customers",
  '$env:LAUNCH_FIRST_WEEK_SALES_REPORT_PATH="launch-evidence/first-week-sales-plan.md"',
  "pnpm launch:first-week-sales",
  '$env:LAUNCH_SALES_TRACKER_OUTPUT_DIR="launch-evidence/sales-tracker-templates"',
  "pnpm launch:sales-tracker",
  '$env:LAUNCH_FIRST_BUYER_REPORT_PATH="launch-evidence/first-buyer-command-center.md"',
  "pnpm launch:first-buyer",
  '$env:LAUNCH_FULFILLMENT_REPORT_PATH="launch-evidence/first-buyer-fulfillment-checklist.md"',
  "pnpm launch:fulfillment",
  '$env:LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH="launch-evidence/first-buyer-proof.md"',
  '$env:LAUNCH_BUYER_EMAIL="buyer@example.com"',
  "pnpm launch:first-buyer-proof",
  "```",
  "",
  "## Bash Commands",
  "",
  "```bash",
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke`,
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_EXPECTED_COMMIT=${expectedCommit} LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke`,
  "LAUNCH_SOURCE_AUDIT_REPORT_PATH=launch-evidence/course-source-audit.md pnpm launch:source-audit",
  `PUBLIC_APP_URL=${baseUrl} pnpm launch:sitemap`,
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:owner-go-no-go`,
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_CHECKOUT_SMOKE_REPORT_PATH=launch-evidence/checkout-session-smoke-report.md pnpm launch:checkout-smoke -- --email=internal.test@example.com --offer=founding-learner`,
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:email-smoke -- --email=internal.test@example.com`,
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_LEAD_PIPELINE_SMOKE_REPORT_PATH=launch-evidence/lead-pipeline-smoke-report.md pnpm launch:lead-pipeline-smoke`,
  `LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH=launch-evidence/module-1-clinical-signoff-packet.md pnpm launch:clinical-signoff -- --reviewer-name="Dr. Reviewer" --reviewer-role="Ophthalmologist" --review-date="2026-08-06" --approved-version="module-one-v1"`,
  `LAUNCH_GO_LIVE_REPORT_PATH=launch-evidence/go-live-packet.md pnpm launch:go-live ${baseUrl}`,
  `LAUNCH_PAID_PROOF_REPORT_PATH=launch-evidence/paid-launch-proof-sequence.md LAUNCH_EXPECTED_COMMIT=${expectedCommit} pnpm launch:paid-proof ${baseUrl}`,
  `PUBLIC_APP_URL=${baseUrl} LAUNCH_FIRST_SALES_REPORT_PATH=launch-evidence/first-sales-link-packet.md pnpm launch:first-sales`,
  `LAUNCH_FIRST_10_CUSTOMERS_REPORT_PATH=launch-evidence/first-10-customers-plan.md pnpm launch:first-10-customers`,
  `LAUNCH_FIRST_WEEK_SALES_REPORT_PATH=launch-evidence/first-week-sales-plan.md pnpm launch:first-week-sales`,
  `LAUNCH_SALES_TRACKER_OUTPUT_DIR=launch-evidence/sales-tracker-templates pnpm launch:sales-tracker`,
  `PUBLIC_APP_URL=${baseUrl} LAUNCH_FIRST_BUYER_REPORT_PATH=launch-evidence/first-buyer-command-center.md pnpm launch:first-buyer`,
  `LAUNCH_FULFILLMENT_REPORT_PATH=launch-evidence/first-buyer-fulfillment-checklist.md pnpm launch:fulfillment`,
  `LAUNCH_BUYER_EMAIL=buyer@example.com LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH=launch-evidence/first-buyer-proof.md pnpm launch:first-buyer-proof ${baseUrl}`,
  "```",
  "",
  "## Final Paid Launch Commands",
  "",
  "Use these only after clinical review, database, Stripe, email, admin tokens, and test-mode proof are done:",
  "",
  "```bash",
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:smoke`,
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:go-no-go`,
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_LIVE_PURCHASE_REPORT_PATH=launch-evidence/live-purchase-rehearsal-report.md pnpm launch:live-purchase-test -- --email=internal.test@example.com`,
  "```",
  "",
  "If anything fails after paid enrollment opens, run:",
  "",
  "```bash",
  "pnpm launch:emergency-stop",
  "```",
  "",
];

const report = lines.join("\n");
const reportPath = getReportPath();

console.log(report);

if (reportPath) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, report, "utf8");
  console.log(`Report written: ${reportPath}`);
} else {
  console.log(`Recommended report path: ${recommendedReportPath}`);
}
