import { createMailtoHref } from "./offers";

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

function buildPublicUrl(publicAppUrl: string, path: string): string {
  return new URL(path, publicAppUrl).toString();
}

export function createLearnerLeadFollowUpHref({
  lead,
  publicAppUrl,
}: {
  lead: LearnerFollowUpLead;
  publicAppUrl: string;
}): string {
  const checkoutUrl = buildPublicUrl(publicAppUrl, "/checkout");
  const previewUrl = buildPublicUrl(publicAppUrl, "/preview");
  const buyerGuideUrl = buildPublicUrl(publicAppUrl, "/buyer-guide");
  const policiesUrl = buildPublicUrl(publicAppUrl, "/policies");

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
      `Individual access: ${checkoutUrl}`,
      `Policies: ${policiesUrl}`,
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
}: {
  lead: PracticeFollowUpLead;
  publicAppUrl: string;
}): string {
  const practicePacksUrl = buildPublicUrl(publicAppUrl, "/practice-packs");
  const buyerGuideUrl = buildPublicUrl(publicAppUrl, "/buyer-guide");
  const policiesUrl = buildPublicUrl(publicAppUrl, "/policies");
  const previewUrl = buildPublicUrl(publicAppUrl, "/preview");

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
      "",
      "The course does not replace practice-specific protocols, clinical supervision, employer policy, or hands-on signoff.",
      "",
      "Would a 15 to 20 minute fit conversation help us confirm learner count, supervisor owner, and rollout timing?",
      "",
      "Please do not send patient information, private employee performance details, passwords, card details, or raw sign-in links.",
    ].join("\n"),
  });
}
