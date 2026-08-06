#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath = "launch-evidence/first-buyer-proof.md";

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
    return "https://your-real-domain.example";
  }

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

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function getAdminToken() {
  return (
    process.env.LAUNCH_PRACTICE_SEAT_ADMIN_TOKEN ||
    process.env.PRACTICE_SEAT_ADMIN_TOKEN ||
    ""
  ).trim();
}

function yesNo(value) {
  return value ? "yes" : "no";
}

function renderList(items, emptyText) {
  if (!Array.isArray(items) || items.length === 0) {
    return [`- ${emptyText}`];
  }

  return items.map(item => `- ${item}`);
}

function sanitizeBuyerLookup(profile) {
  if (!profile) return null;

  return {
    email: profile.email,
    purchases: Array.isArray(profile.purchases)
      ? profile.purchases.map(purchase => ({
          checkoutSessionId: purchase.checkoutSessionId,
          offerId: purchase.offerId,
        }))
      : [],
    enrollments: Array.isArray(profile.enrollments)
      ? profile.enrollments.map(enrollment => ({
          enrollmentId: enrollment.enrollmentId,
          offerId: enrollment.offerId,
          status: enrollment.status,
          accessExpiresAt: enrollment.accessExpiresAt,
        }))
      : [],
    practiceSeatPacks: Array.isArray(profile.practiceSeatPacks)
      ? profile.practiceSeatPacks.map(pack => ({
          seatPackId: pack.seatPackId,
          offerId: pack.offerId,
          totalSeats: pack.totalSeats,
          assignedSeats: pack.assignedSeats,
          status: pack.status,
        }))
      : [],
    practiceSeatAssignments: Array.isArray(profile.practiceSeatAssignments)
      ? profile.practiceSeatAssignments.map(assignment => ({
          assignmentId: assignment.assignmentId,
          seatPackId: assignment.seatPackId,
          learnerEmail: assignment.learnerEmail,
          status: assignment.status,
        }))
      : [],
    summary: profile.summary,
    recommendedActions: profile.recommendedActions,
    supportNote: profile.supportNote,
  };
}

async function fetchBuyerLookup({ baseUrl, email, adminToken }) {
  if (!email || !adminToken || baseUrl.includes("your-real-domain.example")) {
    return null;
  }

  const url = `${baseUrl}/api/support/buyer-lookup?email=${encodeURIComponent(
    email
  )}`;
  const response = await fetch(url, {
    headers: {
      "x-admin-token": adminToken,
    },
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error || `Buyer lookup returned HTTP ${response.status}.`
    );
  }

  return sanitizeBuyerLookup(payload);
}

function renderLookupSummary(profile) {
  if (!profile) {
    return [
      "- Protected buyer lookup: not fetched",
      "- Reason: buyer email, deployed URL, or admin token was not available.",
    ];
  }

  return [
    "- Protected buyer lookup: fetched",
    `- Lookup email: ${profile.email}`,
    `- Purchases found: ${profile.purchases.length}`,
    `- Enrollments found: ${profile.enrollments.length}`,
    `- Practice seat packs found: ${profile.practiceSeatPacks.length}`,
    `- Practice seat assignments found: ${profile.practiceSeatAssignments.length}`,
    `- Has purchase: ${yesNo(profile.summary?.hasPurchase)}`,
    `- Has active enrollment: ${yesNo(profile.summary?.hasActiveEnrollment)}`,
    `- Has practice seat pack: ${yesNo(profile.summary?.hasPracticeSeatPack)}`,
    `- Remaining practice seats: ${profile.summary?.remainingPracticeSeats ?? "unknown"}`,
  ];
}

function renderProof({ baseUrl, buyerEmail, lookupProfile, lookupError }) {
  const lookupUrl = buyerEmail
    ? `${baseUrl}/api/support/buyer-lookup?email=${encodeURIComponent(buyerEmail)}`
    : `${baseUrl}/api/support/buyer-lookup?email=buyer@example.com`;

  return [
    "# OptiTech Academy First Buyer Proof Packet",
    "",
    "Use this immediately after the first real individual learner or practice buyer pays.",
    "",
    "Simple translation: this is the proof note that checks whether money turned into course access.",
    "",
    "Do not paste card numbers, Stripe secret keys, webhook secrets, raw sign-in links, session cookies, database passwords, patient information, protected health information, private learner details, or private employee details into this packet.",
    "",
    "## Buyer And Site",
    "",
    `- Production URL: ${baseUrl}`,
    `- Buyer email: ${buyerEmail || "[fill buyer email]"}`,
    `- Protected buyer lookup URL: ${lookupUrl}`,
    "",
    "## Live Lookup Summary",
    "",
    ...renderLookupSummary(lookupProfile),
    ...(lookupError ? [`- Lookup error: ${lookupError}`] : []),
    "",
    "## Stripe Evidence To Confirm",
    "",
    "- [ ] Stripe payment status is paid.",
    "- [ ] Checkout session ID is recorded in the sales tracker.",
    "- [ ] Stripe event ID for `checkout.session.completed` is recorded.",
    "- [ ] No refund, dispute, or failed-payment warning is present.",
    "",
    "## App Access Evidence To Confirm",
    "",
    "- [ ] Buyer lookup shows the purchase.",
    "- [ ] Individual learner purchase shows an active enrollment, or practice purchase shows the correct seat pack.",
    "- [ ] Buyer can request a passwordless sign-in email using the checkout email.",
    "- [ ] Buyer can open Module 1 without staff manually creating access.",
    "- [ ] Welcome email was sent, or the skip/failure reason is recorded.",
    "",
    "## Support Evidence To Save",
    "",
    ...(lookupProfile?.supportNote?.evidenceToSave
      ? renderList(
          lookupProfile.supportNote.evidenceToSave,
          "Use support IDs, purchase status, access status, and safe notes only."
        )
      : [
          "- Buyer type and offer purchased.",
          "- Checkout session ID and Stripe event ID.",
          "- Buyer lookup summary.",
          "- Whether sign-in and Module 1 access worked.",
        ]),
    "",
    "## Never Save",
    "",
    ...(lookupProfile?.supportNote?.neverSave
      ? renderList(
          lookupProfile.supportNote.neverSave,
          "Never save secrets or private links."
        )
      : [
          "- Card details.",
          "- Stripe secret keys or webhook secrets.",
          "- Raw passwordless sign-in links.",
          "- Session cookies.",
          "- Database passwords.",
          "- Patient information or protected health information.",
        ]),
    "",
    "## Decision Before More Outreach",
    "",
    "- [ ] Continue outreach only if payment, lookup, sign-in, and Module 1 access worked without a manual rescue.",
    "- [ ] If anything failed, set `ENABLE_PAID_ENROLLMENT=false` before sending more paid links.",
    "- [ ] Run `pnpm launch:fulfillment` and update `first-buyer-fulfillment-checklist.csv` from `pnpm launch:sales-tracker`.",
    "",
    "## Useful Commands",
    "",
    "```bash",
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:readiness-snapshot ${baseUrl}`,
    "pnpm launch:fulfillment",
    "pnpm launch:sales-tracker",
    "pnpm launch:emergency-stop",
    "```",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl = normalizeBaseUrl(
    getArgValue("base-url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      ""
  );
  const buyerEmail = normalizeEmail(
    getArgValue("email") || process.env.LAUNCH_BUYER_EMAIL || ""
  );
  const adminToken = getAdminToken();
  const reportPath = getReportPath();

  let lookupProfile = null;
  let lookupError = "";

  try {
    lookupProfile = await fetchBuyerLookup({
      baseUrl,
      email: buyerEmail,
      adminToken,
    });
  } catch (error) {
    lookupError =
      error instanceof Error ? error.message : "Buyer lookup failed.";
  }

  const proof = renderProof({
    baseUrl,
    buyerEmail,
    lookupProfile,
    lookupError,
  });

  console.log(proof);

  if (reportPath) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, proof, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "First buyer proof packet could not be created."
  );
  process.exitCode = 1;
});
