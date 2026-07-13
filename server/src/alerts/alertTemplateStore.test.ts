import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  createAlertTemplateStore,
  type AlertTemplateStore,
} from "./alertTemplateStore";

let tempDirs: string[] = [];

async function createTempStore(now: () => string = () => "2026-07-02T12:00:00.000Z") {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "alert-template-store-"));
  tempDirs.push(tempDir);
  return createAlertTemplateStore({
    filePath: path.join(tempDir, "alert-templates.json"),
    now,
  });
}

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs = [];
});

describe("alert template JSON store", () => {
  it("seeds defaults only when storage is empty", async () => {
    const store = await createTempStore();

    const seeded = await store.listAllTemplates();
    expect(seeded.map((template) => template.label)).toContain("OCT Room 8");

    await store.saveAllTemplates([
      {
        ...seeded[0],
        label: "Custom Alert",
        sortOrder: 1,
      },
    ]);

    const reopened = await createAlertTemplateStore({
      filePath: store.filePath,
      now: () => "2030-01-01T00:00:00.000Z",
    });

    expect(await labels(reopened)).toEqual(["Custom Alert"]);
  });

  it("lists active templates by display order", async () => {
    const store = await createTempStore();
    const [first, second, third] = await store.listAllTemplates();

    await store.saveAllTemplates([
      { ...first, label: "Last", sortOrder: 3, isActive: true },
      { ...second, label: "Hidden", sortOrder: 1, isActive: false },
      { ...third, label: "First", sortOrder: 2, isActive: true },
    ]);

    expect((await store.listActiveTemplates()).map((template) => template.label)).toEqual([
      "First",
      "Last",
    ]);
  });
});

async function labels(store: AlertTemplateStore | (() => Promise<{ label: string }[]>)) {
  const templates =
    typeof store === "function" ? await store() : await store.listAllTemplates();
  return templates.map((template) => template.label);
}
