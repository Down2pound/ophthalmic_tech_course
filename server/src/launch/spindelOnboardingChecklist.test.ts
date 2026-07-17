import { describe, expect, it } from "vitest";
import { renderSpindelOnboardingChecklist } from "./spindelOnboardingChecklist";

describe("renderSpindelOnboardingChecklist", () => {
  it("prints a safe private checklist for Spindel-only onboarding content", () => {
    const checklist = renderSpindelOnboardingChecklist();

    expect(checklist).toContain("Spindel Eye Technician Onboarding");
    expect(checklist).toContain("doctor-specific protocol");
    expect(checklist).toContain("spindel-onboarding/doctor-protocols");
    expect(checklist).toContain("Do not sell or market");
    expect(checklist).toContain("No patient information");
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_");
  });
});
