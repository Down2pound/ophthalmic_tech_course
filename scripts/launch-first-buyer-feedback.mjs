#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import path from "node:path";

const defaultBaseUrl = "https://your-real-domain.example";
const recommendedReportPath = path.join(
  "launch-evidence",
  "first-buyer-feedback-packet.md"
);

const supportedBuyerTypes = new Set(["individual", "practice", "unknown"]);

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalBaseUrl() {
  const positional = process.argv
    .slice(2)
    .find(arg => !arg.startsWith("--") && /^https?:\/\//.test(arg));
  return positional || "";
}

function normalizeBaseUrl(value) {
  return (value || defaultBaseUrl).replace(/\/+$/, "");
}

function normalizeBuyerType(value) {
  const normalized = (value || "unknown").trim().toLowerCase();
  return supportedBuyerTypes.has(normalized) ? normalized : "unknown";
}

function getReportPath() {
  return (
    getArgValue("report-path") ||
    process.env.LAUNCH_FIRST_BUYER_FEEDBACK_REPORT_PATH ||
    ""
  ).trim();
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function buildMailto({ recipient, subject, body }) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${recipient}?${params.toString()}`;
}

function renderPacket({
  baseUrl,
  buyerType,
  buyerName,
  buyerEmail,
  offer,
  supportEmail,
}) {
  const feedbackSubject =
    buyerType === "practice"
      ? "OptiTech Academy practice onboarding feedback"
      : "OptiTech Academy course feedback";

  const feedbackBody =
    buyerType === "practice"
      ? [
          `Hi ${buyerName || "[Name]"},`,
          "",
          "Thank you for reviewing OptiTech Academy for practice onboarding.",
          "",
          "Could you reply with short answers to these questions?",
          "",
          "1. What would make this course easier to approve for a practice?",
          "2. Which onboarding topic would help new technicians most?",
          "3. What felt confusing before or after purchase?",
          "4. Did seat setup or learner access feel clear?",
          "5. What would you want a supervisor or owner to know before buying?",
          "6. May I quote a short part of your feedback publicly if I remove private details?",
          "",
          "Please do not include patient information, private employee performance details, or protected health information.",
          "",
          "Thank you,",
          "[Your Name]",
        ].join("\n")
      : [
          `Hi ${buyerName || "[Name]"},`,
          "",
          "Thank you for trying OptiTech Academy.",
          "",
          "Could you reply with short answers to these questions?",
          "",
          "1. What made the course feel useful?",
          "2. What almost stopped you from buying or signing in?",
          "3. Which page, lesson, or explanation felt confusing?",
          "4. What topic should be added next for a beginner ophthalmic technician?",
          "5. Would you recommend this to an individual learner, a practice, or both?",
          "6. May I quote a short part of your feedback publicly if I remove private details?",
          "",
          "Please do not include patient information, private workplace details, or protected health information.",
          "",
          "Thank you,",
          "[Your Name]",
        ].join("\n");

  const mailtoHref = buildMailto({
    recipient: buyerEmail || supportEmail,
    subject: feedbackSubject,
    body: feedbackBody,
  });

  return [
    "# OptiTech Academy First Buyer Feedback Packet",
    "",
    `Created: ${todayIso()}`,
    "",
    "Simple translation: after the first buyer gets access, this is the safe question sheet. It helps you learn what to improve and whether you have a quote you are allowed to use.",
    "",
    "## When To Use This",
    "",
    "- Use this after the buyer has paid, signed in, opened Module 1, and any urgent support issue is resolved.",
    "- Use it for both individual learners and practice managers.",
    "- Save only business feedback, consent status, and improvement themes.",
    "- If access, payment, or sign-in failed, finish support first before asking for testimonial feedback.",
    "",
    "## Buyer Context",
    "",
    `- Buyer type: ${buyerType}`,
    `- Buyer name or practice: ${buyerName || "[blank]"}`,
    `- Buyer email: ${buyerEmail || "[blank]"}`,
    `- Offer: ${offer || "[blank]"}`,
    `- Site reviewed: ${baseUrl}`,
    `- Feedback support inbox: ${supportEmail}`,
    "",
    "## Safe Feedback Request Link",
    "",
    `Open this draft email: ${mailtoHref}`,
    "",
    "Review the draft before sending. It is meant to start the conversation, not pressure the buyer.",
    "",
    "## Individual Learner Questions",
    "",
    "Use these for career changers, medical assistants, and new techs buying for themselves.",
    "",
    "1. What made the course feel useful?",
    "2. What almost stopped you from buying or signing in?",
    "3. Which page, lesson, or explanation felt confusing?",
    "4. What topic should be added next for a beginner ophthalmic technician?",
    "5. Would you recommend this to an individual learner, a practice, or both?",
    "6. May I quote a short part of your feedback publicly if I remove private details?",
    "",
    "## Practice Manager Questions",
    "",
    "Use these for supervisors, owners, managers, and Spindel onboarding reviewers.",
    "",
    "1. What would make this course easier to approve for a practice?",
    "2. Which onboarding topic would help new technicians most?",
    "3. What felt confusing before or after purchase?",
    "4. Did seat setup or learner access feel clear?",
    "5. What proof would a supervisor or owner need before buying?",
    "6. May I quote a short part of your feedback publicly if I remove private details?",
    "",
    "## Testimonial Consent Rules",
    "",
    "- Only publish a quote when the buyer clearly says yes in writing.",
    "- Save the exact approved quote, the date approved, and whether their name, practice name, initials, or anonymous label may be used.",
    "- Never include patient information, protected health information, private employee performance details, card data, raw sign-in links, passwords, database records, Stripe secret keys, or admin tokens.",
    "- Never edit a quote in a way that changes what the buyer meant.",
    "- Do not publish claims about certification, licensure, employment, promotion, income, exam success, independent clinical competency, or replacing hands-on supervision.",
    "",
    "## Evidence To Save",
    "",
    "- Buyer type and offer.",
    "- Feedback request date.",
    "- Feedback received date.",
    "- Top useful theme.",
    "- Top confusing theme.",
    "- Next improvement to make.",
    "- Testimonial consent: yes, no, or not asked.",
    "- Approved public quote, if any.",
    "",
    "## Continue Or Pause Decision",
    "",
    "Continue outreach if:",
    "",
    "- Buyer got access without manual rescue.",
    "- Sign-in worked.",
    "- Feedback shows the offer was understandable.",
    "- No urgent support issue appeared.",
    "",
    "Pause broad outreach if:",
    "",
    "- Buyer could not access the course.",
    "- The buyer thought this was certification, employment proof, or a hands-on competency signoff.",
    "- The checkout, sign-in, welcome email, or practice-seat flow confused them badly.",
    "- Feedback includes a clinical accuracy concern that needs review.",
    "",
    "## Tracker",
    "",
    "Run this to export the matching CSV tracker:",
    "",
    "```bash",
    "LAUNCH_SALES_TRACKER_OUTPUT_DIR=launch-evidence/sales-tracker-templates pnpm launch:sales-tracker",
    "```",
    "",
    "Use `first-buyer-feedback-tracker.csv` for the safe summary row.",
    "",
    "## Stop Rules",
    "",
    "- Stop if the buyer shares patient information or protected health information. Delete it from the tracker and keep only a general theme.",
    "- Stop if the buyer asks for medical, legal, billing, hiring, credentialing, or employment advice.",
    "- Stop if the buyer reports access, payment, or sign-in problems. Move to the first-sale support runbook first.",
    "- Stop if you are tempted to save secrets or raw access links in Google Drive.",
    "",
  ].join("\n");
}

const baseUrl = normalizeBaseUrl(
  getArgValue("base-url") ||
    getPositionalBaseUrl() ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    defaultBaseUrl
);
const buyerType = normalizeBuyerType(getArgValue("buyer-type"));
const buyerName = getArgValue("buyer-name");
const buyerEmail = getArgValue("email") || process.env.LAUNCH_BUYER_EMAIL || "";
const offer = getArgValue("offer");
const supportEmail =
  getArgValue("support-email") ||
  process.env.LAUNCH_SUPPORT_EMAIL ||
  "support@example.com";
const reportPath = getReportPath();

const packet = renderPacket({
  baseUrl,
  buyerType,
  buyerName,
  buyerEmail,
  offer,
  supportEmail,
});

console.log(packet);

if (reportPath) {
  const resolvedReportPath = path.resolve(reportPath);
  await writeFile(resolvedReportPath, packet, "utf8");
  console.log(`\nSaved first buyer feedback packet to ${resolvedReportPath}`);
} else {
  console.log(`\nRecommended report path: ${recommendedReportPath}`);
}
