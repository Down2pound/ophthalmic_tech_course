import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { careerToolkit } from "@shared/career/careerToolkit";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ClipboardList,
  MessageSquareText,
  Printer,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const sectionIcons: Record<string, LucideIcon> = {
  resume: ClipboardList,
  interview: MessageSquareText,
  "job-search": Search,
  "scope-language": ShieldCheck,
};

export default function CareerToolkit() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white print:border-b-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/learn"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to learner dashboard
            </a>
            <div className="mt-5 flex items-center gap-3">
              <BriefcaseBusiness className="h-8 w-8 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  OptiTech Academy
                </p>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {careerToolkit.title}
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-slate-600">
              {careerToolkit.subtitle}
            </p>
          </div>
          <Button
            className="w-full bg-blue-700 text-white hover:bg-blue-800 md:w-auto print:hidden"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print toolkit
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-8 print:px-0">
        {careerToolkit.sections.map((section) => {
          const Icon = sectionIcons[section.id] ?? ClipboardList;

          return (
            <Card
              key={section.id}
              className="break-inside-avoid border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-blue-50 p-3 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="mt-2 leading-7 text-slate-600">
                    {section.summary}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <section>
                  <h3 className="font-semibold">Action checklist</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {section.actionItems.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold">Sample language</h3>
                  <div className="mt-3 space-y-3">
                    {section.sampleLanguage.map((sample) => (
                      <p
                        key={sample}
                        className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700"
                      >
                        {sample}
                      </p>
                    ))}
                  </div>
                </section>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
