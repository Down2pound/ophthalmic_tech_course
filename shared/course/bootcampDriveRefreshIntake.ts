export type BootcampDriveRefreshClassification =
  | "needs-inspection"
  | "known-source-folder"
  | "public-course-candidate"
  | "advanced-content-candidate"
  | "visual-public-course-candidate"
  | "product-process-source"
  | "practice-only-or-excluded";

export interface BootcampDriveRefreshItem {
  visibleName: string;
  itemType: "folder" | "shared-folder" | "pdf" | "video" | "image" | "html";
  classification: BootcampDriveRefreshClassification;
  nextAction: string;
}

export const bootcampDriveRefreshDate = "2026-07-17";

export const bootcampDriveRefreshVisibleItemCount = 46;

export const bootcampDriveRefreshMappedFilenameCount = 35;

export const bootcampDriveRefreshIntakeItems: BootcampDriveRefreshItem[] = [
  {
    visibleName: "Course backup1",
    itemType: "folder",
    classification: "needs-inspection",
    nextAction:
      "Identify whether this is a duplicate archive, current course export, or obsolete backup before importing anything.",
  },
  {
    visibleName: "Ophthalmic Technician Course",
    itemType: "shared-folder",
    classification: "needs-inspection",
    nextAction:
      "Inspect child files and preserve Drive IDs before deciding whether this is a newer course source or a duplicate package.",
  },
  {
    visibleName: "ophthalmic-tech-bootcamp-site",
    itemType: "folder",
    classification: "known-source-folder",
    nextAction:
      "Keep as the structured legacy course-app source and confirm whether new child files were added before changing the course map.",
  },
  {
    visibleName: "Advanced_Ocular_Diagnostic_Masterclass.pdf",
    itemType: "pdf",
    classification: "advanced-content-candidate",
    nextAction:
      "Mapped as a Day 3 advanced diagnostic-testing PDF. Confirm rights, version status, and clinical review before publishing to learners.",
  },
  {
    visibleName:
      "Clinical Guide_ Manual Lensometry Standards and Procedures.pdf",
    itemType: "pdf",
    classification: "public-course-candidate",
    nextAction:
      "Mapped as a Day 5 manual lensometry standards PDF. Compare against the editable Lensometry Google Doc before publishing.",
  },
  {
    visibleName:
      "Clinical Guide_ Soft Skills and Patient Care for Ophthalmic Professionals.pdf",
    itemType: "pdf",
    classification: "public-course-candidate",
    nextAction:
      "Already mapped to the patient-care/professional-skills days. Compare against the preferred Soft Skills Google Doc and PDF pair before publishing.",
  },
  {
    visibleName: "Day_1.mp4",
    itemType: "video",
    classification: "public-course-candidate",
    nextAction:
      "Review as a possible Day 1 replacement or duplicate for the current foundations and intro videos.",
  },
  {
    visibleName: "Keratoconus2 jeff.png",
    itemType: "image",
    classification: "visual-public-course-candidate",
    nextAction:
      "Compare against the existing keratoconus image and choose one accessible, rights-cleared visual.",
  },
  {
    visibleName: "Mod_1_Video_Overiew.mp4",
    itemType: "video",
    classification: "public-course-candidate",
    nextAction:
      "Review spelling, version, and overlap with current Day 1 videos before mapping.",
  },
  {
    visibleName: "Ophthalmic_Tech_Bootcamp (1).mp4",
    itemType: "video",
    classification: "public-course-candidate",
    nextAction:
      "Determine whether this is an overview, duplicate, or free-preview candidate before clinical and rights review.",
  },
  {
    visibleName: "Ophthalmic_Tech_Crash_Course.mp4",
    itemType: "video",
    classification: "public-course-candidate",
    nextAction:
      "Consider as a short free-preview or marketing intro asset after scope, claims, and clinical review.",
  },
  {
    visibleName: "Project Detailing.pdf",
    itemType: "pdf",
    classification: "product-process-source",
    nextAction:
      "Inspect as product planning or production workflow material, not automatically public learner content.",
  },
  {
    visibleName: "spindel-eye-weekly-newsletter.html",
    itemType: "html",
    classification: "practice-only-or-excluded",
    nextAction:
      "Keep out of the national course; it may inform the separate SEA newsletter workflow only after internal-content review.",
  },
];

export function getBootcampDriveRefreshUnmappedCount(): number {
  return bootcampDriveRefreshIntakeItems.length;
}
