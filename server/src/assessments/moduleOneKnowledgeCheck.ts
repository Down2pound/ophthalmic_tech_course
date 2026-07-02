interface KnowledgeCheckQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options?: string[];
  correctAnswer: string;
}

export interface PublicKnowledgeCheckQuestion
  extends Omit<KnowledgeCheckQuestion, "correctAnswer"> {}

export interface PublicKnowledgeCheck {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  passingScore: number;
  questions: PublicKnowledgeCheckQuestion[];
}

export interface SubmittedKnowledgeCheckAnswer {
  questionId: string;
  answer: string;
}

export interface ScoreKnowledgeCheckInput {
  learnerEmail: string;
  submittedAt?: string;
  answers: SubmittedKnowledgeCheckAnswer[];
}

export interface KnowledgeCheckScore {
  quizId: string;
  learnerEmail: string;
  submittedAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
  }>;
}

const moduleOneKnowledgeCheck = {
  id: "quiz-entering-ophthalmic-care",
  title: "Module 1: Entering Ophthalmic Care",
  description:
    "Check your understanding of clinic roles, privacy, scope, and escalation.",
  moduleId: "entering-ophthalmic-care",
  passingScore: 80,
  questions: [
    {
      id: "m1-q1",
      question: "A new ophthalmic technician should describe their role as:",
      type: "multiple-choice",
      options: [
        "The person who diagnoses the eye problem",
        "A clinical team member who gathers accurate information and performs starting tests",
        "The person who decides whether surgery is needed",
        "A billing specialist who schedules follow-up care",
      ],
      correctAnswer:
        "A clinical team member who gathers accurate information and performs starting tests",
    },
    {
      id: "m1-q2",
      question:
        "If a patient asks whether their symptoms mean they have glaucoma, the safest beginner response is:",
      type: "multiple-choice",
      options: [
        "Yes, because blurry vision usually means glaucoma",
        "No, glaucoma never causes blurry vision",
        "That is a diagnosis question for the provider, and I will make sure they know your concern",
        "Search the internet with the patient",
      ],
      correctAnswer:
        "That is a diagnosis question for the provider, and I will make sure they know your concern",
    },
    {
      id: "m1-q3",
      question:
        "Privacy means patient details should be discussed only with care team members who need the information for care.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: "True",
    },
    {
      id: "m1-q4",
      question: "Which situation should be escalated promptly?",
      type: "multiple-choice",
      options: [
        "A patient asks where the restroom is",
        "A patient reports sudden new flashes and floaters",
        "A patient asks for a printed appointment reminder",
        "A patient says the waiting room is cold",
      ],
      correctAnswer: "A patient reports sudden new flashes and floaters",
    },
  ] satisfies KnowledgeCheckQuestion[],
};

export function getModuleOneKnowledgeCheck(): PublicKnowledgeCheck {
  return {
    id: moduleOneKnowledgeCheck.id,
    title: moduleOneKnowledgeCheck.title,
    description: moduleOneKnowledgeCheck.description,
    moduleId: moduleOneKnowledgeCheck.moduleId,
    passingScore: moduleOneKnowledgeCheck.passingScore,
    questions: moduleOneKnowledgeCheck.questions.map(
      ({ correctAnswer: _correctAnswer, ...question }) => question
    ),
  };
}

export function scoreModuleOneKnowledgeCheck({
  learnerEmail,
  submittedAt = new Date().toISOString(),
  answers,
}: ScoreKnowledgeCheckInput): KnowledgeCheckScore {
  const answerByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.answer])
  );
  const results = moduleOneKnowledgeCheck.questions.map((question) => ({
    questionId: question.id,
    isCorrect: answerByQuestionId.get(question.id) === question.correctAnswer,
  }));
  const correctCount = results.filter((result) => result.isCorrect).length;
  const totalQuestions = moduleOneKnowledgeCheck.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    quizId: moduleOneKnowledgeCheck.id,
    learnerEmail: learnerEmail.trim().toLowerCase(),
    submittedAt,
    score,
    correctCount,
    totalQuestions,
    passed: score >= moduleOneKnowledgeCheck.passingScore,
    passingScore: moduleOneKnowledgeCheck.passingScore,
    results,
  };
}
