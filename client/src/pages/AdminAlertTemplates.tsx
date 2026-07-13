import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchAdminAlertTemplates,
  saveAdminAlertTemplates,
} from "@/lib/alertTemplatesClient";
import type { AlertTemplate, AlertUrgency } from "@shared/alerts/alertTemplates";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const urgencyOptions: AlertUrgency[] = ["low", "normal", "high", "urgent"];

export default function AdminAlertTemplates() {
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<AlertTemplate[]>([]);
  const [status, setStatus] = useState("Loading alert buttons...");
  const [isSaving, setIsSaving] = useState(false);
  const [adminToken, setAdminToken] = useState(
    () => window.localStorage.getItem("alertAdminToken") ?? ""
  );

  useEffect(() => {
    void loadTemplates();
  }, []);

  const activeCount = useMemo(
    () => templates.filter((template) => template.isActive).length,
    [templates]
  );

  async function loadTemplates() {
    try {
      const loaded = await fetchAdminAlertTemplates(adminToken);
      setTemplates(loaded);
      setSavedTemplates(loaded);
      setStatus("Changes are saved.");
    } catch {
      setStatus("Could not load alert buttons. Check your admin token.");
    }
  }

  function updateTemplate(id: string, patch: Partial<AlertTemplate>) {
    setTemplates((current) =>
      current.map((template) =>
        template.id === id ? { ...template, ...patch } : template
      )
    );
  }

  function addTemplate() {
    const now = new Date().toISOString();
    setTemplates((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        label: "New Alert Button",
        message: "Enter the message technicians should see.",
        category: "General",
        urgency: "normal",
        room: "",
        sortOrder: current.length + 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setStatus("New button added. Save when ready.");
  }

  function deleteTemplate(id: string) {
    setTemplates((current) =>
      current
        .filter((template) => template.id !== id)
        .map((template, index) => ({ ...template, sortOrder: index + 1 }))
    );
    setStatus("Button removed from this draft. Save to make it permanent.");
  }

  function moveTemplate(id: string, direction: -1 | 1) {
    setTemplates((current) => {
      const index = current.findIndex((template) => template.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [template] = next.splice(index, 1);
      next.splice(nextIndex, 0, template);
      return next.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex + 1 }));
    });
  }

  async function saveChanges() {
    setIsSaving(true);
    setStatus("Saving...");
    try {
      window.localStorage.setItem("alertAdminToken", adminToken);
      const saved = await saveAdminAlertTemplates(
        templates.map((template, index) => ({ ...template, sortOrder: index + 1 })),
        adminToken
      );
      setTemplates(saved);
      setSavedTemplates(saved);
      setStatus("Saved. Sender pages will reload their button list.");
    } catch {
      setStatus("Could not save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  function cancelChanges() {
    setTemplates(savedTemplates);
    setStatus("Draft changes canceled.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <a
              href="/send"
              className="mb-3 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
            >
              <ArrowLeft className="size-4" />
              Sender
            </a>
            <h1 className="text-3xl font-semibold tracking-normal">
              Alert Button Settings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage the buttons doctors see on the sender screen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="password"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              placeholder="Admin token"
              className="w-40 border-white/15 bg-slate-900/80 text-white"
              aria-label="Admin token"
            />
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => void loadTemplates()}
            >
              Load
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={cancelChanges}
            >
              <RotateCcw className="size-4" />
              Cancel
            </Button>
            <Button type="button" onClick={saveChanges} disabled={isSaving}>
              <Save className="size-4" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-300">
            {status} {activeCount} active button{activeCount === 1 ? "" : "s"}.
          </p>
          <Button type="button" onClick={addTemplate}>
            <Plus className="size-4" />
            Add New
          </Button>
        </div>

        <div className="space-y-4">
          {templates.map((template, index) => (
            <section
              key={template.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-cyan-400/15 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">{template.label}</h2>
                    <p className="text-xs text-slate-400">{template.id}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => moveTemplate(template.id, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => moveTemplate(template.id, 1)}
                    disabled={index === templates.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-12">
                <label className="space-y-2 lg:col-span-3">
                  <span className="text-sm font-medium text-slate-200">Label</span>
                  <Input
                    value={template.label}
                    onChange={(event) =>
                      updateTemplate(template.id, { label: event.target.value })
                    }
                    className="border-white/15 bg-slate-900/80 text-white"
                  />
                </label>
                <label className="space-y-2 lg:col-span-4">
                  <span className="text-sm font-medium text-slate-200">Message</span>
                  <Textarea
                    value={template.message}
                    onChange={(event) =>
                      updateTemplate(template.id, { message: event.target.value })
                    }
                    className="min-h-24 border-white/15 bg-slate-900/80 text-white"
                  />
                </label>
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-medium text-slate-200">Category</span>
                  <Input
                    value={template.category}
                    onChange={(event) =>
                      updateTemplate(template.id, { category: event.target.value })
                    }
                    className="border-white/15 bg-slate-900/80 text-white"
                  />
                </label>
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-medium text-slate-200">
                    Room/location
                  </span>
                  <Input
                    value={template.room}
                    onChange={(event) =>
                      updateTemplate(template.id, { room: event.target.value })
                    }
                    className="border-white/15 bg-slate-900/80 text-white"
                  />
                </label>
                <label className="space-y-2 lg:col-span-1">
                  <span className="text-sm font-medium text-slate-200">Order</span>
                  <Input
                    type="number"
                    value={template.sortOrder}
                    onChange={(event) =>
                      updateTemplate(template.id, {
                        sortOrder: Number(event.target.value),
                      })
                    }
                    className="border-white/15 bg-slate-900/80 text-white"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5">
                <label className="flex items-center gap-2 text-sm text-slate-200">
                  <select
                    value={template.urgency}
                    onChange={(event) =>
                      updateTemplate(template.id, {
                        urgency: event.target.value as AlertUrgency,
                      })
                    }
                    className="h-9 rounded-md border border-white/15 bg-slate-900 px-3 text-sm text-white"
                  >
                    {urgencyOptions.map((urgency) => (
                      <option key={urgency} value={urgency}>
                        {urgency}
                      </option>
                    ))}
                  </select>
                  Urgency
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-200">
                  <Switch
                    checked={template.isActive}
                    onCheckedChange={(checked) =>
                      updateTemplate(template.id, { isActive: checked })
                    }
                  />
                  {template.isActive ? (
                    <span className="inline-flex items-center gap-2">
                      <Eye className="size-4 text-emerald-300" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <EyeOff className="size-4 text-slate-400" />
                      Hidden
                    </span>
                  )}
                </label>
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
