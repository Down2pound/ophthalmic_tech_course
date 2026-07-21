import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, CheckCircle2, Eye, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface PurchaseSummary {
  email: string;
  firstName: string;
  lastName: string;
  enrollmentType: "individual" | "practice";
  organizationName?: string;
  seats: number;
}

export default function ActivateEnrollment() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);
  const [purchase, setPurchase] = useState<PurchaseSummary | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("This activation link is missing its security token.");
      setLoading(false);
      return;
    }
    apiRequest<{ purchase: PurchaseSummary }>(`/api/enrollment/activation?token=${encodeURIComponent(token)}`)
      .then((response) => setPurchase(response.purchase))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to verify this activation link."))
      .finally(() => setLoading(false));
  }, [token]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 10) return setError("Password must contain at least 10 characters.");
    if (password !== confirmation) return setError("The passwords do not match.");
    setSubmitting(true);
    try {
      await apiRequest("/api/enrollment/activate", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      window.location.assign("/course");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to activate course access.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
      <Card className="mx-auto w-full max-w-lg bg-white p-8 shadow-2xl">
        {loading ? (
          <div className="py-12 text-center text-slate-600"><Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />Verifying your paid enrollment...</div>
        ) : purchase ? (
          <>
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Activate your course</h1>
              <p className="mt-2 text-slate-600">Payment verified for {purchase.email}.</p>
              {purchase.enrollmentType === "practice" && <p className="mt-1 text-sm text-slate-500">Practice enrollment: {purchase.seats} seats{purchase.organizationName ? ` for ${purchase.organizationName}` : ""}</p>}
            </div>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Create Password
                <input required minLength={10} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">Confirm Password
                <input required minLength={10} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
              </label>
              {error && <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-shrink-0" />{error}</div>}
              <Button disabled={submitting} className="w-full bg-blue-600 py-6 text-white">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />} Create Account and Start Course
              </Button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <Eye className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Activation unavailable</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <a href="/support"><Button className="mt-6 bg-blue-600 text-white">Contact Support</Button></a>
          </div>
        )}
      </Card>
    </div>
  );
}
