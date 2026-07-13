import { describe, expect, it } from "vitest";
import {
  bootcampNotebookLmUrl,
  bootcampSiteCourseDataUrl,
  bootcampSourceDays,
  bootcampSourceFolderUrl,
  getBootcampSourceAssetCount,
  getBootcampSourceDay,
} from "./bootcampSourceMap";

describe("bootcampSourceMap", () => {
  it("preserves the discovered 10-day Bootcamp sequence", () => {
    expect(bootcampSourceDays).toHaveLength(10);
    expect(bootcampSourceDays.map(day => day.day)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(bootcampSourceDays[0].slug).toBe(
      "foundations-first-patient-encounter"
    );
    expect(bootcampSourceDays[9].slug).toBe(
      "capstone-certification-roadmap"
    );
  });

  it("keeps source locations visible for audit and migration", () => {
    expect(bootcampSourceFolderUrl).toContain(
      "drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q"
    );
    expect(bootcampNotebookLmUrl).toContain(
      "notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1"
    );
    expect(bootcampSiteCourseDataUrl).toContain(
      "drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI"
    );
  });

  it("maps each day to assets and notebook review prompts", () => {
    expect(getBootcampSourceAssetCount()).toBeGreaterThan(30);

    for (const day of bootcampSourceDays) {
      expect(day.assets.length).toBeGreaterThan(0);
      expect(day.notebook.clinicalPearls.length).toBeGreaterThan(0);
      expect(day.notebook.reviewPrompts.length).toBeGreaterThan(0);
      for (const asset of day.assets) {
        expect(asset.sourceFilename).toMatch(/\.(mp4|pdf|m4a|png)$/i);
        expect(asset.storageKey).toMatch(/^(videos|pdfs|audio|images)\//);
      }
    }
  });

  it("marks only the first Bootcamp day as a free-preview candidate", () => {
    expect(bootcampSourceDays.filter(day => day.freePreview)).toEqual([
      getBootcampSourceDay("foundations-first-patient-encounter"),
    ]);
    expect(
      getBootcampSourceDay("foundations-first-patient-encounter").assets.some(
        asset => asset.freePreview
      )
    ).toBe(true);
  });
});
