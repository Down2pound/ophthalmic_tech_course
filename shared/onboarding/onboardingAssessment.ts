import type { CourseAudience } from "../course/types";

export type OnboardingQuestionId =
  | "experience"
  | "goal"
  | "support"
  | "confidence";

export type OnboardingAnswerId =
  | "new-to-healthcare"
  | "medical-assistant"
  | "clinic-new-hire"
  | "first-ophthalmic-role"
  | "broaden-medical-knowledge"
  | "practice-onboarding"
  | "self-paced"
  | "supervisor-guided"
  | "building-basics"
  | "comfortable-with-patients"
  | "needs-skill-verification";

export interface OnboardingAnswer {
  id: OnboardingAnswerId;
  label: string;
  pathWeights: Partial<Record<CourseAudience, number>>;
}

export interface OnboardingQuestion {
  id: OnboardingQuestionId;
  prompt: string;
  answers: OnboardingAnswer[];
}

export interface LearnerPath {
  id: CourseAudience;
  title: string;
  summary: string;
  nextSteps: string[];
}

export type OnboardingResponses = Partial<
  Record<OnboardingQuestionId, OnboardingAnswerId>
>;

export const onboardingAssessment = {
  title: "Find Your OptiTech Starting Path",
  subtitle:
    "Answer a few questions so the course can frame your first steps around your background and support system.",
  paths: [
    {
      id: "career-starter",
      title: "Career Starter",
      summary:
        "Best for learners entering healthcare or ophthalmology for the first time.",
      nextSteps: [
        "Start with Module 1 and complete every foundation lesson.",
        "Use the Career Toolkit to prepare resume and interview language.",
        "Print the Skills Passport to discuss supervised practice with a future employer.",
      ],
    },
    {
      id: "medical-assistant-bridge",
      title: "Medical Assistant Bridge",
      summary:
        "Best for healthcare workers who already understand patient care but are new to eye care.",
      nextSteps: [
        "Review Module 1 for ophthalmology-specific scope and terminology.",
        "Move carefully through anatomy, optics, testing, and imaging modules.",
        "Use prior patient-care experience in interview examples without overstating ophthalmic skill verification.",
      ],
    },
    {
      id: "practice-onboarding",
      title: "Practice Onboarding",
      summary:
        "Best for learners already hired by a clinic or training with a supervisor.",
      nextSteps: [
        "Pair each module with supervisor discussion and practice-specific workflows.",
        "Use the Skills Passport for observed practice and signoff conversations.",
        "Keep employer-specific protocols separate from the national core course.",
      ],
    },
  ] satisfies LearnerPath[],
  questions: [
    {
      id: "experience",
      prompt: "Which best describes your current background?",
      answers: [
        {
          id: "new-to-healthcare",
          label: "I am new to healthcare.",
          pathWeights: { "career-starter": 3 },
        },
        {
          id: "medical-assistant",
          label: "I have medical assistant or patient-care experience.",
          pathWeights: { "medical-assistant-bridge": 3 },
        },
        {
          id: "clinic-new-hire",
          label: "I am already starting in an eye clinic.",
          pathWeights: { "practice-onboarding": 3 },
        },
      ],
    },
    {
      id: "goal",
      prompt: "What is your main goal right now?",
      answers: [
        {
          id: "first-ophthalmic-role",
          label: "Get ready for my first ophthalmic role.",
          pathWeights: { "career-starter": 2 },
        },
        {
          id: "broaden-medical-knowledge",
          label: "Add ophthalmology knowledge to my healthcare background.",
          pathWeights: { "medical-assistant-bridge": 2 },
        },
        {
          id: "practice-onboarding",
          label: "Support onboarding inside a practice.",
          pathWeights: { "practice-onboarding": 2 },
        },
      ],
    },
    {
      id: "support",
      prompt: "What kind of support do you expect while learning?",
      answers: [
        {
          id: "self-paced",
          label: "Mostly self-paced study.",
          pathWeights: {
            "career-starter": 1,
            "medical-assistant-bridge": 1,
          },
        },
        {
          id: "supervisor-guided",
          label: "A supervisor or trainer will guide me.",
          pathWeights: { "practice-onboarding": 2 },
        },
      ],
    },
    {
      id: "confidence",
      prompt: "Where do you feel you need the most support?",
      answers: [
        {
          id: "building-basics",
          label: "Building basic vocabulary and clinic confidence.",
          pathWeights: { "career-starter": 2 },
        },
        {
          id: "comfortable-with-patients",
          label: "I am comfortable with patients but need eye-care specifics.",
          pathWeights: { "medical-assistant-bridge": 2 },
        },
        {
          id: "needs-skill-verification",
          label: "I need observed practice and skill verification.",
          pathWeights: { "practice-onboarding": 2 },
        },
      ],
    },
  ] satisfies OnboardingQuestion[],
};

export function getRecommendedLearnerPath(
  responses: OnboardingResponses
): LearnerPath {
  const scores: Record<CourseAudience, number> = {
    "career-starter": 0,
    "medical-assistant-bridge": 0,
    "practice-onboarding": 0,
  };

  for (const question of onboardingAssessment.questions) {
    const answerId = responses[question.id];
    const answer = question.answers.find((item) => item.id === answerId);
    if (!answer) continue;

    for (const [pathId, weight] of Object.entries(answer.pathWeights)) {
      scores[pathId as CourseAudience] += weight ?? 0;
    }
  }

  const [recommendedPathId] = Object.entries(scores).sort(
    (left, right) => right[1] - left[1]
  )[0] as [CourseAudience, number];

  return (
    onboardingAssessment.paths.find((path) => path.id === recommendedPathId) ??
    onboardingAssessment.paths[0]
  );
}
