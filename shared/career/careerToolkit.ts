export type CareerToolkitSectionId =
  | "resume"
  | "interview"
  | "job-search"
  | "scope-language";

export interface CareerToolkitSection {
  id: CareerToolkitSectionId;
  title: string;
  summary: string;
  actionItems: string[];
  sampleLanguage: string[];
}

export interface CareerToolkit {
  title: string;
  subtitle: string;
  sections: CareerToolkitSection[];
}

export const careerToolkit: CareerToolkit = {
  title: "Career Launch Toolkit",
  subtitle:
    "Practical language and checklists for learners preparing for entry-level ophthalmic assistant or technician opportunities.",
  sections: [
    {
      id: "resume",
      title: "Resume Builder",
      summary:
        "Translate course progress into honest resume language that shows preparation without overstating credentials.",
      actionItems: [
        "List published modules completed and the date of completion.",
        "Mention Skills Passport practice items as supervised practice preparation unless a supervisor has verified them.",
        "Include patient service, medical assisting, optical, administrative, or customer-facing experience.",
        "Keep certification language separate from course completion language.",
      ],
      sampleLanguage: [
        "Completed OptiTech Academy ophthalmic technician foundations coursework covering clinic roles, anatomy, terminology, patient communication, and introductory testing workflows.",
        "Prepared for supervised ophthalmic technician practice using a Skills Passport with observable criteria and safety-critical reminders.",
      ],
    },
    {
      id: "interview",
      title: "Interview Preparation",
      summary:
        "Use interviews to show reliability, teachability, patient-centered communication, and awareness of clinical scope.",
      actionItems: [
        "Prepare a short story about learning a new clinical or technical skill.",
        "Practice explaining how you handle uncertainty: pause, clarify, document, and escalate.",
        "Bring examples of patient service, teamwork, and attention to detail.",
        "Ask how the practice trains new technicians and verifies hands-on skills.",
      ],
      sampleLanguage: [
        "I am building a foundation through online coursework and I understand that hands-on skills need supervised practice before they are verified.",
        "When I am unsure, I would rather clarify with the provider or lead technician than guess and risk patient safety.",
      ],
    },
    {
      id: "job-search",
      title: "Job Search Plan",
      summary:
        "Focus applications on practices that train entry-level learners and clearly explain your current stage of readiness.",
      actionItems: [
        "Search for ophthalmic assistant, ophthalmic technician trainee, optometric technician, and medical assistant ophthalmology roles.",
        "Track each application, contact person, follow-up date, and required experience.",
        "Use the Skills Passport as a conversation tool, not as proof of independent competency.",
        "Look for practices that mention structured onboarding, mentorship, or certification support.",
      ],
      sampleLanguage: [
        "I am looking for an entry-level ophthalmic role where I can combine course completion with supervised clinical training.",
        "I am especially interested in practices that support structured onboarding and clear feedback for new technicians.",
      ],
    },
    {
      id: "scope-language",
      title: "Honest Scope Language",
      summary:
        "Course completion can show preparation, but it should never be described as certification, licensure, or a guarantee of employment.",
      actionItems: [
        "Say course completion when you mean online learning completion.",
        "Say supervisor verified only when a qualified supervisor directly observed the skill.",
        "Avoid claiming independent clinical competency before workplace verification.",
        "Use official certification names only when you have actually earned them.",
      ],
      sampleLanguage: [
        "I have completed foundational coursework and I am ready to keep learning under supervision.",
        "My course helped me understand ophthalmic vocabulary and clinic flow, and I know clinical skills must be practiced and verified in the workplace.",
      ],
    },
  ],
};

export function getToolkitSection(
  sectionId: CareerToolkitSectionId
): CareerToolkitSection | undefined {
  return careerToolkit.sections.find((section) => section.id === sectionId);
}
