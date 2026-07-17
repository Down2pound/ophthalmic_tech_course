import {
  bootcampDriveRefreshDate,
  bootcampDriveRefreshIntakeItems,
  bootcampDriveRefreshMappedFilenameCount,
  bootcampDriveRefreshVisibleItemCount,
  getBootcampDriveRefreshUnmappedCount,
} from "../../../shared/course/bootcampDriveRefreshIntake";
import {
  bootcampNotebookLmUrl,
  bootcampSiteCourseDataUrl,
  bootcampSourceDays,
  bootcampSourceFolderUrl,
  getBootcampSourceAssetCount,
} from "../../../shared/course/bootcampSourceMap";

function renderCheckbox(label: string): string {
  return `- [ ] ${label}`;
}

export function renderBootcampContentMigrationChecklist(): string {
  return [
    "# OptiTech Academy Bootcamp Content Migration Checklist",
    "",
    "Use this checklist before turning Bootcamp source materials into paid course content.",
    "",
    "Simple translation: the Bootcamp folder is the supply closet. This checklist makes sure each item is safe, reviewed, and in the right place before students use it.",
    "",
    "## Source Locations",
    "",
    `- Bootcamp Drive folder: ${bootcampSourceFolderUrl}`,
    `- NotebookLM source workspace: ${bootcampNotebookLmUrl}`,
    `- Older site course data: ${bootcampSiteCourseDataUrl}`,
    "",
    "## Migration Rules",
    "",
    renderCheckbox("Confirm content owner and reuse rights for every file."),
    renderCheckbox(
      "Confirm no patient information, staff-private details, or internal-only Spindel workflow details are present."
    ),
    renderCheckbox(
      "Save doctor-specific protocols, provider workup preferences, Spindel post-op/pre-op rules, and SEA workflow instructions only in the private Spindel Eye Technician onboarding version."
    ),
    renderCheckbox(
      "Assign each asset to public course, practice-only onboarding, or excluded."
    ),
    renderCheckbox(
      "Clinical reviewer approves the lesson claims before publication."
    ),
    renderCheckbox(
      "Create accessible alternatives for media: captions or transcript for video/audio, alt text or summary for images, and readable PDF text."
    ),
    renderCheckbox(
      "Copy approved assets into the final managed storage location before using the proposed storage keys."
    ),
    renderCheckbox(
      "Keep source Drive IDs and original filenames in content metadata."
    ),
    renderCheckbox(
      "Do not sell unpublished modules as complete content; show release status clearly."
    ),
    "",
    "## Source Summary",
    "",
    `- Bootcamp days mapped: ${bootcampSourceDays.length}`,
    `- Source assets mapped: ${getBootcampSourceAssetCount()}`,
    `- Free-preview candidate days: ${bootcampSourceDays.filter(day => day.freePreview).length}`,
    "",
    "## Latest Drive Refresh Intake",
    "",
    `- Refresh date: ${bootcampDriveRefreshDate}`,
    `- Visible top-level Drive items: ${bootcampDriveRefreshVisibleItemCount}`,
    `- Visible filenames already in typed source map: ${bootcampDriveRefreshMappedFilenameCount}`,
    `- Drive refresh intake items needing review: ${getBootcampDriveRefreshUnmappedCount()}`,
    "",
    "These files are not approved course content yet. Treat them as a review queue before changing paid lessons, public assets, or the typed Bootcamp source map.",
    "",
    ...bootcampDriveRefreshIntakeItems.flatMap(item => [
      `- [ ] \`${item.visibleName}\` (${item.itemType}; ${item.classification})`,
      `  - Next action: ${item.nextAction}`,
    ]),
    "",
    "## Day-By-Day Migration Queue",
    "",
    ...bootcampSourceDays.flatMap(day => [
      `### Day ${day.day}: ${day.title}`,
      "",
      `Slug: \`${day.slug}\``,
      "",
      day.subtitle,
      "",
      "**Outcomes to review:**",
      "",
      ...day.outcomes.map(outcome => `- ${outcome}`),
      "",
      "**Clinical tasks to map:**",
      "",
      ...day.clinicTasks.map(task => `- ${task}`),
      "",
      "**Assets to migrate:**",
      "",
      ...day.assets.map(
        asset =>
          `- [ ] ${asset.title} (${asset.kind}) - source: \`${asset.sourceFilename}\`; proposed storage: \`${asset.storageKey}\`${asset.freePreview ? "; free-preview candidate" : ""}`
      ),
      "",
      "**Notebook review prompts:**",
      "",
      ...day.notebook.reviewPrompts.map(prompt => `- ${prompt}`),
      "",
      "**Required approvals before publishing this day:**",
      "",
      renderCheckbox("Rights and ownership reviewed."),
      renderCheckbox("Clinical accuracy reviewed."),
      renderCheckbox("Accessibility reviewed."),
      renderCheckbox("Public/practice-only/excluded classification recorded."),
      renderCheckbox("Learner-facing copy matches actual release status."),
      "",
    ]),
    "## Do Not Save Here",
    "",
    "Do not paste live Stripe keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient details, private learner details, or private staff/employer details into this checklist.",
    "",
  ].join("\n");
}
