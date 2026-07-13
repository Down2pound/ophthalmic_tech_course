import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fetchModuleOneCertificateEligibility,
  type CertificateEligibility,
} from "@/lib/certificateEligibilityClient";
import {
  certificatePreview,
  getCertificateDisplayName,
} from "@shared/certificate/certificate";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Printer,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function CertificatePreview() {
  const [learnerName, setLearnerName] = useState("");
  const [eligibility, setEligibility] = useState<CertificateEligibility | null>(
    null
  );
  const [eligibilityError, setEligibilityError] = useState("");
  const displayName = getCertificateDisplayName(learnerName);
  const requirements =
    eligibility?.requirements ??
    certificatePreview.requirements.map(requirement => ({
      id: requirement,
      label: requirement,
      met: false,
    }));

  useEffect(() => {
    let active = true;

    fetchModuleOneCertificateEligibility()
      .then(payload => {
        if (!active) return;
        setEligibility(payload);
      })
      .catch(error => {
        if (!active) return;
        setEligibilityError(
          error instanceof Error
            ? error.message
            : "Certificate eligibility is unavailable right now."
        );
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/learn"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to learner dashboard
            </a>
            <div className="mt-6 flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  OptiTech Academy
                </p>
                <h1 className="text-3xl font-bold md:text-4xl">
                  Certificate Preview
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-slate-600">
              Preview the completion language before it becomes part of the
              learner experience. The wording is intentionally careful.
            </p>
          </div>
          <Button
            className="w-full bg-blue-700 text-white hover:bg-blue-800 md:w-auto"
            onClick={() => window.print()}
            disabled={!eligibility?.eligible}
          >
            <Printer className="mr-2 h-4 w-4" />
            {eligibility?.eligible ? "Print certificate" : "Certificate locked"}
          </Button>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px] print:block print:px-0">
        <section>
          <Card className="border-slate-200 bg-white p-8 text-center text-slate-950 shadow-sm print:border-0 print:shadow-none">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700">
              <Award className="h-8 w-8" />
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-blue-700">
              {certificatePreview.subtitle}
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              {certificatePreview.title}
            </h2>
            <p className="mt-8 text-sm text-slate-600">Presented to</p>
            <p className="mt-2 border-b border-slate-300 pb-3 text-3xl font-bold">
              {displayName}
            </p>
            <p className="mx-auto mt-8 max-w-2xl leading-7 text-slate-700">
              {eligibility?.completionStatement ??
                certificatePreview.completionStatement}
            </p>
            <p className="mx-auto mt-6 max-w-2xl rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              {eligibility?.limitationStatement ??
                certificatePreview.limitationStatement}
            </p>
          </Card>
        </section>

        <aside className="space-y-4 print:hidden">
          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <label
              htmlFor="certificate-name"
              className="text-sm font-semibold text-slate-700"
            >
              Preview learner name
            </label>
            <input
              id="certificate-name"
              value={learnerName}
              onChange={event => setLearnerName(event.target.value)}
              placeholder="Learner Name"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
            />
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h3 className="font-semibold">Completion requirements</h3>
            {eligibilityError && (
              <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                {eligibilityError}
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {requirements.map(requirement => (
                <li
                  key={requirement.id}
                  className="flex gap-2 text-sm text-slate-700"
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                      requirement.met ? "text-green-600" : "text-slate-300"
                    }`}
                  />
                  <span>{requirement.label}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <div className="flex gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-amber-700" />
              <p className="text-sm leading-6">
                Keep this language intact until legal, clinical, and business
                review approve a different certificate wording.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
