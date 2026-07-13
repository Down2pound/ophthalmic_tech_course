import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("deployment files", () => {
  it("documents how a Node host starts the production web service", async () => {
    const procfile = await readFile(
      path.resolve(process.cwd(), "Procfile"),
      "utf8"
    );

    expect(procfile.trim()).toBe("web: node dist/index.js");
  });

  it("keeps the Docker image aligned with the same production entrypoint", async () => {
    const dockerfile = await readFile(
      path.resolve(process.cwd(), "Dockerfile"),
      "utf8"
    );

    expect(dockerfile).toContain('CMD ["node", "dist/index.js"]');
    expect(dockerfile).toContain("/api/health");
  });

  it("keeps the Render Blueprint aligned with the launch service", async () => {
    const renderBlueprint = await readFile(
      path.resolve(process.cwd(), "render.yaml"),
      "utf8"
    );

    expect(renderBlueprint).toContain("name: optitech-academy");
    expect(renderBlueprint).toContain("runtime: node");
    expect(renderBlueprint).toContain("pnpm build");
    expect(renderBlueprint).toContain("preDeployCommand: pnpm db:setup");
    expect(renderBlueprint).toContain("startCommand: node dist/index.js");
    expect(renderBlueprint).toContain("healthCheckPath: /api/health");
    expect(renderBlueprint).toContain("fromDatabase:");
    expect(renderBlueprint).toContain("sync: false");
    expect(renderBlueprint).toContain("generateValue: true");
    expect(renderBlueprint).not.toContain("sk_test_");
    expect(renderBlueprint).not.toContain("whsec_");
  });
});
