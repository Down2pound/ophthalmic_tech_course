/**
 * Curriculum type definitions for 10-day ophthalmic technician training program
 */

export interface Module {
  id: number;
  day: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  learningOutcomes: string[];
  assessmentType: AssessmentType;
  videoUrl?: string;
  resources?: ModuleResource[];
  prerequisites?: number[]; // day numbers
  status: ModuleStatus;
}

export type AssessmentType =
  | "quiz"
  | "hands-on"
  | "case-study"
  | "exam"
  | "role-play"
  | "practical";

export type ModuleStatus = "draft" | "published" | "archived";

export interface ModuleResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
}

export type ResourceType =
  | "pdf"
  | "video"
  | "presentation"
  | "worksheet"
  | "case-study"
  | "external-link";

export interface StudentProgress {
  studentId: string;
  moduleId: number;
  day: number;
  status: ProgressStatus;
  completedAt?: Date;
  assessmentScore?: number;
  notes?: string;
}

export type ProgressStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "passed"
  | "failed";

export interface CurriculumOverview {
  title: string;
  description: string;
  totalDays: number;
  modules: Module[];
  notebookLmUrl: string;
  lastUpdated: Date;
}

export const CURRICULUM_CONFIG = {
  TOTAL_DAYS: 10,
  NOTEBOOKLM_URL:
    "https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1",
  MODULES: [
    {
      day: 1,
      title: "Ophthalmic Fundamentals & Anatomy",
      assessmentType: "quiz",
    },
    {
      day: 2,
      title: "Patient Assessment & History Taking",
      assessmentType: "role-play",
    },
    {
      day: 3,
      title: "Diagnostic Equipment - Part 1 (Refraction)",
      assessmentType: "hands-on",
    },
    {
      day: 4,
      title: "Diagnostic Equipment - Part 2 (Imaging)",
      assessmentType: "practical",
    },
    {
      day: 5,
      title: "Clinical Procedures & Measurements",
      assessmentType: "practical",
    },
    {
      day: 6,
      title: "Anterior Segment Examination",
      assessmentType: "case-study",
    },
    {
      day: 7,
      title: "Posterior Segment Examination",
      assessmentType: "case-study",
    },
    {
      day: 8,
      title: "Surgical Assistance & Instrumentation",
      assessmentType: "exam",
    },
    {
      day: 9,
      title: "Practice Management & Patient Communication",
      assessmentType: "role-play",
    },
    {
      day: 10,
      title: "Advanced Topics & Certification Preparation",
      assessmentType: "exam",
    },
  ],
} as const;
