import { describe, expect, it } from "vitest";
import { renderProductionEnvChecklist } from "./productionEnvChecklist";

describe("renderProductionEnvChecklist", () => {
  it("renders a safe fill-in checklist for production variables", () => {
    const checklist = renderProductionEnvChecklist({
      generatedAt: "2026-07-13T12:00:00.000Z",
    });

    expect(checklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(checklist).toContain("`STRIPE_SECRET_KEY`");
    expect(checklist).toContain("`DATABASE_URL`");
    expect(checklist).toContain("`ENABLE_PAID_ENROLLMENT`");
    expect(checklist).toContain("pnpm launch:doctor");
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("replace_with");
  });
});
