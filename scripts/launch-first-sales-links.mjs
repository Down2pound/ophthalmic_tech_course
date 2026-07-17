#!/usr/bin/env node

const fallbackBaseUrl = "https://your-real-domain.example";

function normalizeBaseUrl(rawBaseUrl) {
  const candidate = rawBaseUrl?.trim() || fallbackBaseUrl;
  return candidate.replace(/\/+$/, "");
}

function buildMailtoHref({ email, subject, body }) {
  const params = new URLSearchParams({ subject });
  params.set("body", body);
  return `mailto:${email}?${params.toString()}`;
}

const baseUrl = normalizeBaseUrl(process.env.PUBLIC_APP_URL);
const individualCheckoutUrl = `${baseUrl}/checkout`;
const practicePacksUrl = `${baseUrl}/practice-packs`;
const courseOverviewUrl = `${baseUrl}/`;
const freePreviewUrl = `${baseUrl}/preview`;
const buyerGuideUrl = `${baseUrl}/buyer-guide`;
const policiesUrl = `${baseUrl}/policies`;
const readinessUrl = `${baseUrl}/api/launch/readiness`;

const practiceInquiryMailto = buildMailtoHref({
  email: "jeff.chapin@spindeleye.com",
  subject: "OptiTech custom practice onboarding inquiry",
  body: [
    "Hi Jeff,",
    "",
    "I am interested in OptiTech Academy practice onboarding.",
    "",
    "Practice name:",
    "Primary contact:",
    "Approximate learner count:",
    "Target onboarding timeline:",
    "Interested in: five seats / fifteen seats / larger custom quote",
    "Main onboarding challenge:",
    "",
    "I understand this course supports foundational learning and does not replace local supervision, clinical policy, or hands-on competency signoff.",
  ].join("\n"),
});

const lines = [
  "# OptiTech Academy First Sales Link Packet",
  "",
  "Use this after the app is deployed and the launch gates are nearly ready.",
  "It is safe to run on a work computer because it does not print secret values.",
  "",
  `Base URL: ${baseUrl}`,
  "",
  "## Links To Share",
  "",
  `- Individual learners: ${individualCheckoutUrl}`,
  `- Practice buyers: ${practicePacksUrl}`,
  `- Course overview: ${courseOverviewUrl}`,
  `- Free lesson preview: ${freePreviewUrl}`,
  `- Buyer decision guide: ${buyerGuideUrl}`,
  `- Policies: ${policiesUrl}`,
  `- Readiness check: ${readinessUrl}`,
  `- Custom practice inquiry email: ${practiceInquiryMailto}`,
  "",
  "## Current Offers",
  "",
  "- Founding Learner Access: $199 for 12 months.",
  "- Five-Seat Practice Onboarding Pack: $799 for 12 months.",
  "- Fifteen-Seat Practice Onboarding Pack: $1,799 for 12 months.",
  "- Larger practices: start with a custom onboarding conversation.",
  "",
  "## Send First",
  "",
  "Individual learner message:",
  "",
  "```text",
  "Hi [Name],",
  "",
  "I am getting ready to launch OptiTech Academy, a self-paced ophthalmic technician foundations course for career changers, medical assistants, and new eye-care team members.",
  "",
  "It focuses on plain-language ophthalmic vocabulary, clinic flow, patient communication, knowledge checks, and supervised practice preparation. It is not a certification program and it does not replace hands-on training, but it can help someone feel much less lost when starting in eye care.",
  "",
  `Free preview: ${freePreviewUrl}`,
  `Buyer guide: ${buyerGuideUrl}`,
  `Founding Learner Access is $199 for 12 months when enrollment opens: ${individualCheckoutUrl}`,
  "",
  "Would you be open to taking a look when enrollment opens?",
  "```",
  "",
  "Practice buyer message:",
  "",
  "```text",
  "Hi [Name],",
  "",
  "I am preparing to launch OptiTech Academy, a self-paced foundations course for new ophthalmic technicians and medical assistants moving into eye care.",
  "",
  "The practice packs are designed for onboarding: each learner gets their own access, and supervisors can pair the course with local hands-on observation and practice-specific protocols.",
  "",
  `Free preview: ${freePreviewUrl}`,
  `Buyer guide: ${buyerGuideUrl}`,
  `Practice pack details: ${practicePacksUrl}`,
  "",
  "Would it be useful for your team if I sent the course overview link when it is ready?",
  "```",
  "",
  "## Do Not Send Paid Links Broadly Until",
  "",
  "- `/api/launch/readiness` reports paid launch readiness is complete.",
  "- `pnpm launch:preflight` passes on a home PC or CI.",
  "- `pnpm launch:smoke` passes against the deployed site.",
  "- A Stripe test purchase creates durable course access.",
  "- Module 1 clinical review is approved.",
  "",
  "## Safe Claim Reminder",
  "",
  "Say: foundational learning, onboarding support, shared language, knowledge checks, and supervised practice preparation.",
  "Do not promise certification, employment, promotion, exam success, clinical competency, or replacement of hands-on supervision.",
  "",
  "Full sales packet: docs/launch/first-customers-sales-packet.md",
  "",
];

console.log(lines.join("\n"));
