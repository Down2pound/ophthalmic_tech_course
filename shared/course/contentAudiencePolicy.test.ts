import { describe, expect, it } from "vitest";
import {
  classifyCourseSourceAudience,
  isDoctorSpecificProtocolSource,
  spindelDoctorProtocolStorageRoot,
} from "./contentAudiencePolicy";

describe("content audience policy", () => {
  it("routes doctor-specific protocols to the private Spindel onboarding course", () => {
    expect(
      classifyCourseSourceAudience("Dr Ramsey retina injection protocol.pdf")
    ).toBe("spindel-technician-onboarding");
    expect(
      classifyCourseSourceAudience("Farahani cataract post-op workup.pdf")
    ).toBe("spindel-technician-onboarding");
    expect(classifyCourseSourceAudience("SEA urgent add-on protocol.pdf")).toBe(
      "spindel-technician-onboarding"
    );
    expect(classifyCourseSourceAudience("Dr O'Block workup notes.pdf")).toBe(
      "spindel-technician-onboarding"
    );
    expect(isDoctorSpecificProtocolSource("provider dry eye workup")).toBe(
      true
    );
  });

  it("keeps neutral national training PDFs in the public course lane", () => {
    expect(
      classifyCourseSourceAudience("Mastering_Manual_Lensometry.pdf")
    ).toBe("public-optitech-course");
    expect(
      classifyCourseSourceAudience("Advanced_Ocular_Diagnostic_Masterclass.pdf")
    ).toBe("public-optitech-course");
  });

  it("excludes product planning files from learner course content", () => {
    expect(classifyCourseSourceAudience("Project Detailing.pdf")).toBe(
      "exclude-from-learner-course"
    );
    expect(spindelDoctorProtocolStorageRoot).toBe(
      "spindel-onboarding/doctor-protocols"
    );
  });
});
