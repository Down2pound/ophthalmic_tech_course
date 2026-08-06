#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function normalizeBaseUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(
      "Set LAUNCH_BASE_URL or PUBLIC_APP_URL to the deployed https site."
    );
  }

  let url;
  try {
    url = new URL(trimmedValue);
  } catch {
    throw new Error(
      "Use a full deployed URL like https://your-domain.example."
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function getOutputDir() {
  return path.resolve(process.env.LAUNCH_EVIDENCE_DIR || "launch-evidence");
}

function boolLabel(value) {
  return value === true ? "yes" : "no";
}

function list(items, emptyText) {
  if (!Array.isArray(items) || items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function getBlockers(snapshot) {
  const staticBlockers = snapshot?.staticSummary?.blockers;
  if (Array.isArray(staticBlockers) && staticBlockers.length > 0) {
    return staticBlockers;
  }

  const launchActions = snapshot?.launchActions;
  if (Array.isArray(launchActions)) {
    return launchActions
      .filter(action => action?.status !== "complete")
      .map(action => action?.title)
      .filter(Boolean);
  }

  return [];
}

function renderSummary({ baseUrl, snapshot, generatedAt }) {
  const blockers = getBlockers(snapshot);
  const warnings = Array.isArray(snapshot?.warnings) ? snapshot.warnings : [];
  const nextSetupSteps = Array.isArray(snapshot?.nextSetupSteps)
    ? snapshot.nextSetupSteps.map(
        step =>
          `${step.title}: ${step.detail}${step.command ? ` Command: ${step.command}` : ""}`
      )
    : [];

  return [
    "# OptiTech Academy Runtime Readiness Snapshot",
    "",
    `Generated at: ${generatedAt}`,
    `Production URL: ${baseUrl}`,
    "",
    "Simple translation: this is the launch scoreboard saved from the deployed app. If paid launch says no, keep paid checkout closed.",
    "",
    "## Decision",
    "",
    `- Ready for paid launch: ${boolLabel(snapshot?.readyForPaidLaunch)}`,
    `- Individual learner sales ready: ${boolLabel(snapshot?.salesChannels?.individualLearner?.ready)}`,
    `- Practice pack sales ready: ${boolLabel(snapshot?.salesChannels?.practicePacks?.ready)}`,
    "",
    "## Setup Status",
    "",
    `- Stripe checkout configured: ${boolLabel(snapshot?.commerce?.checkoutConfigured)}`,
    `- Stripe webhook configured: ${boolLabel(snapshot?.commerce?.webhookConfigured)}`,
    `- Stripe key mode: ${snapshot?.commerce?.stripeSecretKeyMode ?? "unknown"}`,
    `- Paid enrollment enabled: ${boolLabel(snapshot?.commerce?.paidEnrollmentEnabled)}`,
    `- Passwordless email configured: ${boolLabel(snapshot?.auth?.passwordlessConfigured)}`,
    `- Database configured: ${boolLabel(snapshot?.database?.databaseConfigured)}`,
    `- Database schema verified: ${boolLabel(snapshot?.databaseReadiness?.schemaVerified)}`,
    `- Clinical review approved: ${boolLabel(snapshot?.clinicalReview?.moduleOneReviewApproved)}`,
    `- Practice-seat admin protected: ${boolLabel(snapshot?.practiceSeatAdmin?.practiceSeatAdminConfigured)}`,
    `- Alert admin protected: ${boolLabel(snapshot?.alertAdmin?.alertAdminConfigured)}`,
    "",
    "## Blockers",
    "",
    ...list(blockers, "No blockers reported."),
    "",
    "## Warnings",
    "",
    ...list(warnings, "No warnings reported."),
    "",
    "## Next Setup Steps",
    "",
    ...list(nextSetupSteps, "No next setup steps reported."),
    "",
    "Do not paste secrets, tokens, cookies, card numbers, raw sign-in links, patient information, protected health information, or private employee details into this report.",
    "",
  ].join("\n");
}

async function fetchReadiness(baseUrl) {
  const response = await fetch(`${baseUrl}/api/launch/readiness`);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `${baseUrl}/api/launch/readiness returned HTTP ${response.status}.`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Readiness endpoint did not return valid JSON.");
  }
}

async function main() {
  const rawBaseUrl =
    process.argv[2] ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    "";
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const outputDir = getOutputDir();
  const generatedAt = new Date().toISOString();
  const snapshot = await fetchReadiness(baseUrl);
  const jsonPath = path.join(outputDir, "runtime-readiness-snapshot.json");
  const summaryPath = path.join(outputDir, "runtime-readiness-summary.md");

  await mkdir(outputDir, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await writeFile(
    summaryPath,
    renderSummary({ baseUrl, snapshot, generatedAt }),
    "utf8"
  );

  console.log("# OptiTech Academy Readiness Snapshot");
  console.log("");
  console.log(`Production URL: ${baseUrl}`);
  console.log(`JSON saved: ${jsonPath}`);
  console.log(`Summary saved: ${summaryPath}`);
  console.log(
    `Ready for paid launch: ${snapshot.readyForPaidLaunch === true ? "yes" : "no"}`
  );
  console.log("");
  console.log(
    "Do not sell until readiness is green and one internal live purchase passes."
  );
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Runtime readiness snapshot failed."
  );
  process.exitCode = 1;
});
