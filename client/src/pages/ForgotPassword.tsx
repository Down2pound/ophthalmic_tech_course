import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, CheckCircle2, Eye, Loader2, Mail } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/api/auth/request-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to request a reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
      <Card className="mx-auto w-full max-w-md bg-white p-8 shadow-2xl">
        <div className="text-center">
          {sent ? <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" /> : <Eye className="mx-auto h-12 w-12 text-blue-600" />}
          <h1 className="mt-4 text-3xl font-bold text-slate-900">{sent ? "Check your email" : "Reset your password"}</h1>
          <p className="mt-2 text-slate-600">{sent ? "If an account exists for that email, a one-hour reset link has been sent." : "Enter the email connected to your course account."}</p>
        </div>
        {!sent && (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">Email Address
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
            </label>
            {error && <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-shrink-0" />{error}</div>}
            <Button disabled={loading} className="w-full bg-blue-600 py-6 text-white">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />} Send Reset Link
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm"><a href="/login" className="font-semibold text-blue-600 hover:underline">Return to sign in</a></p>
      </Card>
    </div>
  );
}
