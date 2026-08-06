#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const checklistPath = path.join(
  projectRoot,
  "docs",
  "launch",
  "go-live-checklist.md"
);
const recommendedReportPath = "launch-evidence/go-live-packet.md";

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

  if (!trimmedValue) {
    return {
      url: "https://your-real-domain.example",
      warnings: ["No production URL was provided."],
    };
  }

  try {
    const url = new URL(trimmedValue);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";

    const normalizedUrl = url.toString().replace(/\/$/, "");
    const hostname = url.hostname.toLowerCase();
    const warnings = [];

    if (url.protocol !== "https:") {
      warnings.push("Use https before running a real paid launch.");
    }

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      warnings.push("Do not use a local computer URL for paid launch.");
    }

    if (hostname.endsWith(".example") || hostname === "example.com") {
      warnings.push("Replace the example domain with the real deployed URL.");
    }

    return { url: normalizedUrl, warnings };
  } catch {
    return {
      url: trimmedValue.replace(/\/+$/, ""),
      warnings: ["The production URL could not be parsed."],
    };
  }
}

function getReportPath() {
  const value =
    getArgValue("report-path") || process.env.LAUNCH_GO_LIVE_REPORT_PATH || "";

  return value ? path.resolve(value) : "";
}

function renderWarnings(warnings) {
  if (warnings.length === 0) return ["- No obvious URL warnings."];
  return warnings.map(warning => `- ${warning}`);
}

function renderPacket({ baseUrl, warnings, checklist }) {
  return [
    "# OptiTech Academy Final Go-Live Packet",
    "",
    `Production URL: ${baseUrl}`,
    "",
    "Simple translation: this is the final launch-day recipe. It helps you avoid turning on the cash register before the store, receipts, email, and access notebook are all working.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, email API keys, database passwords, admin tokens, raw sign-in links, session cookies, card numbers, patient information, protected health information, or private employee details into this packet.",
    "",
    "## URL Warnings",
    "",
    ...renderWarnings(warnings),
    "",
    "## Final Command Sequence",
    "",
    "Run these from the production-ready branch after the host dashboard values are set.",
    "",
    "```bash",
    "pnpm launch:preflight",
    "LAUNCH_SOURCE_AUDIT_REPORT_PATH=launch-evidence/course-source-audit.md pnpm launch:source-audit",
    'LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH=launch-evidence/module-1-clinical-signoff-packet.md pnpm launch:clinical-signoff -- --reviewer-name="Dr. Reviewer" --reviewer-role="Ophthalmologist" --review-date="2026-08-06" --approved-version="module-one-v1"',
    `LAUNCH_GO_LIVE_REPORT_PATH=launch-evidence/go-live-packet.md pnpm launch:go-live ${baseUrl}`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke`,
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:readiness-snapshot ${baseUrl}`,
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:go-no-go`,
    `LAUNCH_PAID_PROOF_REPORT_PATH=launch-evidence/paid-launch-proof-sequence.md pnpm launch:paid-proof ${baseUrl}`,
    "```",
    "",
    "Only after readiness is green, Stripe live mode is configured, and `ENABLE_PAID_ENROLLMENT=true` has been set in the production host:",
    "",
    "```bash",
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:smoke`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_LIVE_PURCHASE_REPORT_PATH=launch-evidence/live-purchase-rehearsal-report.md pnpm launch:live-purchase-test -- --email=internal.test@example.com`,
    `LAUNCH_BUYER_EMAIL=buyer@example.com LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH=launch-evidence/first-buyer-proof.md pnpm launch:first-buyer-proof ${baseUrl}`,
    "pnpm launch:fulfillment",
    "pnpm launch:sales-tracker",
    "```",
    "",
    "If anything fails after paid enrollment opens:",
    "",
    "```bash",
    "pnpm launch:emergency-stop",
    "```",
    "",
    "## Required Green Lights Before Sending Paid Links",
    "",
    "- [ ] `pnpm launch:preflight` passed on the exact commit deployed.",
    "- [ ] `PUBLIC_APP_URL` uses the real HTTPS production URL.",
    "- [ ] `/api/health` is healthy.",
    "- [ ] `/api/launch/readiness` says `readyForPaidLaunch: true`.",
    "- [ ] `/api/checkout/availability` says checkout is open.",
    "- [ ] Stripe live checkout and live webhook are configured.",
    "- [ ] Passwordless email is configured and tested.",
    "- [ ] Hosted PostgreSQL schema is verified.",
    "- [ ] Module 1 clinical review is approved.",
    "- [ ] Practice-seat and alert admin tokens are configured.",
    "- [ ] One low-risk internal live purchase created access without a manual rescue.",
    "- [ ] First-buyer proof packet was saved.",
    "",
    "## Source Checklist",
    "",
    checklist,
    "",
  ].join("\n");
}

async function main() {
  const { url: baseUrl, warnings } = normalizeBaseUrl(
    getArgValue("base-url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      ""
  );
  const reportPath = getReportPath();
  const checklist = await readFile(checklistPath, "utf8");
  const packet = renderPacket({ baseUrl, warnings, checklist });

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
      : "Go-live packet could not be created."
  );
  process.exitCode = 1;
});
