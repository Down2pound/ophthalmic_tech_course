import type { QuizData } from "@/components/ModuleQuiz";
import { getQuizByDay as getLegacyQuizByDay } from "@/data/quizzes";

export function getCourseQuizByDay(day: number): QuizData | undefined {
  const source = getLegacyQuizByDay(day);
  if (!source) return undefined;

  const quiz = structuredClone(source) as QuizData;

  if (day === 1) {
    const question = quiz.questions.find((item) => item.id === "q1-day1");
    if (question) {
      question.question = "Which structure provides most of the eye's refractive power?";
      question.options = ["Cornea", "Crystalline lens", "Retina", "Pupil"];
      question.correctAnswer = "Cornea";
      question.explanation =
        "The cornea provides most of the eye's refractive power. The crystalline lens fine-tunes focus and changes shape for accommodation.";
    }
  }

  if (day === 2) {
    const question = quiz.questions.find((item) => item.id === "q1-day2");
    if (question) {
      question.question = "Which prescription is written in minus-cylinder notation?";
      question.options = [
        "+1.50 -0.50 x 090",
        "-1.50 +0.50 x 090",
        "-2.00 +1.50 x 180",
        "+0.75 +0.50 x 045",
      ];
      question.correctAnswer = "+1.50 -0.50 x 090";
      question.explanation =
        "Minus-cylinder notation uses a negative cylinder value. The sphere may be positive, negative, or plano.";
    }
  }

  if (day === 3) {
    const question = quiz.questions.find((item) => item.id === "q3-day3");
    if (question) {
      question.explanation =
        "Corneal thickness and biomechanics influence applanation readings. Pachymetry provides context, but a single correction formula should not replace clinical interpretation.";
    }
  }

  if (day === 4) {
    const question = quiz.questions.find((item) => item.id === "q1-day4");
    if (question) {
      question.question = "Which systems work together during a standard slit lamp examination?";
      question.options = [
        "Binocular microscope, illumination system, and patient positioning assembly",
        "Retinoscope, lensometer, and keratometer",
        "Tonometer, pachymeter, and perimeter",
        "Camera, indirect ophthalmoscope, and trial frame",
      ];
      question.correctAnswer =
        "Binocular microscope, illumination system, and patient positioning assembly";
      question.explanation =
        "A slit lamp examination coordinates binocular observation, controlled illumination, and stable patient positioning.";
    }
  }

  return quiz;
}
