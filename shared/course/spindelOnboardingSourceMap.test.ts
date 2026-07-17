import { describe, expect, it } from "vitest";
import {
  getSpindelOnboardingLane,
  spindelOnboardingCourseTitle,
  spindelOnboardingLanes,
  spindelOnboardingStorageRoot,
} from "./spindelOnboardingSourceMap";

describe("spindelOnboardingSourceMap", () => {
  it("defines a private onboarding course lane for doctor-specific protocols", () => {
    const doctorProtocols = getSpindelOnboardingLane(
      "doctor-specific-protocols"
    );

    expect(spindelOnboardingCourseTitle).toBe(
      "Spindel Eye Technician Onboarding"
    );
    expect(spindelOnboardingStorageRoot).toBe("spindel-onboarding");
    expect(doctorProtocols.storageRoot).toBe(
      "spindel-onboarding/doctor-protocols"
    );
    expect(doctorProtocols.assetKinds).toContain("doctor-protocol");
    expect(doctorProtocols.requiredReview).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Spindel-only"),
        expect.stringContaining("No patient information"),
      ])
    );
  });

  it("keeps every private lane under the Spindel onboarding storage root", () => {
    expect(spindelOnboardingLanes.length).toBeGreaterThanOrEqual(3);

    for (const lane of spindelOnboardingLanes) {
      expect(lane.storageRoot).toMatch(/^spindel-onboarding\//);
      expect(lane.examples.length).toBeGreaterThan(0);
      expect(lane.requiredReview.length).toBeGreaterThan(0);
    }
  });

  it("rejects unknown private onboarding lanes", () => {
    expect(() => getSpindelOnboardingLane("public-optitech-course")).toThrow(
      "Unknown Spindel onboarding lane"
    );
  });
});
