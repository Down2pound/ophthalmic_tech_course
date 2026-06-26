import { describe, expect, it } from "vitest";
import { optiTechCourse } from "./courseCatalog";
import { moduleOneLessons } from "./moduleOneLessons";

describe("optiTechCourse", () => {
  it("has one canonical ten-module sequence", () => {
    expect(optiTechCourse.id).toBe("optitech-foundations");
    expect(optiTechCourse.modules).toHaveLength(10);
    expect(optiTechCourse.modules.map((module) => module.moduleNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("uses stable lowercase module IDs", () => {
    expect(optiTechCourse.modules.map((module) => module.id)).toEqual([
      "entering-ophthalmic-care",
      "eye-anatomy-physiology-optics",
      "history-communication-documentation",
      "visual-acuity-pupils-motility",
      "tonometry-foundational-measurements",
      "lensometry-refraction-optical-skills",
      "diagnostic-imaging-visual-fields",
      "anterior-posterior-segment-foundations",
      "procedures-surgery-patient-safety",
      "clinic-readiness-career-launch",
    ]);
  });

  it("does not publish empty modules as finished content", () => {
    const publishedModules = optiTechCourse.modules.filter(
      (module) => module.status === "published"
    );
    expect(publishedModules.map((module) => module.moduleNumber)).toEqual([1]);

    const scheduledModules = optiTechCourse.modules.filter(
      (module) => module.status === "scheduled"
    );
    expect(scheduledModules.map((module) => module.moduleNumber)).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("keeps hands-on skills separate from online completion", () => {
    const skillStatuses = optiTechCourse.skillsPassport.map(
      (skill) => skill.verificationType
    );
    expect(skillStatuses).toContain("supervisor-observed");
    expect(skillStatuses).not.toContain("online-only");
  });
});

describe("moduleOneLessons", () => {
  it("publishes three starter lessons with review metadata", () => {
    expect(moduleOneLessons).toHaveLength(3);
    for (const lesson of moduleOneLessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.review.clinicalReviewer).toBe(
        "Clinical review required before production sale"
      );
      expect(lesson.review.reviewStatus).toBe("draft-reviewed-for-structure");
      expect(lesson.sources.length).toBeGreaterThan(0);
      expect(lesson.scopeNote).toMatch(/does not teach diagnosis/i);
    }
  });
});
