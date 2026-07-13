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
});
