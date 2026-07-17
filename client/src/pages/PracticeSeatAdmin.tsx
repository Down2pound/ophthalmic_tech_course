import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  assignPracticeSeat,
  fetchPracticeInquiries,
  fetchPracticeSeatPacks,
  lookupBuyerSupportProfile,
  revokeAccessTarget,
  type BuyerSupportProfile,
  type LearnerInterestSummary,
  type PracticeInquirySummary,
  type PracticeSeatAssignmentSummary,
  type PracticeSeatPackSummary,
} from "@/lib/practiceSeatAdminClient";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildLearnerLeadCsv,
  buildPracticeLeadCsv,
  downloadCsvFile,
} from "@/lib/leadCsvExport";

interface PageState {
  seatPacks: PracticeSeatPackSummary[];
  assignments: PracticeSeatAssignmentSummary[];
  inquiries: PracticeInquirySummary[];
  learnerInterests: LearnerInterestSummary[];
}

function getRemainingSeats(seatPack: PracticeSeatPackSummary) {
  return Math.max(seatPack.totalSeats - seatPack.assignedSeats, 0);
}

export default function PracticeSeatAdmin() {
  const [adminToken, setAdminToken] = useState("");
  const [supportLookupEmail, setSupportLookupEmail] = useState("");
  const [revocationTargetType, setRevocationTargetType] = useState<
    "enrollment" | "practice-seat-assignment" | "practice-seat-pack"
  >("enrollment");
  const [revocationTargetId, setRevocationTargetId] = useState("");
  const [supportProfile, setSupportProfile] =
    useState<BuyerSupportProfile | null>(null);
  const [learnerEmailBySeatPackId, setLearnerEmailBySeatPackId] = useState<
    Record<string, string>
  >({});
  const [pageState, setPageState] = useState<PageState>({
    seatPacks: [],
    assignments: [],
    inquiries: [],
    learnerInterests: [],
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
      const [seatPackResult, inquiryResult] = await Promise.all([
        fetchPracticeSeatPacks({
          adminToken: adminToken.trim(),
        }),
        fetchPracticeInquiries({
          adminToken: adminToken.trim(),
        }),
      ]);
      setPageState({
        ...seatPackResult,
        inquiries: inquiryResult.inquiries,
        learnerInterests: inquiryResult.learnerInterests,
      });
      setStatusMessage("Practice sales dashboard loaded.");
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

  const lookupSupportProfile = async () => {
    setLoadingAction("support-lookup");
    setErrorMessage(null);
    setStatusMessage(null);
    setSupportProfile(null);

    try {
      const result = await lookupBuyerSupportProfile({
        adminToken: adminToken.trim(),
        email: supportLookupEmail,
      });

      setSupportProfile(result);
      setStatusMessage(`Support profile loaded for ${result.email}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Buyer support profile could not be loaded."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const revokeAccess = async () => {
    setLoadingAction("access-revocation");
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const trimmedTargetId = revocationTargetId.trim();
      const result = await revokeAccessTarget({
        adminToken: adminToken.trim(),
        target:
          revocationTargetType === "enrollment"
            ? { type: revocationTargetType, enrollmentId: trimmedTargetId }
            : revocationTargetType === "practice-seat-assignment"
              ? { type: revocationTargetType, assignmentId: trimmedTargetId }
              : { type: revocationTargetType, seatPackId: trimmedTargetId },
      });

      setStatusMessage(result.message);
      setRevocationTargetId("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Access revocation could not be completed."
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

  const exportPracticeLeads = () => {
    downloadCsvFile({
      filename: "optitech-practice-leads.csv",
      csv: buildPracticeLeadCsv(pageState.inquiries),
    });
  };

  const exportLearnerLeads = () => {
    downloadCsvFile({
      filename: "optitech-learner-leads.csv",
      csv: buildLearnerLeadCsv(pageState.learnerInterests),
    });
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

            <div className="mt-6 border-t border-slate-200 pt-5">
              <h3 className="font-semibold">Buyer support lookup</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use this when a learner or manager asks about access, seats, or
                checkout status.
              </p>
              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Buyer or learner email
              </label>
              <input
                type="email"
                value={supportLookupEmail}
                onChange={event => setSupportLookupEmail(event.target.value)}
                placeholder="learner@example.com"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
              />
              <Button
                className="mt-3 w-full bg-slate-900 text-white hover:bg-slate-800"
                disabled={
                  loadingAction === "support-lookup" ||
                  adminToken.trim() === "" ||
                  supportLookupEmail.trim() === ""
                }
                onClick={lookupSupportProfile}
              >
                {loadingAction === "support-lookup"
                  ? "Looking up..."
                  : "Lookup buyer"}
              </Button>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <h3 className="font-semibold">Access revocation</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use only after a refund, mistaken assignment, or documented
                support correction. Handle money in Stripe first.
              </p>
              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Target type
              </label>
              <select
                value={revocationTargetType}
                onChange={event =>
                  setRevocationTargetType(
                    event.target.value as
                      | "enrollment"
                      | "practice-seat-assignment"
                      | "practice-seat-pack"
                  )
                }
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
              >
                <option value="enrollment">Enrollment</option>
                <option value="practice-seat-assignment">
                  Practice seat assignment
                </option>
                <option value="practice-seat-pack">Practice seat pack</option>
              </select>
              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Target ID
              </label>
              <input
                value={revocationTargetId}
                onChange={event => setRevocationTargetId(event.target.value)}
                placeholder="Paste exact ID from support lookup"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
              />
              <Button
                className="mt-3 w-full bg-red-700 text-white hover:bg-red-800"
                disabled={
                  loadingAction === "access-revocation" ||
                  adminToken.trim() === "" ||
                  revocationTargetId.trim() === ""
                }
                onClick={revokeAccess}
              >
                {loadingAction === "access-revocation"
                  ? "Revoking..."
                  : "Revoke access"}
              </Button>
            </div>
          </Card>
        </aside>

        <section className="space-y-5">
          {supportProfile && (
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    Buyer support
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {supportProfile.email}
                  </h2>
                </div>
                <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-950">
                  {supportProfile.summary.hasActiveEnrollment
                    ? "Active access"
                    : "No active access"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-5">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Purchases
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {supportProfile.purchases.length}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Enrollments
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {supportProfile.enrollments.length}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Seat packs
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {supportProfile.practiceSeatPacks.length}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Assignments
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {supportProfile.practiceSeatAssignments.length}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Seats left
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {supportProfile.summary.remainingPracticeSeats}
                  </p>
                </div>
              </div>

              <section className="mt-5">
                <h3 className="font-semibold">Recommended support actions</h3>
                <ul className="mt-3 space-y-2">
                  {supportProfile.recommendedActions.map(action => (
                    <li
                      key={action}
                      className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950"
                    >
                      {action}
                    </li>
                  ))}
                </ul>
              </section>
            </Card>
          )}

          {pageState.seatPacks.length === 0 ? (
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold">No seat packs loaded</h2>
              </div>
              <p className="mt-3 leading-7 text-slate-600">
                Load protected seat packs after a Stripe practice-pack purchase
                has completed, or review custom practice inquiries before a
                purchase conversation.
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

          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold">Custom practice leads</h2>
              </div>
              {pageState.inquiries.length > 0 && (
                <Button
                  className="w-full border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 md:w-auto"
                  onClick={exportPracticeLeads}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
            <p className="mt-3 leading-7 text-slate-600">
              These are larger-practice or custom setup inquiries from the
              practice-pack page. Use the priority and talking points to follow
              up quickly.
            </p>
            {pageState.inquiries.length === 0 ? (
              <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No custom practice inquiries loaded yet.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {pageState.inquiries.map(inquiry => (
                  <section
                    key={inquiry.inquiryId}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-700">
                          {inquiry.followUpPlan.priority.toUpperCase()} lead
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          {inquiry.practiceName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {inquiry.contactName} - {inquiry.contactEmail}
                        </p>
                      </div>
                      <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-950">
                        {inquiry.estimatedLearnerCount ?? "Unknown"} learners
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold text-slate-500">
                          Recommended offer
                        </p>
                        <p className="mt-1 font-semibold">
                          {inquiry.followUpPlan.recommendedOffer}
                        </p>
                      </div>
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <p className="text-xs font-semibold text-slate-500">
                          Timeline
                        </p>
                        <p className="mt-1 font-semibold">
                          {inquiry.targetTimeline}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
                      {inquiry.followUpPlan.nextAction}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {inquiry.followUpPlan.talkingPoints.map(point => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {inquiry.message}
                    </p>
                  </section>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-700" />
                <h2 className="text-2xl font-bold">Individual learner leads</h2>
              </div>
              {pageState.learnerInterests.length > 0 && (
                <Button
                  className="w-full border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 md:w-auto"
                  onClick={exportLearnerLeads}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              )}
            </div>
            <p className="mt-3 leading-7 text-slate-600">
              These are learners who are interested before checkout, before
              launch gates are complete, or before they are ready to purchase.
            </p>
            {pageState.learnerInterests.length === 0 ? (
              <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                No learner interest leads loaded yet.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {pageState.learnerInterests.map(interest => (
                  <section
                    key={interest.interestId}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-blue-700">
                      {interest.background}
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      {interest.learnerName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {interest.email}
                    </p>
                    <p className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-950">
                      Recommended next step: send the learner decision one-pager
                      and invite founding access when paid enrollment opens.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {interest.goal}
                    </p>
                  </section>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
