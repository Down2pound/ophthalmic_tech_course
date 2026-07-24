#!/usr/bin/env node

const fallbackBaseUrl = "https://your-real-domain.example";

function normalizeBaseUrl(rawBaseUrl) {
  const candidate = rawBaseUrl?.trim() || fallbackBaseUrl;
  return candidate.replace(/\/+$/, "");
}

function linkLine(label, url, whenToSend) {
  return `| ${label} | ${url} | ${whenToSend} |`;
}

const baseUrl = normalizeBaseUrl(process.env.PUBLIC_APP_URL);
const previewUrl = `${baseUrl}/preview`;
const curriculumUrl = `${baseUrl}/curriculum`;
const buyerGuideUrl = `${baseUrl}/buyer-guide`;
const policiesUrl = `${baseUrl}/policies`;
const firstSaleUrl = `${baseUrl}/first-sale`;
const individualCheckoutUrl = `${baseUrl}/checkout`;
const practicePacksUrl = `${baseUrl}/practice-packs`;
const readinessUrl = `${baseUrl}/api/launch/readiness`;
const availabilityUrl = `${baseUrl}/api/checkout/availability`;

const lines = [
  "# OptiTech Academy First Buyer Command Center",
  "",
  "Use this after the app has a real production URL and before you contact the first buyer.",
  "",
  "Simple translation: this is the small control panel for the first real sale. It tells you what links are safe, what to say, and when to stop.",
  "",
  `Base URL: ${baseUrl}`,
  "",
  "## 1. Traffic Light Checks",
  "",
  "Run these first:",
  "",
  "```bash",
  "pnpm launch:owner-go-no-go",
  "pnpm launch:first-sales",
  "pnpm launch:first-10-customers",
  "pnpm launch:manual-payment-links",
  "pnpm launch:sales-tracker",
  "```",
  "",
  "If the deployed site is ready for the final paid check, also run:",
  "",
  "```bash",
  "pnpm launch:live-purchase-test",
  "```",
  "",
  "## 2. Link Sending Rules",
  "",
  "| Link | URL | When to send |",
  "| ---- | --- | ------------ |",
  linkLine("Free preview", previewUrl, "Safe when owner go/no-go says public preview is GO."),
  linkLine("First-buyer overview", firstSaleUrl, "Safe when owner go/no-go says public preview is GO."),
  linkLine("Curriculum", curriculumUrl, "Safe when owner go/no-go says public preview is GO."),
  linkLine("Buyer guide", buyerGuideUrl, "Safe when someone asks what this is for or whether it fits them."),
  linkLine("Policies", policiesUrl, "Safe when someone asks about refunds, limits, certification, or supervision."),
  linkLine("Practice packs", practicePacksUrl, "Use as review-only until practice outreach is GO."),
  linkLine("Individual checkout or learner interest", individualCheckoutUrl, "Use for interest-list collection before paid checkout is GO. Do not request payment until the right payment path is approved."),
  linkLine("Checkout availability API", availabilityUrl, "Use for your own verification, not buyer outreach."),
  linkLine("Launch readiness API", readinessUrl, "Use for your own verification, not buyer outreach."),
  "",
  "## 3. First Buyer Order",
  "",
  "1. Choose one friendly internal or warm buyer.",
  "2. Send preview, curriculum, buyer guide, or practice-pack review links first.",
  "3. Send the first-buyer overview if the person needs one clear starting page.",
  "4. Ask one simple question: what would make starting in eye care or onboarding new techs easier?",
  "5. Use the learner interest list or practice inquiry path while paid checkout is closed.",
  "6. Send paid checkout only after readiness, smoke test, and internal live purchase proof are green.",
  "7. If automated checkout is not ready but an approved first buyer will use a Stripe Payment Link, run `pnpm launch:manual-payment-links` first.",
  "8. Watch the first buyer complete payment, sign-in, and Module 1 access.",
  "9. Run `pnpm launch:fulfillment` and fill `first-buyer-fulfillment-checklist.csv` from `pnpm launch:sales-tracker`.",
  "",
  "## 4. Individual Learner Starter Message",
  "",
  "```text",
  "Hi [Name],",
  "",
  "I am opening a small first group for OptiTech Academy, a self-paced ophthalmic technician foundations course for career changers, medical assistants, and new eye-care team members.",
  "",
  "It helps with eye-care vocabulary, clinic flow, patient communication, and knowledge checks before hands-on supervised practice. It is education, not certification.",
  "",
  `Free preview: ${previewUrl}`,
  `First-buyer overview: ${firstSaleUrl}`,
  `Buyer guide: ${buyerGuideUrl}`,
  "",
  "Would you be open to looking at it and telling me what feels clear or confusing?",
  "```",
  "",
  "## 5. Practice Buyer Starter Message",
  "",
  "```text",
  "Hi [Name],",
  "",
  "I am opening a small first group for OptiTech Academy, a self-paced foundations course practices can use as a first layer of onboarding for new ophthalmic technicians or medical assistants moving into eye care.",
  "",
  "The course is meant to support shared language and supervised practice preparation. Local protocols, hands-on training, and competency signoff still stay with the practice.",
  "",
  `Practice pack review page: ${practicePacksUrl}`,
  `First-buyer overview: ${firstSaleUrl}`,
  `Buyer guide: ${buyerGuideUrl}`,
  "",
  "Would this help reduce repeated starter explanations for your new hires?",
  "```",
  "",
  "## 6. Pause Rules",
  "",
  "Pause outreach and keep `ENABLE_PAID_ENROLLMENT=false` if:",
  "",
  "- `/api/launch/readiness` is not ready for paid launch.",
  "- `pnpm launch:smoke` fails against production.",
  "- The internal live purchase fails.",
  "- The first buyer needs manual rescue to receive access.",
  "- A buyer misunderstands the course as certification, employment, exam success, or independent clinical competency.",
  "",
  "## 7. Safe Claims",
  "",
  "Say: foundational learning, onboarding support, shared language, knowledge checks, and supervised practice preparation.",
  "",
  "Do not promise certification, employment, promotion, exam success, income, clinical competency, or replacement of hands-on supervision.",
  "",
  "Do not save `.env`, Stripe keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, protected health information, private learner details, or private employer details in sales notes.",
  "",
];

console.log(lines.join("\n"));
