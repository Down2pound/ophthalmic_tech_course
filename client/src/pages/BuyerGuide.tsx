import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buyerDecisionGuides } from "@shared/commerce/buyerDecisionGuide";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

const guideIcons = {
  "individual-learner": GraduationCap,
  "practice-manager": Building2,
};

export default function BuyerGuide() {
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
          <div className="mt-6 flex items-start gap-3">
            <HelpCircle className="mt-1 h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Buyer decision guide
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Decide whether OptiTech Academy fits your goal
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Use this page before buying or before asking a manager to
                approve seats. It keeps the offer helpful without pretending the
                course is certification or hands-on competency signoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {buyerDecisionGuides.map(guide => {
          const GuideIcon = guideIcons[guide.id];

          return (
            <Card
              key={guide.id}
              className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <section>
                  <div className="flex items-start gap-3">
                    <GuideIcon className="mt-1 h-7 w-7 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {guide.subtitle}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">{guide.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-slate-700">
                    {guide.summary}
                  </p>
                  <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
                    {guide.priceSummary}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <section className="rounded-md border border-green-200 bg-green-50 p-4">
                      <h3 className="font-semibold text-green-950">
                        Good fit if
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-green-950">
                        {guide.goodFit.map(item => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
                      <h3 className="flex items-center gap-2 font-semibold text-amber-950">
                        <ShieldCheck className="h-4 w-4" />
                        Not a fit if you need
                      </h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
                        {guide.notFit.map(item => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <section className="mt-6">
                    <h3 className="text-xl font-bold">What you get</h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {guide.gets.map(item => (
                        <div
                          key={item.included}
                          className="rounded-md border border-slate-200 bg-slate-50 p-4"
                        >
                          <h4 className="font-semibold">{item.included}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.whyItHelps}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </section>

                <aside className="space-y-4">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold">Ask before buying</h3>
                    <div className="mt-3 space-y-3">
                      {guide.decisionPrompts.map(prompt => (
                        <section
                          key={prompt.question}
                          className="rounded-md border border-slate-200 bg-white p-3"
                        >
                          <p className="text-sm font-semibold">
                            {prompt.question}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-slate-600">
                            {prompt.whyItMatters}
                          </p>
                        </section>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-blue-950">
                    <h3 className="font-semibold">Safe message to share</h3>
                    <p className="mt-3 text-sm leading-6">
                      {guide.safeShareMessage}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <a href={guide.primaryCta.href}>
                      <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                        {guide.primaryCta.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                    <a href={guide.secondaryCta.href}>
                      <Button className="w-full" variant="outline">
                        {guide.secondaryCta.label}
                      </Button>
                    </a>
                  </div>
                </aside>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
