import { describe, expect, it } from "vitest";
import { freePreviewLesson } from "./freePreview";

describe("freePreviewLesson", () => {
  it("keeps the public preview useful without promising diagnosis or certification", () => {
    const previewText = [
      freePreviewLesson.title,
      freePreviewLesson.outcome,
      ...freePreviewLesson.lessonBody,
      freePreviewLesson.checkpoint.safeAnswer,
      freePreviewLesson.checkpoint.whyItMatters,
      ...freePreviewLesson.courseFit,
      ...freePreviewLesson.nextSteps,
    ].join(" ");

    expect(previewText).toContain("provider");
    expect(previewText).toContain("supervised");
    expect(previewText.toLowerCase()).not.toContain("diagnose patients");
    expect(previewText.toLowerCase()).not.toContain("certified technician");
  });
});
