import { Button } from "@/components/ui/button";
import { fetchActiveAlertTemplates } from "@/lib/alertTemplatesClient";
import type { AlertTemplate } from "@shared/alerts/alertTemplates";
import { Bell, RefreshCw, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const urgencyStyles: Record<AlertTemplate["urgency"], string> = {
  low: "border-slate-300/20 bg-slate-700/50",
  normal: "border-cyan-300/25 bg-cyan-500/15",
  high: "border-amber-300/35 bg-amber-500/15",
  urgent: "border-red-300/40 bg-red-500/20",
};

export default function SendAlerts() {
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);
  const [status, setStatus] = useState("Loading alert buttons...");
  const [lastSent, setLastSent] = useState<AlertTemplate | null>(null);

  useEffect(() => {
    void loadTemplates();

    const events = new EventSource("/api/alert-templates/events");
    events.addEventListener("templatesUpdated", () => {
      void loadTemplates("Button list refreshed.");
    });
    events.onerror = () => {
      events.close();
    };

    return () => events.close();
  }, []);

  async function loadTemplates(nextStatus = "Ready.") {
    try {
      const loaded = await fetchActiveAlertTemplates();
      setTemplates(loaded);
      setStatus(nextStatus);
    } catch {
      setStatus("Could not load alert buttons.");
    }
  }

  function sendAlert(template: AlertTemplate) {
    setLastSent(template);
    setStatus(`Sent: ${template.message}`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Send Alert</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Choose an active alert button. Admins can change these buttons in
              settings without editing code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => void loadTemplates("Button list refreshed.")}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            <a href="/admin">
              <Button type="button">
                <Settings className="size-4" />
                Admin
              </Button>
            </a>
          </div>
        </div>
      </header>

      <section className="container py-6">
        <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <Bell className="size-5 text-cyan-200" />
            <p className="text-sm text-slate-200">{status}</p>
          </div>
          {lastSent ? (
            <p className="mt-2 text-sm text-slate-400">
              Last alert: {lastSent.label} to {lastSent.room || "clinic"}.
            </p>
          ) : null}
        </div>

        {templates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/20 p-10 text-center text-slate-300">
            No active alert buttons are available.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => sendAlert(template)}
                className={`min-h-40 rounded-lg border p-5 text-left shadow-lg transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${urgencyStyles[template.urgency]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">{template.label}</h2>
                  <span className="rounded-md bg-black/25 px-2 py-1 text-xs uppercase tracking-normal text-slate-200">
                    {template.urgency}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-200">
                  {template.message}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-md bg-black/20 px-2 py-1">
                    {template.category}
                  </span>
                  {template.room ? (
                    <span className="rounded-md bg-black/20 px-2 py-1">
                      {template.room}
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
