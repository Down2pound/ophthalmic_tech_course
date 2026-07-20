import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useMemo, useState } from "react";

export default function EnrollmentSuccess() {
  const sessionId = useMemo(
    () => new URLSearchParams(window.location.search).get("session_id") ?? "",
    [],
  );
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activateAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!sessionId) {
      setError("The Stripe Checkout session is missing. Please use the payment confirmation link.");
      return;
    }
    if (password.length < 10) {
      setError("Your password must contain at least 10 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("/api/enrollment/complete", {
        method: "POST",
        body: JSON.stringify({ sessionId, password }),
      });
      window.location.assign("/course");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to activate your account.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <Card className="w-full border-blue-500/40 bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-green-500" />
            <h1 className="mb-3 text-4xl font-bold text-slate-900">Payment Confirmed</h1>
            <p className="text-lg text-slate-600">
              Create your secure OptiTech Academy password to begin the course now.
            </p>
          </div>

          <form onSubmit={activateAccount} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
                minLength={10}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="At least 10 characters"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                required
                minLength={10}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter the same password again"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !sessionId}
              className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activating Course Access
                </>
              ) : (
                <>
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Create Account and Start Course
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already activated this purchase? <a href="/login" className="font-semibold text-blue-600 hover:underline">Sign in</a>.
          </p>
        </Card>
      </div>
    </div>
  );
}
