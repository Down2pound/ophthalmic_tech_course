import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  createEmptyProgress,
  getProgressPercent,
  loadProgress,
  markLessonComplete,
  saveProgress,
} from "@/lib/progressStore";
import { getCheckoutStatus } from "@/lib/checkoutStatus";
import { optiTechCourse } from "@shared/course/courseCatalog";
import { moduleOneLessons } from "@shared/course/moduleOneLessons";
import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

const storage = typeof window === "undefined" ? null : window.localStorage;

export default function Learn() {
  const [selectedLessonId, setSelectedLessonId] = useState(
    moduleOneLessons[0]?.id
  );
  const [progress, setProgress] = useState(() =>
    storage ? loadProgress(storage) : createEmptyProgress()
  );

  const selectedLesson = useMemo(
    () =>
      moduleOneLessons.find((lesson) => lesson.id === selectedLessonId) ??
      moduleOneLessons[0],
    [selectedLessonId]
  );

  const completePercent = getProgressPercent(progress, moduleOneLessons.length);
  const moduleOne = optiTechCourse.modules[0];
  const checkoutStatus =
    typeof window === "undefined"
      ? null
      : getCheckoutStatus(window.location.search);

  const completeLesson = () => {
    if (!selectedLesson || !storage) return;
    const nextProgress = markLessonComplete(progress, selectedLesson.id);
    setProgress(nextProgress);
    saveProgress(storage, nextProgress);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              OptiTech Academy
            </p>
            <h1 className="mt-2 text-3xl font-bold">{moduleOne.title}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              {moduleOne.outcome}
            </p>
          </div>
          <a href="/">
            <Button variant="outline">Back to course home</Button>
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          {checkoutStatus?.tone === "success" && (
            <Card className="border-green-200 bg-green-50 p-4 text-green-950 shadow-sm">
              <h2 className="font-semibold">{checkoutStatus.title}</h2>
              <p className="mt-2 text-sm leading-6">
                {checkoutStatus.message}
              </p>
            </Card>
          )}

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Skills Passport</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Track practice skills separately from online lesson progress.
                </p>
                <a
                  href="/skills-passport"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Open passport
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Career Toolkit</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Prepare resume language, interview answers, and job-search
                  next steps.
                </p>
                <a
                  href="/career-toolkit"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Open toolkit
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <Compass className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Starting Path</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Take the onboarding assessment to frame your learning path.
                </p>
                <a
                  href="/onboarding"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Find your path
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Module progress</span>
              <span className="text-sm text-slate-600">{completePercent}%</span>
            </div>
            <Progress className="mt-3" value={completePercent} />
          </Card>

          <Card className="overflow-hidden border-slate-200 bg-white text-slate-950 shadow-sm">
            {moduleOneLessons.map((lesson) => {
              const complete = progress.completedLessonIds.includes(lesson.id);
              const active = selectedLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  className={`flex w-full items-start gap-3 border-b px-4 py-4 text-left last:border-b-0 ${
                    active ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  {complete ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                  ) : (
                    <BookOpen className="mt-1 h-5 w-5 text-blue-700" />
                  )}
                  <span>
                    <span className="block font-semibold">{lesson.title}</span>
                    <span className="text-sm text-slate-600">
                      {lesson.durationMinutes} minutes
                    </span>
                  </span>
                </button>
              );
            })}
          </Card>
        </aside>

        {selectedLesson && (
          <article className="space-y-6">
            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">Lesson</p>
              <h2 className="mt-2 text-3xl font-bold">
                {selectedLesson.title}
              </h2>
              <p className="mt-3 text-lg text-slate-700">
                {selectedLesson.outcome}
              </p>
              <div className="mt-6 space-y-4">
                {selectedLesson.body.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="grid gap-4 border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:grid-cols-2">
              <section>
                <h3 className="font-semibold">In the clinic</h3>
                <p className="mt-2 text-slate-700">
                  {selectedLesson.clinicContext}
                </p>
              </section>
              <section>
                <h3 className="font-semibold">Patient-friendly words</h3>
                <p className="mt-2 rounded-md bg-slate-100 p-3 text-slate-700">
                  {selectedLesson.patientFriendlyScript}
                </p>
              </section>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Common mistakes to avoid</h3>
              <ul className="mt-3 space-y-2">
                {selectedLesson.commonMistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-2 text-slate-700">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Scenario practice</h3>
              <p className="mt-2 text-slate-700">
                {selectedLesson.scenarioPrompt}
              </p>
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {selectedLesson.scopeNote}
              </p>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Sources and review status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Review: {selectedLesson.review.reviewStatus}. Reviewer:{" "}
                {selectedLesson.review.clinicalReviewer}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLesson.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                  >
                    {source.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </Card>

            <Button className="w-full md:w-auto" onClick={completeLesson}>
              Mark lesson complete
            </Button>
          </article>
        )}
      </div>
    </main>
  );
}
