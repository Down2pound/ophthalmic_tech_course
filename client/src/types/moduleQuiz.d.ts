import type { QuizData } from "@/components/ModuleQuiz";

declare module "@/components/ModuleQuiz" {
  export interface ModuleQuiz extends QuizData {}
}
