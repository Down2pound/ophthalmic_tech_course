import type { CourseCatalog } from "./types";

export const optiTechCourse: CourseCatalog = {
  id: "optitech-foundations",
  title: "OptiTech Academy Ophthalmic Technician Foundations",
  version: "2026.06.phase-one",
  audience: ["career-starter", "medical-assistant-bridge", "practice-onboarding"],
  promise:
    "Build the knowledge, vocabulary, clinical judgment, and supervised practice plan needed to contribute confidently in an entry-level ophthalmic assistant or technician role.",
  limitations: [
    "Completion is not IJCAHPO certification.",
    "Online lessons do not verify hands-on clinical competency.",
    "Learners must follow employer policies, provider instructions, and state or local rules.",
  ],
  modules: [
    {
      id: "entering-ophthalmic-care",
      moduleNumber: 1,
      title: "Entering Ophthalmic Care",
      shortTitle: "Entering Eye Care",
      outcome:
        "Explain the ophthalmic clinic team, patient journey, privacy basics, and safe beginner scope.",
      description:
        "A career-entry orientation for new learners, medical assistants, and new technicians joining an eye-care practice.",
      durationMinutes: 55,
      level: "Foundational",
      status: "published",
      objectives: [
        "Describe common roles in an ophthalmic clinic.",
        "Explain what an ophthalmic technician may observe, document, and escalate.",
        "Recognize privacy and professionalism basics.",
        "Use patient-friendly language when explaining the technician role.",
      ],
      topics: [
        "Ophthalmic careers",
        "Clinic flow",
        "Patient privacy",
        "Scope boundaries",
        "Escalation mindset",
      ],
      sourceIds: [
        "drive-bootcamp-curriculum",
        "drive-bootcamp-syllabus",
        "onet-ophthalmic-medical-technicians",
      ],
    },
    {
      id: "eye-anatomy-physiology-optics",
      moduleNumber: 2,
      title: "Eye Anatomy, Physiology, and Optics",
      shortTitle: "Anatomy and Optics",
      outcome:
        "Identify core eye structures and explain basic optical ideas in beginner-friendly language.",
      description:
        "Foundational anatomy, visual pathway, refractive error, prescriptions, and common ophthalmic abbreviations.",
      durationMinutes: 75,
      level: "Foundational",
      status: "scheduled",
      objectives: [
        "Identify major ocular structures.",
        "Explain the difference between myopia, hyperopia, astigmatism, and presbyopia.",
        "Connect cornea, lens, retina, and optic nerve to the visual pathway.",
        "Define common abbreviations used in eye-care documentation.",
      ],
      topics: [
        "Ocular structures",
        "Visual pathway",
        "Refractive errors",
        "Basic optics",
        "Prescription vocabulary",
      ],
      sourceIds: ["drive-bootcamp-curriculum", "drive-biological-camera"],
    },
    {
      id: "history-communication-documentation",
      moduleNumber: 3,
      title: "Patient History, Communication, and Documentation",
      shortTitle: "History and Documentation",
      outcome:
        "Collect a clear chief complaint and history while documenting only what was asked, observed, and reported.",
      description:
        "Chief complaint, history of present illness, ocular history, medication review, communication, and accurate documentation habits.",
      durationMinutes: 90,
      level: "Foundational",
      status: "scheduled",
      objectives: [
        "Gather a complete beginner-level ophthalmic history.",
        "Use pertinent positives and negatives accurately.",
        "Document patient-reported information clearly.",
        "Recognize when interpreter or accessibility support should be escalated.",
      ],
      topics: [
        "Chief complaint",
        "History of present illness",
        "Medication and allergy review",
        "Pertinent negatives",
        "Patient-centered communication",
      ],
      sourceIds: ["drive-bootcamp-curriculum", "drive-clinical-pattern-hpi"],
    },
    {
      id: "visual-acuity-pupils-motility",
      moduleNumber: 4,
      title: "Visual Acuity, Pupils, and Motility",
      shortTitle: "Acuity and Pupils",
      outcome:
        "Explain the purpose of vision, pupil, motility, and confrontation field checks.",
      description:
        "Distance and near acuity, pinhole testing, pupils, extraocular motility, confrontation fields, and escalation red flags.",
      durationMinutes: 80,
      level: "Foundational",
      status: "scheduled",
      objectives: [
        "Describe distance and near acuity workflow.",
        "Explain why pinhole testing is useful.",
        "Recognize basic pupil and motility documentation language.",
        "Escalate sudden vision change and other urgent symptoms.",
      ],
      topics: [
        "Distance acuity",
        "Near acuity",
        "Pinhole testing",
        "Pupils",
        "Extraocular motility",
        "Confrontation fields",
      ],
      sourceIds: ["drive-bootcamp-curriculum", "drive-clinical-pattern-hpi"],
    },
    {
      id: "tonometry-foundational-measurements",
      moduleNumber: 5,
      title: "Tonometry and Foundational Measurements",
      shortTitle: "Tonometry",
      outcome:
        "Understand IOP measurement concepts, sources of error, infection control, and when to repeat or escalate.",
      description:
        "IOP principles, tonometry methods, pachymetry context, keratometry, biometry, and equipment care.",
      durationMinutes: 85,
      level: "Intermediate",
      status: "scheduled",
      objectives: [
        "Explain intraocular pressure in simple terms.",
        "Compare common tonometry methods at a beginner level.",
        "Identify common measurement errors.",
        "Follow infection-control expectations for measurement equipment.",
      ],
      topics: [
        "IOP principles",
        "Tonometry methods",
        "Measurement reliability",
        "Pachymetry context",
        "Equipment cleaning",
      ],
      sourceIds: ["drive-bootcamp-curriculum"],
    },
    {
      id: "lensometry-refraction-optical-skills",
      moduleNumber: 6,
      title: "Lensometry, Refraction, and Optical Skills",
      shortTitle: "Lensometry",
      outcome:
        "Read basic spectacle prescription concepts and understand entry-level lensometry workflow.",
      description:
        "Lensometer operation, sphere, cylinder, axis, add power, prism, transposition concepts, and refraction support boundaries.",
      durationMinutes: 95,
      level: "Intermediate",
      status: "scheduled",
      objectives: [
        "Define sphere, cylinder, axis, add, and prism.",
        "Describe manual lensometry workflow.",
        "Explain why multiple prescription notations can describe equivalent optics.",
        "Stay inside entry-level scope during refraction support.",
      ],
      topics: [
        "Lensometer basics",
        "Prescription notation",
        "Minus and plus cylinder",
        "Add power",
        "Prism",
        "Refraction support scope",
      ],
      sourceIds: ["drive-bootcamp-curriculum"],
    },
    {
      id: "diagnostic-imaging-visual-fields",
      moduleNumber: 7,
      title: "Diagnostic Imaging and Visual Fields",
      shortTitle: "Imaging and Fields",
      outcome:
        "Recognize common imaging and visual-field test types and explain quality problems that require repeat testing.",
      description:
        "OCT, fundus photography, ultra-widefield imaging, automated perimetry, corneal topography, artifacts, and reliability.",
      durationMinutes: 100,
      level: "Intermediate",
      status: "scheduled",
      objectives: [
        "Describe OCT and fundus photography at a beginner level.",
        "Explain why test reliability matters.",
        "Recognize common visual field reliability problems.",
        "Document and report acquisition problems.",
      ],
      topics: [
        "OCT acquisition",
        "Fundus photography",
        "Ultra-widefield imaging",
        "Automated perimetry",
        "Artifacts",
        "Reliability",
      ],
      sourceIds: ["drive-bootcamp-curriculum"],
    },
    {
      id: "anterior-posterior-segment-foundations",
      moduleNumber: 8,
      title: "Anterior and Posterior Segment Foundations",
      shortTitle: "Eye Segment Basics",
      outcome:
        "Understand technician responsibilities around slit-lamp setup, dilation workflow, and common eye-region vocabulary.",
      description:
        "Slit-lamp mechanics, anterior-segment vocabulary, posterior-segment anatomy, dilation workflow, medication safety, and urgent symptoms.",
      durationMinutes: 95,
      level: "Intermediate",
      status: "scheduled",
      objectives: [
        "Explain anterior and posterior segment vocabulary.",
        "Describe technician responsibilities around slit-lamp setup.",
        "Understand dilation workflow and medication safety habits.",
        "Escalate urgent symptoms without diagnosing.",
      ],
      topics: [
        "Slit lamp setup",
        "Anterior segment",
        "Posterior segment",
        "Dilation workflow",
        "Medication safety",
        "Urgent symptoms",
      ],
      sourceIds: ["drive-bootcamp-curriculum"],
    },
    {
      id: "procedures-surgery-patient-safety",
      moduleNumber: 9,
      title: "Procedures, Surgery, and Patient Safety",
      shortTitle: "Procedures and Safety",
      outcome:
        "Explain beginner safety habits for procedure support, patient identification, time-outs, allergies, and clean technique.",
      description:
        "Aseptic awareness, minor procedure support, cataract and retinal surgery workflow, medication reconciliation, allergies, and never-event prevention.",
      durationMinutes: 85,
      level: "Advanced",
      status: "scheduled",
      objectives: [
        "Describe clean technique and aseptic awareness.",
        "Explain why patient identification and time-outs matter.",
        "Recognize allergy and medication reconciliation safety concerns.",
        "Understand the technician's support role in procedure workflow.",
      ],
      topics: [
        "Aseptic awareness",
        "Minor procedure support",
        "Surgery workflow",
        "Medication reconciliation",
        "Allergy checks",
        "Time-outs",
      ],
      sourceIds: ["drive-bootcamp-curriculum"],
    },
    {
      id: "clinic-readiness-career-launch",
      moduleNumber: 10,
      title: "Clinic Readiness and Career Launch",
      shortTitle: "Career Launch",
      outcome:
        "Prepare for supervised practice, interviews, Skills Passport use, and future certification pathway research.",
      description:
        "Integrated simulations, clinic teamwork, professionalism, Skills Passport, resume and interview prep, certification pathway orientation, and final assessment.",
      durationMinutes: 90,
      level: "Foundational",
      status: "scheduled",
      objectives: [
        "Use the Skills Passport as a supervised practice tool.",
        "Explain completion versus certification accurately.",
        "Prepare entry-level resume and interview talking points.",
        "Find current certification pathway information from official sources.",
      ],
      topics: [
        "Integrated simulations",
        "Teamwork",
        "Skills Passport",
        "Resume prep",
        "Interview prep",
        "Certification pathway research",
      ],
      sourceIds: ["drive-bootcamp-curriculum", "jcahpo-coa"],
    },
  ],
  skillsPassport: [
    {
      id: "patient-rooming-observation",
      moduleId: "entering-ophthalmic-care",
      title: "Patient rooming observation",
      verificationType: "supervisor-observed",
      observableCriteria: [
        "Introduces self and role clearly.",
        "Confirms patient identity using practice policy.",
        "Escalates questions outside beginner scope.",
      ],
      safetyCriticalErrors: [
        "Gives medical advice without provider direction.",
        "Skips required patient identity check.",
      ],
    },
  ],
};
