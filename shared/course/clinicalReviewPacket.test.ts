import { describe, expect, it } from "vitest";
import {
  getModuleOneClinicalReviewPacket,
  isModuleOneClinicallyReviewed,
} from "./clinicalReviewPacket";
import { moduleOneLessons } from "./moduleOneLessons";

describe("getModuleOneClinicalReviewPacket", () => {
  it("summarizes every Module 1 lesson for clinical review", () => {
    const packet = getModuleOneClinicalReviewPacket();

    expect(packet.moduleId).toBe("entering-ophthalmic-care");
    expect(packet.lessons.map(lesson => lesson.lessonId)).toEqual(
      moduleOneLessons.map(lesson => lesson.id)
    );
    expect(packet.signoffFields).toContain("Clinical reviewer name");
    expect(packet.lessons[0].reviewQuestions).toContain(
      "Is the lesson clinically accurate for an entry-level ophthalmic learner?"
    );
  });

  it("keeps the launch blocker active until all lessons are clinically reviewed", () => {
    expect(isModuleOneClinicallyReviewed()).toBe(false);
  });
});
