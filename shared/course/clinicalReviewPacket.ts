import { moduleOneLessons } from "./moduleOneLessons";

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

export function isModuleOneClinicallyReviewed(): boolean {
  return moduleOneLessons.every(
    lesson => lesson.review.reviewStatus === "clinically-reviewed"
  );
}
