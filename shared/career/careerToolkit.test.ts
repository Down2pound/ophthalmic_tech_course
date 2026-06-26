import { describe, expect, it } from "vitest";
import { careerToolkit, getToolkitSection } from "./careerToolkit";

describe("careerToolkit", () => {
  it("covers job search, resume, interview, and scope language", () => {
    expect(careerToolkit.sections.map((section) => section.id)).toEqual([
      "resume",
      "interview",
      "job-search",
      "scope-language",
    ]);
  });

  it("keeps claims honest and learner-ready", () => {
    const combined = careerToolkit.sections
      .flatMap((section) => [
        section.title,
        section.summary,
        ...section.actionItems,
        ...section.sampleLanguage,
      ])
      .join(" ");

    expect(combined).toMatch(/completion/i);
    expect(combined).toMatch(/supervised/i);
    expect(combined).not.toMatch(/certified ophthalmic technician/i);
    expect(combined).not.toMatch(/guaranteed job/i);
  });
});

describe("getToolkitSection", () => {
  it("returns a specific section by id", () => {
    expect(getToolkitSection("resume")?.title).toMatch(/Resume/i);
  });
});
