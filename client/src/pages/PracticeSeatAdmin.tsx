import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  assignPracticeSeat,
  fetchPracticeSeatPacks,
  type PracticeSeatAssignmentSummary,
  type PracticeSeatPackSummary,
} from "@/lib/practiceSeatAdminClient";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PageState {
  seatPacks: PracticeSeatPackSummary[];
  assignments: PracticeSeatAssignmentSummary[];
}

function getRemainingSeats(seatPack: PracticeSeatPackSummary) {
  return Math.max(seatPack.totalSeats - seatPack.assignedSeats, 0);
}

export default function PracticeSeatAdmin() {
  const [adminToken, setAdminToken] = useState("");
  const [learnerEmailBySeatPackId, setLearnerEmailBySeatPackId] = useState<
    Record<string, string>
  >({});
  const [pageState, setPageState] = useState<PageState>({
    seatPacks: [],
    assignments: [],
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const assignmentsBySeatPackId = useMemo(() => {
    return pageState.assignments.reduce<
      Record<string, PracticeSeatAssignmentSummary[]>
    >((groups, assignment) => {
      return {
        ...groups,
        [assignment.seatPackId]: [
          ...(groups[assignment.seatPackId] ?? []),
          assignment,
        ],
      };
    }, {});
  }, [pageState.assignments]);

  const loadSeatPacks = async () => {
    setLoadingAction("load");
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await fetchPracticeSeatPacks({
        adminToken: adminToken.trim(),
      });
      setPageState(result);
      setStatusMessage("Practice seat packs loaded.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Practice seat packs could not be loaded."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const assignLearner = async (seatPackId: string) => {
    setLoadingAction(seatPackId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const result = await assignPracticeSeat({
        adminToken: adminToken.trim(),
        seatPackId,
        learnerEmail: learnerEmailBySeatPackId[seatPackId]?.trim() ?? "",
      });
      await loadSeatPacks();
      setLearnerEmailBySeatPackId(current => ({
        ...current,
        [seatPackId]: "",
      }));
      setStatusMessage(
        `${result.assignment.learnerEmail} now has course access.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Learner seat could not be assigned."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a
            href="/practice-packs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to practice packs
          </a>
          <div className="mt-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Protected manager tool
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Practice Seat Manager
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            Use this page after a practice pack purchase to assign paid learner
            seats. The token stays in this browser session and is sent only as
            an admin header.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-700" />
              <h2 className="text-xl font-bold">Admin access</h2>
            </div>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Practice seat admin token
            </label>
            <input
              type="password"
              value={adminToken}
              onChange={event => setAdminToken(event.target.value)}
              placeholder="Paste private token"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
            />
            <Button
              className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
              disabled={loadingAction === "load" || adminToken.trim() === ""}
              onClick={loadSeatPacks}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {loadingAction === "load" ? "Loading..." : "Load seat packs"}
            </Button>

            {statusMessage && (
              <p className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                {statusMessage}
              </p>
            )}
            {errorMessage && (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {errorMessage}
              </p>
            )}
          </Card>
        </aside>

        <section className="space-y-5">
          {pageState.seatPacks.length === 0 ? (
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold">No seat packs loaded</h2>
              </div>
              <p className="mt-3 leading-7 text-slate-600">
                Load protected seat packs after a Stripe practice-pack purchase
                has completed and the webhook has provisioned the pack.
              </p>
            </Card>
          ) : (
            pageState.seatPacks.map(seatPack => {
              const assignments =
                assignmentsBySeatPackId[seatPack.seatPackId] ?? [];
              const remainingSeats = getRemainingSeats(seatPack);

              return (
                <Card
                  key={seatPack.seatPackId}
                  className="border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {seatPack.offerId}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">
                        {seatPack.purchaserEmail}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        {seatPack.seatPackId}
                      </p>
                    </div>
                    <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950">
                      {remainingSeats} of {seatPack.totalSeats} seats left
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Assigned
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {seatPack.assignedSeats}
                      </p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-xl font-bold">
                        {seatPack.status}
                      </p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Access ends
                      </p>
                      <p className="mt-1 text-sm font-bold">
                        {new Date(
                          seatPack.accessExpiresAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Assign learner email
                    </label>
                    <div className="mt-2 flex flex-col gap-3 md:flex-row">
                      <input
                        type="email"
                        value={
                          learnerEmailBySeatPackId[seatPack.seatPackId] ?? ""
                        }
                        onChange={event =>
                          setLearnerEmailBySeatPackId(current => ({
                            ...current,
                            [seatPack.seatPackId]: event.target.value,
                          }))
                        }
                        placeholder="new.tech@example.com"
                        className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
                      />
                      <Button
                        className="bg-blue-700 text-white hover:bg-blue-800"
                        disabled={
                          loadingAction === seatPack.seatPackId ||
                          remainingSeats === 0
                        }
                        onClick={() => assignLearner(seatPack.seatPackId)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {loadingAction === seatPack.seatPackId
                          ? "Assigning..."
                          : "Assign seat"}
                      </Button>
                    </div>
                  </div>

                  <section className="mt-5">
                    <h3 className="font-semibold">Assigned learners</h3>
                    {assignments.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-600">
                        No learners assigned yet.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-2">
                        {assignments.map(assignment => (
                          <li
                            key={assignment.assignmentId}
                            className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">
                              {assignment.learnerEmail}
                            </span>
                            <span className="text-slate-500">
                              {assignment.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
