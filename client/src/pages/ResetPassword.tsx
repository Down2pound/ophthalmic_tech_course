import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, Eye, Loader2, LockKeyhole } from "lucide-react";
import { useMemo, useState } from "react";

export default function ResetPassword() {
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!token) return setError("This reset link is missing its security token.");
    if (password.length < 10) return setError("Password must contain at least 10 characters.");
    if (password !== confirmation) return setError("The passwords do not match.");
    setLoading(true);
    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      window.location.assign("/course");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset the password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
      <Card className="mx-auto w-full max-w-md bg-white p-8 shadow-2xl">
        <div className="text-center"><Eye className="mx-auto h-12 w-12 text-blue-600" /><h1 className="mt-4 text-3xl font-bold text-slate-900">Choose a new password</h1><p className="mt-2 text-slate-600">Use at least 10 characters and keep it unique to this account.</p></div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">New Password
            <input required minLength={10} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Confirm Password
            <input required minLength={10} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
          </label>
          {error && <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-shrink-0" />{error}</div>}
          <Button disabled={loading || !token} className="w-full bg-blue-600 py-6 text-white">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />} Save New Password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm"><a href="/forgot-password" className="font-semibold text-blue-600 hover:underline">Request another reset link</a></p>
      </Card>
    </div>
  );
}
