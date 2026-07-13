import { certificatePreview } from "../../../shared/certificate/certificate";
import type { LearnerQuizProgress } from "../assessments/assessmentAttemptStore";
import type { ModuleLessonProgress } from "../progress/lessonProgressStore";

export interface CertificateRequirementStatus {
  id: "lessons-complete" | "knowledge-check-passed" | "limitations-reviewed";
  label: string;
  met: boolean;
}

export interface CertificateEligibility {
  eligible: boolean;
  learnerEmail: string;
  moduleId: string;
  certificateTitle: string;
  certificateSubtitle: string;
  completionStatement: string;
  limitationStatement: string;
  requirements: CertificateRequirementStatus[];
}

export function getCertificateEligibility({
  learnerEmail,
  moduleId,
  lessonProgress,
  quizProgress,
}: {
  learnerEmail: string;
  moduleId: string;
  lessonProgress: ModuleLessonProgress;
  quizProgress: LearnerQuizProgress | null;
}): CertificateEligibility {
  const requirements: CertificateRequirementStatus[] = [
    {
      id: "lessons-complete",
      label: "Complete all published Module 1 lessons.",
      met: lessonProgress.complete,
    },
    {
      id: "knowledge-check-passed",
      label: "Pass the Module 1 knowledge check.",
      met: quizProgress?.passed === true,
    },
    {
      id: "limitations-reviewed",
      label:
        "Review certificate limitations and supervised practice expectations.",
      met: true,
    },
  ];

  return {
    eligible: requirements.every(requirement => requirement.met),
    learnerEmail: learnerEmail.trim().toLowerCase(),
    moduleId,
    certificateTitle: certificatePreview.title,
    certificateSubtitle: certificatePreview.subtitle,
    completionStatement: certificatePreview.completionStatement,
    limitationStatement: certificatePreview.limitationStatement,
    requirements,
  };
}
