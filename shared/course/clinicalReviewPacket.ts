import { moduleOneLessons } from "./moduleOneLessons";
import type { Lesson } from "./types";

export interface ClinicalReviewLessonSummary {
  lessonId: string;
  title: string;
  outcome: string;
  scopeNote: string;
  reviewStatus: string;
  clinicalReviewer: string;
  sourceTitles: string[];
  reviewQuestions: string[];
}

export interface ClinicalReviewPacket {
  moduleId: string;
  moduleTitle: string;
  purpose: string;
  reviewerInstructions: string[];
  signoffFields: string[];
  lessons: ClinicalReviewLessonSummary[];
}

const reviewQuestions = [
  "Is the lesson clinically accurate for an entry-level ophthalmic learner?",
  "Does the lesson avoid diagnosis, treatment advice, or independent clinical authority?",
  "Are escalation and patient-safety boundaries clear?",
  "Are patient-facing scripts appropriate for a supervised beginner?",
  "Are corrections needed before paid launch?",
];

export const moduleOneClinicalReviewPacket: ClinicalReviewPacket = {
  moduleId: "entering-ophthalmic-care",
  moduleTitle: "Module 1: Entering Ophthalmic Care",
  purpose:
    "Support clinical review before OptiTech Academy accepts paid learners for Module 1.",
  reviewerInstructions: [
    "Read each lesson outcome, body, clinic context, patient-friendly script, scenario, common mistakes, and scope note.",
    "Confirm the content is appropriate for foundational ophthalmic technician education.",
    "Mark any clinical correction, scope concern, missing safety warning, or unclear patient-facing language.",
    "Do not approve launch until required corrections are resolved.",
  ],
  signoffFields: [
    "Clinical reviewer name",
    "Reviewer role or credentials",
    "Review date",
    "Approved module version",
    "Corrections required",
    "Corrections resolved date",
    "Final approval status",
  ],
  lessons: moduleOneLessons.map(lesson => ({
    lessonId: lesson.id,
    title: lesson.title,
    outcome: lesson.outcome,
    scopeNote: lesson.scopeNote,
    reviewStatus: lesson.review.reviewStatus,
    clinicalReviewer: lesson.review.clinicalReviewer,
    sourceTitles: lesson.sources.map(source => source.title),
    reviewQuestions,
  })),
};

export function getModuleOneClinicalReviewPacket(): ClinicalReviewPacket {
  return moduleOneClinicalReviewPacket;
}

function formatList(items: string[]): string {
  return items.map(item => `- ${item}`).join("\n");
}

function formatSignoffFields(fields: string[]): string {
  return fields.map(field => `- ${field}: ____________________`).join("\n");
}

function formatLessonForReview(lesson: Lesson, index: number): string {
  return [
    `## Lesson ${index + 1}: ${lesson.title}`,
    "",
    `Lesson ID: ${lesson.id}`,
    `Duration: ${lesson.durationMinutes} minutes`,
    `Status: ${lesson.status}`,
    `Review status: ${lesson.review.reviewStatus}`,
    `Clinical reviewer: ${lesson.review.clinicalReviewer}`,
    `Review date: ${lesson.review.reviewDate || "Not reviewed yet"}`,
    `Next review date: ${lesson.review.nextReviewDate}`,
    "",
    "### Learning Outcome",
    lesson.outcome,
    "",
    "### Lesson Body",
    formatList(lesson.body),
    "",
    "### Clinic Context",
    lesson.clinicContext,
    "",
    "### Patient-Friendly Script",
    lesson.patientFriendlyScript,
    "",
    "### Scenario Prompt",
    lesson.scenarioPrompt,
    "",
    "### Common Mistakes",
    formatList(lesson.commonMistakes),
    "",
    "### Scope Note",
    lesson.scopeNote,
    "",
    "### Sources",
    formatList(lesson.sources.map(source => `${source.title} (${source.url})`)),
    "",
    "### Reviewer Questions",
    formatList(moduleOneClinicalReviewPacket.lessons[index].reviewQuestions),
    "",
    "Reviewer notes:",
    "",
    "________________________________________________________________",
    "",
    "________________________________________________________________",
  ].join("\n");
}

export function renderModuleOneClinicalReviewPacketMarkdown(): string {
  return [
    `# ${moduleOneClinicalReviewPacket.moduleTitle} Clinical Review Packet`,
    "",
    moduleOneClinicalReviewPacket.purpose,
    "",
    "## Reviewer Instructions",
    formatList(moduleOneClinicalReviewPacket.reviewerInstructions),
    "",
    "## Signoff Fields",
    formatSignoffFields(moduleOneClinicalReviewPacket.signoffFields),
    "",
    ...moduleOneLessons.map(formatLessonForReview),
    "",
    "## Final Approval",
    "",
    "Final approval status: ____________________",
    "",
    "Reviewer signature: ____________________",
    "",
  ].join("\n");
}

export function isModuleOneClinicallyReviewed(): boolean {
  return moduleOneLessons.every(
    lesson => lesson.review.reviewStatus === "clinically-reviewed"
  );
}
