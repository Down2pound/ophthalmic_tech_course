import { describe, expect, it } from "vitest";
import { skillsPassport, getSkillsByModule } from "./skillsPassport";

describe("skillsPassport", () => {
  it("separates online learning from hands-on verification", () => {
    expect(skillsPassport.disclaimer).toMatch(/does not verify hands-on/i);
    expect(skillsPassport.statuses.map((status) => status.id)).toEqual([
      "not-started",
      "practicing",
      "ready-for-review",
      "verified",
      "needs-remediation",
    ]);
  });

  it("includes observable criteria and safety-critical errors for every skill", () => {
    for (const skill of skillsPassport.skills) {
      expect(skill.observableCriteria.length).toBeGreaterThanOrEqual(3);
      expect(skill.safetyCriticalErrors.length).toBeGreaterThanOrEqual(1);
      expect(skill.supervisorPrompt).toMatch(/supervisor/i);
    }
  });
});

describe("getSkillsByModule", () => {
  it("returns skills for a specific module", () => {
    const moduleOneSkills = getSkillsByModule(1);

    expect(moduleOneSkills.length).toBeGreaterThan(0);
    expect(moduleOneSkills.every((skill) => skill.moduleNumber === 1)).toBe(
      true
    );
  });
});
