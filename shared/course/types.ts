export type CourseAudience =
  | "career-starter"
  | "medical-assistant-bridge"
  | "practice-onboarding";

export type PublicationStatus = "published" | "scheduled" | "draft";

export type VerificationType = "knowledge-check" | "supervisor-observed";

export interface CourseSource {
  id: string;
  title: string;
  sourceType: "google-doc" | "pdf" | "official-website" | "repo";
  url: string;
  classification:
    | "public-course-candidate"
    | "official-reference"
    | "practice-only"
    | "excluded";
}

export interface ContentReview {
  author: string;
  clinicalReviewer: string;
  reviewStatus: "draft-reviewed-for-structure" | "clinically-reviewed";
  reviewDate: string;
  nextReviewDate: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortTitle: string;
  outcome: string;
  description: string;
  durationMinutes: number;
  level: "Foundational" | "Intermediate" | "Advanced";
  status: PublicationStatus;
  objectives: string[];
  topics: string[];
  sourceIds: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  status: PublicationStatus;
  outcome: string;
  body: string[];
  clinicContext: string;
  commonMistakes: string[];
  patientFriendlyScript: string;
  scenarioPrompt: string;
  scopeNote: string;
  sources: CourseSource[];
  review: ContentReview;
}

export interface SkillPassportItem {
  id: string;
  moduleId: string;
  title: string;
  verificationType: VerificationType;
  observableCriteria: string[];
  safetyCriticalErrors: string[];
}

export interface CourseCatalog {
  id: string;
  title: string;
  version: string;
  audience: CourseAudience[];
  promise: string;
  limitations: string[];
  modules: CourseModule[];
  skillsPassport: SkillPassportItem[];
}
