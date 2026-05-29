/**
 * Quiz and Assessment type definitions for ophthalmic technician training program
 */

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  day: number;
  module: string;
  passingScore: number;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  maxAttempts?: number;
  status: "draft" | "published" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  day: number;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  timeSpent?: number; // in seconds
  attemptNumber: number;
  submittedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
}

export interface StudentQuizProgress {
  studentId: string;
  quizId: string;
  day: number;
  bestScore: number;
  lastAttemptScore: number;
  attemptCount: number;
  passed: boolean;
  lastAttemptDate: Date;
  firstPassedDate?: Date;
}

export const SAMPLE_QUIZ_DAY_1: Quiz = {
  id: "quiz-day-1",
  title: "Day 1: Ophthalmic Foundations Quiz",
  description: "Test your knowledge of ocular anatomy and patient communication fundamentals",
  day: 1,
  module: "Ophthalmic Foundations & Patient Communication",
  passingScore: 70,
  questions: [
    {
      id: "q1-day1",
      question: "Which part of the eye is responsible for focusing light?",
      type: "multiple-choice",
      options: ["Cornea", "Lens", "Retina", "Pupil"],
      correctAnswer: "Lens",
      explanation:
        "The lens is the transparent structure that changes shape to focus light onto the retina. The cornea also plays a role in focusing, but the lens is primarily responsible for accommodation.",
      difficulty: "easy",
    },
    {
      id: "q2-day1",
      question: "The optic nerve transmits visual information from the eye to the brain.",
      type: "true-false",
      correctAnswer: "True",
      explanation:
        "The optic nerve (cranial nerve II) carries visual signals from the retina to the visual cortex in the brain.",
      difficulty: "easy",
    },
    {
      id: "q3-day1",
      question: "What is the primary benefit of using the EMPATHY framework in patient interactions?",
      type: "multiple-choice",
      options: [
        "It reduces conversation time",
        "It builds patient trust and rapport",
        "It eliminates the need for documentation",
        "It speeds up the diagnostic process",
      ],
      correctAnswer: "It builds patient trust and rapport",
      explanation:
        "EMPATHY (Empathy, Mutuality, Partnership, Teaching, Hypothesizing, Your role) creates therapeutic relationships that improve patient satisfaction and clinical outcomes.",
      difficulty: "medium",
    },
  ],
  maxAttempts: 3,
  status: "published",
};

export const SAMPLE_QUIZ_DAY_2: Quiz = {
  id: "quiz-day-2",
  title: "Day 2: Refraction & Lensometry Quiz",
  description: "Assess your understanding of refraction principles and lensometry techniques",
  day: 2,
  module: "Refraction & Lensometry",
  passingScore: 70,
  timeLimit: 30,
  questions: [
    {
      id: "q1-day2",
      question: "Which lens notation represents a minus cylinder prescription?",
      type: "multiple-choice",
      options: ["+1.50 -0.50 x 090", "-1.50 +0.50 x 090", "-2.00 -1.50 x 180", "All of the above"],
      correctAnswer: "-2.00 -1.50 x 180",
      explanation:
        "Minus cylinder notation uses negative (minus) values for the cylinder power. This is the standard notation used in the United States.",
      difficulty: "medium",
    },
    {
      id: "q2-day2",
      question: "Lensometry is used to determine the power of a lens in a spectacle frame.",
      type: "true-false",
      correctAnswer: "True",
      explanation:
        "Lensometry (or lensmeter) is an instrument that measures the refractive power of lenses in glasses or contact lenses.",
      difficulty: "easy",
    },
  ],
  status: "published",
};
