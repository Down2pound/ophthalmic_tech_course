export type SpindelOnboardingAssetKind =
  | "doctor-protocol"
  | "practice-workflow"
  | "checklist"
  | "training-reference";

export interface SpindelOnboardingLane {
  id: string;
  title: string;
  description: string;
  storageRoot: string;
  assetKinds: SpindelOnboardingAssetKind[];
  examples: string[];
  requiredReview: string[];
}

export const spindelOnboardingCourseTitle = "Spindel Eye Technician Onboarding";

export const spindelOnboardingStorageRoot = "spindel-onboarding";

export const spindelOnboardingLanes: SpindelOnboardingLane[] = [
  {
    id: "doctor-specific-protocols",
    title: "Doctor-Specific Protocols",
    description:
      "Provider preferences, workup rules, post-op/pre-op instructions, escalation preferences, and other SEA-only clinical workflow details.",
    storageRoot: `${spindelOnboardingStorageRoot}/doctor-protocols`,
    assetKinds: ["doctor-protocol", "checklist", "training-reference"],
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
    id: "sea-clinic-workflows",
    title: "SEA Clinic Workflows",
    description:
      "Practice-specific rooming, scheduling, triage, handoff, equipment, and internal communication workflows for Spindel onboarding.",
    storageRoot: `${spindelOnboardingStorageRoot}/clinic-workflows`,
    assetKinds: ["practice-workflow", "checklist", "training-reference"],
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
    id: "spindel-onboarding-assessments",
    title: "Spindel Onboarding Assessments",
    description:
      "Internal signoff checklists, supervised practice notes, and onboarding assessments tied to SEA workflows.",
    storageRoot: `${spindelOnboardingStorageRoot}/assessments`,
    assetKinds: ["checklist", "training-reference"],
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

export function getSpindelOnboardingLane(id: string): SpindelOnboardingLane {
  const lane = spindelOnboardingLanes.find(item => item.id === id);

  if (!lane) {
    throw new Error(`Unknown Spindel onboarding lane: ${id}`);
  }

  return lane;
}
