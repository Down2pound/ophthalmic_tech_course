const spindelOnboardingCourseTitle = "Spindel Eye Technician Onboarding";
const spindelOnboardingStorageRoot = "spindel-onboarding";

const spindelOnboardingLanes = [
  {
    title: "Doctor-Specific Protocols",
    description:
      "Provider preferences, workup rules, post-op/pre-op instructions, escalation preferences, and other SEA-only clinical workflow details.",
    storageRoot: `${spindelOnboardingStorageRoot}/doctor-protocols`,
    examples: [
      "Dr. Ramsey retina workup preferences",
      "Dr. Farahani post-op cataract workflow",
      "Provider-specific dry-eye workup notes",
    ],
    requiredReview: [
      "Provider or clinical lead confirms the protocol is current.",
      "No patient information or staff-private details are present.",
      "The protocol is labeled as Spindel-only, not public OptiTech content.",
      "A review date and owner are recorded before onboarding use.",
    ],
  },
  {
    title: "SEA Clinic Workflows",
    description:
      "Practice-specific rooming, scheduling, triage, handoff, equipment, and internal communication workflows for Spindel onboarding.",
    storageRoot: `${spindelOnboardingStorageRoot}/clinic-workflows`,
    examples: [
      "SEA technician rooming flow",
      "Practice-specific testing handoff checklist",
      "Internal escalation and communication workflow",
    ],
    requiredReview: [
      "Practice manager or training lead confirms this is appropriate for internal onboarding.",
      "No passwords, private links, patient information, or staff performance details are present.",
      "Public-course overlap is separated from internal workflow instructions.",
    ],
  },
  {
    title: "Spindel Onboarding Assessments",
    description:
      "Internal signoff checklists, supervised practice notes, and onboarding assessments tied to SEA workflows.",
    storageRoot: `${spindelOnboardingStorageRoot}/assessments`,
    examples: [
      "New technician supervised practice checklist",
      "SEA onboarding milestone review",
      "Doctor-protocol readiness signoff",
    ],
    requiredReview: [
      "Supervisor confirms the assessment matches current local expectations.",
      "Assessment language avoids promising certification or independent competency without observation.",
      "Private employee performance notes are not stored in course source files.",
    ],
  },
];

function renderCheckbox(label) {
  return `- [ ] ${label}`;
}

const output = [
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

console.log(output);
