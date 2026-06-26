import { Card } from "@/components/ui/card";
import {
  fetchRuntimeLaunchReadiness,
  type RuntimeLaunchReadinessReport,
} from "@/lib/launchReadinessClient";
import {
  getLaunchReadinessSummary,
  launchReadinessChecklist,
  type LaunchGateStatus,
} from "@shared/launch/launchReadiness";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";

const statusStyles: Record<LaunchGateStatus, string> = {
  ready: "border-green-200 bg-green-50 text-green-950",
  "in-progress": "border-blue-200 bg-blue-50 text-blue-950",
  blocked: "border-red-200 bg-red-50 text-red-950",
};

const statusIcons = {
  ready: CheckCircle2,
  "in-progress": Clock3,
  blocked: CircleAlert,
};

const runtimeStatusStyles = {
  ready: "border-green-200 bg-green-50 text-green-950",
  checking: "border-blue-200 bg-blue-50 text-blue-950",
  blocked: "border-red-200 bg-red-50 text-red-950",
};

export default function LaunchReadiness() {
  const summary = getLaunchReadinessSummary(launchReadinessChecklist);
  const [runtimeReport, setRuntimeReport] =
    useState<RuntimeLaunchReadinessReport | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchRuntimeLaunchReadiness()
      .then((report) => {
        if (!isMounted) return;
        setRuntimeReport(report);
        setRuntimeError(null);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setRuntimeError(
          error instanceof Error
            ? error.message
            : "Launch readiness is unavailable right now."
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const runtimeState = runtimeReport?.readyForPaidLaunch
    ? "ready"
    : runtimeReport || runtimeError
      ? "blocked"
      : "checking";

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
            <Rocket className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Internal launch checklist
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Commercial Launch Readiness
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            This page separates what is demo-ready from what must be finished
            before accepting real learner payments.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">
              Overall status
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {summary.ready ? "Ready to launch" : "Not ready for paid launch"}
            </h2>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border border-green-200 bg-green-50 p-3">
                <p className="text-2xl font-bold text-green-800">
                  {summary.readyCount}
                </p>
                <p className="text-xs font-semibold text-green-900">Ready</p>
              </div>
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <p className="text-2xl font-bold text-blue-800">
                  {summary.inProgressCount}
                </p>
                <p className="text-xs font-semibold text-blue-900">Working</p>
              </div>
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-2xl font-bold text-red-800">
                  {summary.blockedCount}
                </p>
                <p className="text-xs font-semibold text-red-900">Blocked</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Do not turn on real paid enrollment until blocked gates are
              resolved and the full test/build/browser QA gate passes.
            </p>
          </Card>
        </aside>

        <section className="space-y-4">
          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Live server preflight
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  Runtime commerce readiness
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  This checks the running server setup and reports missing
                  variable names without showing secret values.
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
                  runtimeStatusStyles[runtimeState]
                }`}
              >
                {runtimeState === "ready" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : runtimeState === "checking" ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )}
                {runtimeState === "ready"
                  ? "runtime ready"
                  : runtimeState === "checking"
                    ? "checking runtime"
                    : "runtime blocked"}
              </div>
            </div>

            {runtimeError && (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-950">
                {runtimeError}
              </div>
            )}

            {!runtimeReport && !runtimeError && (
              <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Checking server readiness...
              </div>
            )}

            {runtimeReport && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Stripe checkout
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {runtimeReport.commerce.checkoutConfigured
                      ? "Configured"
                      : `Missing ${runtimeReport.commerce.missingCheckoutVariables.join(", ")}`}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Stripe webhook
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {runtimeReport.commerce.webhookConfigured
                      ? "Configured"
                      : `Missing ${runtimeReport.commerce.missingWebhookVariables.join(", ")}`}
                  </p>
                </div>
                {runtimeReport.warnings.length > 0 && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-4 md:col-span-2">
                    <p className="text-sm font-semibold text-amber-950">
                      Runtime warnings
                    </p>
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-950">
                      {runtimeReport.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>

          {launchReadinessChecklist.map((item) => {
            const Icon = statusIcons[item.status];

            return (
              <Card
                key={item.id}
                className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="mt-3 leading-7 text-slate-600">
                      {item.evidence}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${statusStyles[item.status]}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.status.replace("-", " ")}
                  </div>
                </div>
                <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Next action
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.nextAction}
                  </p>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
