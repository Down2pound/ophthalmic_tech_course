import { describe, expect, it } from "vitest";
import { certificatePreview, getCertificateDisplayName } from "./certificate";

describe("certificatePreview", () => {
  it("states completion without claiming certification", () => {
    const combined = [
      certificatePreview.title,
      certificatePreview.subtitle,
      certificatePreview.completionStatement,
      certificatePreview.limitationStatement,
      ...certificatePreview.requirements,
    ].join(" ");

    expect(combined).toMatch(/completion/i);
    expect(combined).toMatch(/not certification/i);
    expect(combined).toMatch(/does not verify hands-on/i);
    expect(combined).not.toMatch(/certified ophthalmic technician/i);
    expect(combined).not.toMatch(/license/i);
    expect(combined).not.toMatch(/exam eligibility/i);
  });
});

describe("getCertificateDisplayName", () => {
  it("falls back to learner name when blank", () => {
    expect(getCertificateDisplayName("")).toBe("Learner Name");
    expect(getCertificateDisplayName("  Jordan Lee  ")).toBe("Jordan Lee");
  });
});
