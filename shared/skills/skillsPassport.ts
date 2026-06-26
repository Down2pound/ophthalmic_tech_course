export type SkillStatusId =
  | "not-started"
  | "practicing"
  | "ready-for-review"
  | "verified"
  | "needs-remediation";

export interface SkillStatus {
  id: SkillStatusId;
  label: string;
  description: string;
}

export interface PassportSkill {
  id: string;
  moduleNumber: number;
  moduleTitle: string;
  name: string;
  learnerPreparation: string[];
  observableCriteria: string[];
  safetyCriticalErrors: string[];
  supervisorPrompt: string;
}

export interface SkillsPassport {
  title: string;
  purpose: string;
  disclaimer: string;
  statuses: SkillStatus[];
  skills: PassportSkill[];
}

export const skillsPassport: SkillsPassport = {
  title: "OptiTech Skills Passport",
  purpose:
    "A structured checklist learners can use to discuss hands-on practice with a supervisor, trainer, or future employer.",
  disclaimer:
    "Online course completion does not verify hands-on clinical competency. Skills are only verified when an authorized supervisor directly observes the learner in the appropriate practice setting.",
  statuses: [
    {
      id: "not-started",
      label: "Not started",
      description: "The learner has not practiced this skill yet.",
    },
    {
      id: "practicing",
      label: "Practicing",
      description: "The learner is practicing with guidance or observation.",
    },
    {
      id: "ready-for-review",
      label: "Ready for review",
      description:
        "The learner feels prepared for direct supervisor observation.",
    },
    {
      id: "verified",
      label: "Verified",
      description:
        "A supervisor directly observed the skill and marked it acceptable.",
    },
    {
      id: "needs-remediation",
      label: "Needs remediation",
      description:
        "A supervisor identified gaps that need more practice or coaching.",
    },
  ],
  skills: [
    {
      id: "clinic-role-boundaries",
      moduleNumber: 1,
      moduleTitle: "Entering Ophthalmic Care",
      name: "Explain clinic role boundaries",
      learnerPreparation: [
        "Review clinic roles and escalation pathways.",
        "Practice explaining what technicians can and cannot promise patients.",
        "Identify who to ask when a patient question is outside scope.",
      ],
      observableCriteria: [
        "Uses clear, patient-friendly language.",
        "Avoids giving diagnosis, prognosis, or treatment decisions.",
        "Escalates clinical questions to the appropriate licensed team member.",
      ],
      safetyCriticalErrors: [
        "Tells a patient their diagnosis or treatment plan without provider direction.",
      ],
      supervisorPrompt:
        "Supervisor should observe whether the learner keeps patient communication within role and escalates appropriately.",
    },
    {
      id: "privacy-and-professionalism",
      moduleNumber: 1,
      moduleTitle: "Entering Ophthalmic Care",
      name: "Demonstrate privacy and professional conduct",
      learnerPreparation: [
        "Review patient privacy expectations.",
        "Practice a respectful greeting and identity confirmation.",
        "Prepare examples of private information that should not be shared casually.",
      ],
      observableCriteria: [
        "Confirms patient identity using practice-approved steps.",
        "Keeps patient information out of public conversation areas.",
        "Uses calm, respectful language with patients and teammates.",
      ],
      safetyCriticalErrors: [
        "Discusses identifiable patient information where unauthorized people can hear it.",
      ],
      supervisorPrompt:
        "Supervisor should observe patient interaction habits and document whether privacy expectations are followed.",
    },
    {
      id: "medical-terminology-readback",
      moduleNumber: 1,
      moduleTitle: "Entering Ophthalmic Care",
      name: "Use ophthalmic terminology with readback",
      learnerPreparation: [
        "Review common abbreviations and plain-language equivalents.",
        "Practice reading a short ophthalmic instruction aloud.",
        "Prepare to ask for clarification instead of guessing.",
      ],
      observableCriteria: [
        "Pronounces common ophthalmic terms clearly enough for team communication.",
        "Uses readback when receiving instructions that affect patient flow or testing.",
        "Asks for clarification when an abbreviation or instruction is unclear.",
      ],
      safetyCriticalErrors: [
        "Acts on an unclear instruction without clarifying it first.",
      ],
      supervisorPrompt:
        "Supervisor should listen for accurate terminology, appropriate readback, and willingness to clarify uncertainty.",
    },
    {
      id: "anatomy-orientation",
      moduleNumber: 2,
      moduleTitle: "Eye Anatomy, Physiology, and Optics",
      name: "Identify major ocular structures",
      learnerPreparation: [
        "Review external and internal anatomy diagrams.",
        "Practice explaining the cornea, lens, retina, macula, and optic nerve.",
        "Connect each structure to a basic visual function.",
      ],
      observableCriteria: [
        "Identifies major structures on a diagram or model.",
        "Explains each structure in patient-friendly language.",
        "Connects basic anatomy to common testing or imaging workflows.",
      ],
      safetyCriticalErrors: [
        "Confuses anterior and posterior structures in a way that could misdirect testing or documentation.",
      ],
      supervisorPrompt:
        "Supervisor should ask the learner to identify structures and explain why they matter in clinic flow.",
    },
    {
      id: "visual-acuity-setup",
      moduleNumber: 4,
      moduleTitle: "Visual Acuity, Pupils, and Motility",
      name: "Prepare for visual acuity testing",
      learnerPreparation: [
        "Review distance and near acuity setup.",
        "Practice patient instructions before entering the exam room.",
        "Review when to use current correction and when to ask for help.",
      ],
      observableCriteria: [
        "Sets up the room, chart, occluder, and correction according to practice protocol.",
        "Gives clear instructions without coaching answers.",
        "Documents results in the practice-approved format.",
      ],
      safetyCriticalErrors: [
        "Records acuity results that were coached, guessed, or performed under the wrong conditions.",
      ],
      supervisorPrompt:
        "Supervisor should observe setup, patient instructions, and documentation before marking this skill verified.",
    },
  ],
};

export function getSkillsByModule(moduleNumber: number): PassportSkill[] {
  return skillsPassport.skills.filter(
    (skill) => skill.moduleNumber === moduleNumber
  );
}
