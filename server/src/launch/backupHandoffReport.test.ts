import { describe, expect, it } from "vitest";
import { renderBackupHandoffReport } from "./backupHandoffReport";

describe("renderBackupHandoffReport", () => {
  it("prints the GitHub push path and course source trail without secrets", () => {
    const report = renderBackupHandoffReport({
      branchName: "codex/optitech-product-spec",
      latestCommit: "abc1234",
      sourceArchiveName: "optitech-academy-source-2026-07-16-abc1234.zip",
      bundleArchiveName: "optitech-academy-branch-2026-07-16-abc1234.bundle",
    });

    expect(report).toContain("# OptiTech Academy Backup Handoff");
    expect(report).toContain(
      "GitHub repo: https://github.com/Down2pound/ophthalmic_tech_course.git"
    );
    expect(report).toContain("Current branch: codex/optitech-product-spec");
    expect(report).toContain("Latest local commit: abc1234");
    expect(report).toContain("git push -u origin codex/optitech-product-spec");
    expect(report).toContain("optitech-academy-source-2026-07-16-abc1234.zip");
    expect(report).toContain(
      "optitech-academy-branch-2026-07-16-abc1234.bundle"
    );
    expect(report).toContain("pnpm launch:env-template");
    expect(report).toContain("pnpm launch:admin-tokens");
    expect(report).toContain("pnpm launch:database-setup");
    expect(report).toContain("pnpm launch:render-setup");
    expect(report).toContain("pnpm launch:email-setup");
    expect(report).toContain("pnpm launch:stripe-products");
    expect(report).toContain("pnpm launch:first-sales");
    expect(report).toContain("pnpm launch:sales-tracker");
    expect(report).toContain("pnpm launch:live-purchase-test");
    expect(report).toContain(
      "Bootcamp Drive folder: https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q"
    );
    expect(report).toContain(
      "NotebookLM workspace: https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1"
    );
    expect(report).toContain("Bootcamp days mapped: 10");
    expect(report).not.toContain("sk_test_");
    expect(report).not.toContain("whsec_");
  });
});
