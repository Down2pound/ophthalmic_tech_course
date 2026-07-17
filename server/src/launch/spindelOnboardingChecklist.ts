import {
  spindelOnboardingCourseTitle,
  spindelOnboardingLanes,
  spindelOnboardingStorageRoot,
} from "../../../shared/course/spindelOnboardingSourceMap";

function renderCheckbox(label: string): string {
  return `- [ ] ${label}`;
}

export function renderSpindelOnboardingChecklist(): string {
  return [
    `# ${spindelOnboardingCourseTitle} Source Checklist`,
    "",
    "Use this for Spindel-only onboarding content that should not be published inside the public OptiTech Academy course.",
    "",
    "Simple translation: the public course teaches general eye-care foundations. This private lane is where SEA doctor preferences and local workflows go.",
    "",
    "## Private Storage Root",
    "",
    `- \`${spindelOnboardingStorageRoot}\``,
    "",
    "## Intake Rules",
    "",
    renderCheckbox(
      "Classify every doctor-specific protocol as Spindel-only before import."
    ),
    renderCheckbox(
      "Remove patient information, staff-private details, passwords, private links, and internal performance notes."
    ),
    renderCheckbox(
      "Record the protocol owner, review date, and version before onboarding use."
    ),
    renderCheckbox(
      "Keep public OptiTech lesson content separate from SEA-only workflow instructions."
    ),
    renderCheckbox(
      "Do not sell or market Spindel-only protocol content as part of the national course."
    ),
    "",
    "## Private Onboarding Lanes",
    "",
    ...spindelOnboardingLanes.flatMap(lane => [
      `### ${lane.title}`,
      "",
      `Storage: \`${lane.storageRoot}\``,
      "",
      lane.description,
      "",
      "**Examples:**",
      "",
      ...lane.examples.map(example => `- ${example}`),
      "",
      "**Required review before use:**",
      "",
      ...lane.requiredReview.map(renderCheckbox),
      "",
    ]),
    "## Do Not Save Here",
    "",
    "Do not paste patient information, protected health information, private employee performance notes, passwords, raw sign-in links, Stripe keys, webhook secrets, database passwords, or email API keys into this checklist.",
    "",
  ].join("\n");
}
