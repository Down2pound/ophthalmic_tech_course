import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  day: number;
  passingScore: number;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
}

interface ModuleQuizProps {
  quiz: QuizData;
  onComplete?: (score: number, passed: boolean) => void;
  isPreview?: boolean;
}

interface UserAnswer {
  questionId: string;
  answer: string | string[];
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({
  quiz,
  onComplete,
  isPreview = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanations, setShowExplanations] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answer: string) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (ua) => ua.questionId === currentQuestion.id
    );

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer,
    };

    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
      setUserAnswers(updatedAnswers);
    } else {
      setUserAnswers([...userAnswers, newAnswer]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);
      if (userAnswer) {
        const isCorrect = checkAnswer(question, userAnswer.answer);
        if (isCorrect) {
          correctCount++;
        }
      }
    });

    const calculatedScore = (correctCount / totalQuestions) * 100;
    setScore(calculatedScore);
    setQuizCompleted(true);
    setShowExplanations(true);

    if (onComplete) {
      const passed = calculatedScore >= quiz.passingScore;
      onComplete(calculatedScore, passed);
    }
  };

  const checkAnswer = (question: QuizQuestion, userAnswer: string | string[]): boolean => {
    if (Array.isArray(question.correctAnswer)) {
      return Array.isArray(userAnswer) &&
        userAnswer.length === question.correctAnswer.length &&
        question.correctAnswer.every((ans) => userAnswer.includes(ans));
    }
    return userAnswer === question.correctAnswer;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setShowExplanations(false);
  };

  const getUserAnswer = (questionId: string): string | string[] | undefined => {
    const answer = userAnswers.find((ua) => ua.questionId === questionId);
    return answer?.answer;
  };

  const isAnswerCorrect = (question: QuizQuestion): boolean => {
    const userAnswer = getUserAnswer(question.id);
    if (userAnswer === undefined) return false;
    return checkAnswer(question, userAnswer);
  };

  // Quiz Completed View
  if (quizCompleted) {
    const passed = score >= quiz.passingScore;
    const correctCount = Math.round((score / 100) * totalQuestions);

    return (
      <Card className="w-full p-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center mb-8">
          {passed ? (
            <div className="mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Quiz Passed! 🎉
              </h2>
            </div>
          ) : (
            <div className="mb-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-red-700 mb-2">
                Quiz Incomplete
              </h2>
            </div>
          )}

          <div className="mb-6">
            <p className="text-5xl font-bold text-blue-600">{score.toFixed(1)}%</p>
            <p className="text-gray-600 mt-2">
              {correctCount} out of {totalQuestions} questions correct
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Passing score: {quiz.passingScore}%
            </p>
          </div>
        </div>

        {/* Review Answers */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
          <div className="space-y-4">
            {quiz.questions.map((question, idx) => {
              const userAnswer = getUserAnswer(question.id);
              const isCorrect = isAnswerCorrect(question);

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Question {idx + 1}: {question.question}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer: <span className="font-medium">{userAnswer}</span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer:{" "}
                          <span className="font-medium">
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : question.correctAnswer}
                          </span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          📝 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={resetQuiz}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
          {passed && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Continue to Next Module
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Quiz In Progress View
  return (
    <Card className="w-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
        <p className="text-gray-600 mb-4">{quiz.description}</p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>

        {/* Answer Options */}
        {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={getUserAnswer(currentQuestion.id) === option}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "true-false" && (
          <div className="space-y-3">
            {["True", "False"].map((option) => (
              <label
                key={option}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={getUserAnswer(currentQuestion.id) === option}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "short-answer" && (
          <input
            type="text"
            value={(getUserAnswer(currentQuestion.id) as string) || ""}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        <div className="flex-1" />

        <Button
          onClick={handleNext}
          disabled={
            getUserAnswer(currentQuestion.id) === undefined &&
            !isPreview
          }
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </Card>
  );
};

export default ModuleQuiz;
