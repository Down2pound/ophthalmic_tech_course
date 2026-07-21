import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, CheckCircle2, Eye, Loader2, Send } from "lucide-react";
import { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/api/support", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSent(true);
      setLoading(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send your message.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="inline-flex items-center gap-2 font-bold"><Eye className="h-6 w-6 text-cyan-400" /> OptiTech Academy</a>
          <h1 className="mt-6 text-4xl font-bold">Course Support</h1>
          <p className="mt-3 text-slate-300">Questions about enrollment, billing, activation, access, or course progress.</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="p-6 shadow-lg sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Message sent</h2>
              <p className="mt-2 text-slate-600">Support has received your request. Keep your purchase email available for billing or activation questions.</p>
              <a href="/"><Button className="mt-6 bg-blue-600 text-white">Return Home</Button></a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">Name
                  <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
                </label>
                <label className="text-sm font-semibold text-slate-700">Email
                  <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">Subject
                <select required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3">
                  <option value="">Choose a topic</option>
                  <option>Enrollment or activation</option>
                  <option>Billing or refund</option>
                  <option>Password or sign in</option>
                  <option>Practice team seats</option>
                  <option>Course content</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">Message
                <textarea required minLength={10} maxLength={3000} rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Include the email used at checkout when asking about a purchase." />
              </label>
              {error && <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 flex-shrink-0" />{error}</div>}
              <Button disabled={loading} type="submit" className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Send Support Request
              </Button>
            </form>
          )}
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
