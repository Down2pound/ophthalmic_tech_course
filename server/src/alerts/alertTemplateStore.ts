import fs from "node:fs/promises";
import path from "node:path";
import {
  createDefaultAlertTemplates,
  normalizeAlertTemplates,
  type AlertTemplate,
} from "../../../shared/alerts/alertTemplates";

export type AlertTemplateStore = {
  filePath: string;
  listAllTemplates: () => Promise<AlertTemplate[]>;
  listActiveTemplates: () => Promise<AlertTemplate[]>;
  saveAllTemplates: (templates: AlertTemplate[]) => Promise<AlertTemplate[]>;
  deleteTemplate: (id: string) => Promise<AlertTemplate[]>;
};

type StoreOptions = {
  filePath?: string;
  now?: () => string;
};

export async function createAlertTemplateStore(
  options: StoreOptions = {}
): Promise<AlertTemplateStore> {
  const filePath =
    options.filePath ?? path.resolve(process.cwd(), "data", "alert-templates.json");
  const now = options.now ?? (() => new Date().toISOString());

  await ensureSeeded(filePath, now);

  async function listAllTemplates() {
    const templates = await readTemplates(filePath);
    return sortTemplates(templates);
  }

  async function listActiveTemplates() {
    const templates = await listAllTemplates();
    return templates.filter((template) => template.isActive);
  }

  async function saveAllTemplates(templates: AlertTemplate[]) {
    const normalized = normalizeAlertTemplates(templates, now);
    await writeTemplates(filePath, normalized);
    return sortTemplates(normalized);
  }

  async function deleteTemplate(id: string) {
    const remaining = (await listAllTemplates()).filter((template) => template.id !== id);
    return saveAllTemplates(remaining);
  }

  return {
    filePath,
    listAllTemplates,
    listActiveTemplates,
    saveAllTemplates,
    deleteTemplate,
  };
}

async function ensureSeeded(filePath: string, now: () => string) {
  try {
    const existing = await readTemplates(filePath);
    if (existing.length > 0) return;
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  }

  await writeTemplates(filePath, createDefaultAlertTemplates(now));
}

async function readTemplates(filePath: string) {
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw) as AlertTemplate[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeTemplates(filePath: string, templates: AlertTemplate[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(sortTemplates(templates), null, 2)}\n`, "utf-8");
}

function sortTemplates(templates: AlertTemplate[]) {
  return [...templates].sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
}
