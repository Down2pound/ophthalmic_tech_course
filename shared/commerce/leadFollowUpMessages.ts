import { createMailtoHref } from "./offers";

const fallbackPublicAppUrl = "https://your-real-domain.example";

export interface LearnerFollowUpLead {
  learnerName: string;
  email: string;
  background: string;
  goal: string;
}

export interface PracticeFollowUpLead {
  practiceName: string;
  contactName: string;
  contactEmail: string;
  estimatedLearnerCount?: number;
  targetTimeline: string;
}

interface FollowUpDraftOptions {
  paidEnrollmentReady?: boolean;
}

function buildPublicUrl(publicAppUrl: string, path: string): string {
  try {
    const baseUrl = new URL(publicAppUrl.trim());

    if (!["http:", "https:"].includes(baseUrl.protocol)) {
      return new URL(path, fallbackPublicAppUrl).toString();
    }

    return new URL(path, baseUrl).toString();
  } catch {
    return new URL(path, fallbackPublicAppUrl).toString();
  }
}

export function createLearnerLeadFollowUpHref({
  lead,
  publicAppUrl,
  paidEnrollmentReady = false,
}: {
  lead: LearnerFollowUpLead;
  publicAppUrl: string;
} & FollowUpDraftOptions): string {
  const checkoutUrl = buildPublicUrl(publicAppUrl, "/checkout");
  const previewUrl = buildPublicUrl(publicAppUrl, "/preview");
  const buyerGuideUrl = buildPublicUrl(publicAppUrl, "/buyer-guide");
  const policiesUrl = buildPublicUrl(publicAppUrl, "/policies");
  const accessLine = paidEnrollmentReady
    ? `Individual access: ${checkoutUrl}`
    : `Interest and access page: ${checkoutUrl}`;
  const readinessLine = paidEnrollmentReady
    ? "Paid enrollment is open, so you can use the individual access page when you are ready."
    : "Paid enrollment may still be paused, so start with the free preview and buyer guide unless I confirm checkout is open.";

  return createMailtoHref({
    email: lead.email,
    subject: "OptiTech Academy founding learner follow-up",
    body: [
      `Hi ${lead.learnerName},`,
      "",
      "Thank you for your interest in OptiTech Academy.",
      "",
      `I saw that your background is listed as: ${lead.background}.`,
      `Your learning goal was: ${lead.goal}`,
      "",
      "This course is designed for career changers, medical assistants, and new ophthalmic team members who want plain-language foundations before or during supervised training.",
      "",
      `Free preview: ${previewUrl}`,
      `Buyer guide: ${buyerGuideUrl}`,
      accessLine,
      `Policies: ${policiesUrl}`,
      readinessLine,
      "",
      "Quick reminder: OptiTech Academy supports foundational learning and supervised practice preparation. It is not certification, employment, or hands-on competency signoff.",
      "",
      "Please reply with any questions. Do not send patient information, passwords, payment card details, or raw sign-in links.",
    ].join("\n"),
  });
}

export function createPracticeLeadFollowUpHref({
  lead,
  publicAppUrl,
  paidEnrollmentReady = false,
}: {
  lead: PracticeFollowUpLead;
  publicAppUrl: string;
} & FollowUpDraftOptions): string {
  const practicePacksUrl = buildPublicUrl(publicAppUrl, "/practice-packs");
  const buyerGuideUrl = buildPublicUrl(publicAppUrl, "/buyer-guide");
  const policiesUrl = buildPublicUrl(publicAppUrl, "/policies");
  const previewUrl = buildPublicUrl(publicAppUrl, "/preview");
  const readinessLine = paidEnrollmentReady
    ? "Paid enrollment is open, so the practice-pack page can be used for purchase when your team is ready."
    : "Paid enrollment may still be paused, so use the practice-pack page for review or inquiry until I confirm checkout is open.";

  return createMailtoHref({
    email: lead.contactEmail,
    subject: "OptiTech Academy practice onboarding follow-up",
    body: [
      `Hi ${lead.contactName},`,
      "",
      `Thank you for asking about OptiTech Academy for ${lead.practiceName}.`,
      "",
      `Estimated learners: ${lead.estimatedLearnerCount ?? "not provided"}`,
      `Target timeline: ${lead.targetTimeline}`,
      "",
      "OptiTech Academy can give new ophthalmic technicians and medical assistants a shared foundation before your team handles local workflows, observation, and hands-on competency signoff.",
      "",
      `Practice packs: ${practicePacksUrl}`,
      `Buyer guide: ${buyerGuideUrl}`,
      `Free preview: ${previewUrl}`,
      `Policies: ${policiesUrl}`,
      readinessLine,
      "",
      "The course does not replace practice-specific protocols, clinical supervision, employer policy, or hands-on signoff.",
      "",
      "Would a 15 to 20 minute fit conversation help us confirm learner count, supervisor owner, and rollout timing?",
      "",
      "Please do not send patient information, private employee performance details, passwords, card details, or raw sign-in links.",
    ].join("\n"),
  });
}
