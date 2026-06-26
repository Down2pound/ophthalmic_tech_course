import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getRecommendedLearnerPath,
  onboardingAssessment,
  type OnboardingQuestionId,
  type OnboardingResponses,
} from "@shared/onboarding/onboardingAssessment";
import { ArrowLeft, ArrowRight, Compass, ListChecks } from "lucide-react";
import { useMemo, useState } from "react";

export default function OnboardingAssessment() {
  const [responses, setResponses] = useState<OnboardingResponses>({});
  const recommendation = useMemo(
    () => getRecommendedLearnerPath(responses),
    [responses]
  );
  const answeredCount = Object.keys(responses).length;
  const complete = answeredCount === onboardingAssessment.questions.length;

  const setAnswer = (
    questionId: OnboardingQuestionId,
    answerId: NonNullable<OnboardingResponses[OnboardingQuestionId]>
  ) => {
    setResponses((current) => ({ ...current, [questionId]: answerId }));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course home
          </a>
          <div className="mt-6 flex items-center gap-3">
            <Compass className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                OptiTech Academy
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                {onboardingAssessment.title}
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            {onboardingAssessment.subtitle}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          {onboardingAssessment.questions.map((question, index) => (
            <Card
              key={question.id}
              className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
            >
              <p className="text-sm font-semibold text-blue-700">
                Question {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-bold">{question.prompt}</h2>
              <div className="mt-5 grid gap-3">
                {question.answers.map((answer) => {
                  const selected = responses[question.id] === answer.id;

                  return (
                    <button
                      key={answer.id}
                      className={`rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
                        selected
                          ? "border-blue-700 bg-blue-50 text-blue-950"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => setAnswer(question.id, answer.id)}
                    >
                      {answer.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
        </section>

        <aside className="space-y-4">
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-blue-700" />
              <p className="font-semibold">
                {answeredCount}/{onboardingAssessment.questions.length} answered
              </p>
            </div>
            <h2 className="mt-5 text-2xl font-bold">{recommendation.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {recommendation.summary}
            </p>

            <div className="mt-5 space-y-3">
              {recommendation.nextSteps.map((step) => (
                <p key={step} className="text-sm leading-6 text-slate-700">
                  - {step}
                </p>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <a href="/learn">
                <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                  {complete ? "Start recommended path" : "Preview learning"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/career-toolkit">
                <Button variant="outline" className="w-full">
                  Open career toolkit
                </Button>
              </a>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
