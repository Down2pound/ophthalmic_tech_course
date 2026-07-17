import { describe, expect, it } from "vitest";
import { bootcampSourceDays } from "../../../shared/course/bootcampSourceMap";
import { renderBootcampContentMigrationChecklist } from "./bootcampContentMigrationChecklist";

describe("renderBootcampContentMigrationChecklist", () => {
  it("renders a safe day-by-day migration queue from the Bootcamp source map", () => {
    const checklist = renderBootcampContentMigrationChecklist();

    expect(checklist).toContain(
      "# OptiTech Academy Bootcamp Content Migration Checklist"
    );
    expect(checklist).toContain("Bootcamp days mapped: 10");
    expect(checklist).toContain("Source assets mapped:");
    expect(checklist).toContain("Latest Drive Refresh Intake");
    expect(checklist).toContain(
      "Drive refresh intake items needing review: 13"
    );
    expect(checklist).toContain("Day_1.mp4");
    expect(checklist).toContain("Ophthalmic_Tech_Crash_Course.mp4");
    expect(checklist).toContain("spindel-eye-weekly-newsletter.html");
    expect(checklist).toContain("NotebookLM source workspace");
    expect(checklist).toContain("free-preview candidate");
    expect(checklist).toContain(
      "private Spindel Eye Technician onboarding version"
    );
    expect(checklist).toContain("Do not paste live Stripe keys");

    for (const day of bootcampSourceDays) {
      expect(checklist).toContain(`### Day ${day.day}: ${day.title}`);
      expect(checklist).toContain(`Slug: \`${day.slug}\``);
      for (const asset of day.assets) {
        expect(checklist).toContain(asset.sourceFilename);
        expect(checklist).toContain(asset.storageKey);
      }
    }

    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_");
  });
});
