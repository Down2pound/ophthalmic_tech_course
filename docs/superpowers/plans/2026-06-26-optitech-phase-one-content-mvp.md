# OptiTech Phase One Content MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first real learner-ready version of OptiTech Academy by replacing scattered hard-coded curriculum data with one trusted course catalog, publishing Module 1 lessons, adding progress tracking, and making the public offer truthful.

**Architecture:** Keep the current React/Vite/Express app, but move course facts into shared TypeScript modules that both client and server can consume. Treat Google Drive and NotebookLM as source material, not production content, and require metadata before anything appears as published clinical education.

**Tech Stack:** React 19, Vite, TypeScript, Wouter, Tailwind 4, shadcn/Radix, Vitest, existing Express server.

---

## Kid-Simple Picture

Right now the app has course words in a few different boxes. Some boxes disagree. This plan makes one "master notebook" for the course, then teaches the website to read from that notebook.

Phase one does not build payments yet. It makes the course real enough that taking money later is honest.

## Files And Responsibilities

- Create `shared/course/types.ts`: shared types for courses, modules, lessons, reviews, sources, skills, and publication status.
- Create `shared/course/courseCatalog.ts`: the single ten-module OptiTech Academy course catalog.
- Create `shared/course/moduleOneLessons.ts`: production-draft Module 1 lesson content with source and review metadata.
- Create `shared/course/courseCatalog.test.ts`: tests that prove course IDs, module order, metadata, and publication rules are consistent.
- Create `shared/course/sourceInventory.ts`: safe source references for public-course candidates from Google Drive.
- Create `client/src/lib/progressStore.ts`: tiny local progress store used before real user accounts exist.
- Create `client/src/lib/progressStore.test.ts`: tests for progress saving, loading, reset, and completion math.
- Create `client/src/pages/Learn.tsx`: learner dashboard and Module 1 lesson player.
- Modify `client/src/App.tsx`: add `/learn` route.
- Modify `client/src/data/curriculum.ts`: make it an adapter that reads from the shared catalog.
- Modify `client/src/data/quizzes.ts`: align quiz IDs and Module 1 quiz copy with the canonical catalog.
- Modify `client/src/pages/Home.tsx`: remove unsupported claims, fake scarcity, and mismatched price; add honest preview and link into `/learn`.
- Modify `client/src/pages/Curriculum.tsx`: read from the canonical catalog and label unpublished modules clearly.
- Modify `client/src/components/EnrollmentForm.tsx`: change "7-day" or "10-day" hard promise wording to self-paced founding cohort wording.
- Modify `package.json`: add `test` and `test:watch` scripts.

## Task 1: Add Tests For The Canonical Course Contract

**Files:**
- Modify: `package.json`
- Create: `shared/course/courseCatalog.test.ts`

- [ ] **Step 1: Add test scripts**

Modify `package.json` scripts so this exact block is present:

```json
"scripts": {
  "dev": "vite --host",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "preview": "vite preview --host",
  "check": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "format": "prettier --write ."
}
```

- [ ] **Step 2: Write the failing catalog tests**

Create `shared/course/courseCatalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { optiTechCourse } from "./courseCatalog";
import { moduleOneLessons } from "./moduleOneLessons";

describe("optiTechCourse", () => {
  it("has one canonical ten-module sequence", () => {
    expect(optiTechCourse.id).toBe("optitech-foundations");
    expect(optiTechCourse.modules).toHaveLength(10);
    expect(optiTechCourse.modules.map((module) => module.moduleNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("uses stable lowercase module IDs", () => {
    expect(optiTechCourse.modules.map((module) => module.id)).toEqual([
      "entering-ophthalmic-care",
      "eye-anatomy-physiology-optics",
      "history-communication-documentation",
      "visual-acuity-pupils-motility",
      "tonometry-foundational-measurements",
      "lensometry-refraction-optical-skills",
      "diagnostic-imaging-visual-fields",
      "anterior-posterior-segment-foundations",
      "procedures-surgery-patient-safety",
      "clinic-readiness-career-launch",
    ]);
  });

  it("does not publish empty modules as finished content", () => {
    const publishedModules = optiTechCourse.modules.filter((module) => module.status === "published");
    expect(publishedModules.map((module) => module.moduleNumber)).toEqual([1]);

    const scheduledModules = optiTechCourse.modules.filter((module) => module.status === "scheduled");
    expect(scheduledModules.map((module) => module.moduleNumber)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("keeps hands-on skills separate from online completion", () => {
    const skillStatuses = optiTechCourse.skillsPassport.map((skill) => skill.verificationType);
    expect(skillStatuses).toContain("supervisor-observed");
    expect(skillStatuses).not.toContain("online-only");
  });
});

describe("moduleOneLessons", () => {
  it("publishes three starter lessons with review metadata", () => {
    expect(moduleOneLessons).toHaveLength(3);
    for (const lesson of moduleOneLessons) {
      expect(lesson.status).toBe("published");
      expect(lesson.review.clinicalReviewer).toBe("Clinical review required before production sale");
      expect(lesson.review.reviewStatus).toBe("draft-reviewed-for-structure");
      expect(lesson.sources.length).toBeGreaterThan(0);
      expect(lesson.scopeNote).toMatch(/does not teach diagnosis/i);
    }
  });
});
```

- [ ] **Step 3: Run tests and verify the correct failure**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- shared/course/courseCatalog.test.ts
```

Expected: FAIL because `shared/course/courseCatalog.ts` and `shared/course/moduleOneLessons.ts` do not exist yet.

- [ ] **Step 4: Commit the failing tests**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add package.json shared/course/courseCatalog.test.ts
& "$gitRoot\cmd\git.exe" commit -m "test: define canonical course contract"
```

## Task 2: Build The Shared Course Catalog

**Files:**
- Create: `shared/course/types.ts`
- Create: `shared/course/sourceInventory.ts`
- Create: `shared/course/courseCatalog.ts`
- Modify: `client/src/data/curriculum.ts`

- [ ] **Step 1: Create shared types**

Create `shared/course/types.ts`:

```ts
export type CourseAudience = "career-starter" | "medical-assistant-bridge" | "practice-onboarding";

export type PublicationStatus = "published" | "scheduled" | "draft";

export type VerificationType = "knowledge-check" | "supervisor-observed";

export interface CourseSource {
  id: string;
  title: string;
  sourceType: "google-doc" | "pdf" | "official-website" | "repo";
  url: string;
  classification: "public-course-candidate" | "official-reference" | "practice-only" | "excluded";
}

export interface ContentReview {
  author: string;
  clinicalReviewer: string;
  reviewStatus: "draft-reviewed-for-structure" | "clinically-reviewed";
  reviewDate: string;
  nextReviewDate: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortTitle: string;
  outcome: string;
  description: string;
  durationMinutes: number;
  level: "Foundational" | "Intermediate" | "Advanced";
  status: PublicationStatus;
  objectives: string[];
  topics: string[];
  sourceIds: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  status: PublicationStatus;
  outcome: string;
  body: string[];
  clinicContext: string;
  commonMistakes: string[];
  patientFriendlyScript: string;
  scenarioPrompt: string;
  scopeNote: string;
  sources: CourseSource[];
  review: ContentReview;
}

export interface SkillPassportItem {
  id: string;
  moduleId: string;
  title: string;
  verificationType: VerificationType;
  observableCriteria: string[];
  safetyCriticalErrors: string[];
}

export interface CourseCatalog {
  id: string;
  title: string;
  version: string;
  audience: CourseAudience[];
  promise: string;
  limitations: string[];
  modules: CourseModule[];
  skillsPassport: SkillPassportItem[];
}
```

- [ ] **Step 2: Create safe source references**

Create `shared/course/sourceInventory.ts`:

```ts
import type { CourseSource } from "./types";

export const courseSources: CourseSource[] = [
  {
    id: "drive-bootcamp-curriculum",
    title: "Practical Ophthalmic Technician Foundations Bootcamp Curriculum",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1zKSwNXOKUMaKipL1iL8eFO3Pc85FFoflA_5r_n0Vr3c",
    classification: "public-course-candidate",
  },
  {
    id: "drive-bootcamp-syllabus",
    title: "Practical Ophthalmic Technician Foundations: 10-Day Bootcamp Syllabus",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1aUtdx9yVXqRBMgAT7RnREw6Cz-Wx7m1zYd4ZCWcnF0g",
    classification: "public-course-candidate",
  },
  {
    id: "drive-clinical-pattern-hpi",
    title: "Clinical Pattern Recognition and HPI Cheat Sheet",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1kTVt669_kiaqS6M16ptq3AAVE9LyfptM79RxyC-GyAs",
    classification: "public-course-candidate",
  },
  {
    id: "drive-biological-camera",
    title: "The Biological Camera",
    sourceType: "pdf",
    url: "https://drive.google.com/file/d/1csJ5mjX4Nb2-4HdxBrcozqunp55nWTFf",
    classification: "public-course-candidate",
  },
  {
    id: "jcahpo-coa",
    title: "IJCAHPO Certified Ophthalmic Assistant Certification",
    sourceType: "official-website",
    url: "https://www.jcahpo.org/certification/certifications/certified-ophthalmic-assistant/",
    classification: "official-reference",
  },
  {
    id: "onet-ophthalmic-medical-technicians",
    title: "O*NET Ophthalmic Medical Technicians",
    sourceType: "official-website",
    url: "https://www.onetonline.org/link/summary/29-2057.00",
    classification: "official-reference",
  },
];

export function getCourseSource(sourceId: string): CourseSource {
  const source = courseSources.find((item) => item.id === sourceId);
  if (!source) {
    throw new Error(`Unknown course source: ${sourceId}`);
  }
  return source;
}
```

- [ ] **Step 3: Create the canonical catalog**

Create `shared/course/courseCatalog.ts` with this exact file body. Module 1 status is `published`; Modules 2 through 10 status is `scheduled`.

```ts
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
      outcome: "Explain the ophthalmic clinic team, patient journey, privacy basics, and safe beginner scope.",
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
      sourceIds: ["drive-bootcamp-curriculum", "drive-bootcamp-syllabus", "onet-ophthalmic-medical-technicians"],
    },
    {
      id: "eye-anatomy-physiology-optics",
      moduleNumber: 2,
      title: "Eye Anatomy, Physiology, and Optics",
      shortTitle: "Anatomy and Optics",
      outcome: "Identify core eye structures and explain basic optical ideas in beginner-friendly language.",
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
      outcome: "Collect a clear chief complaint and history while documenting only what was asked, observed, and reported.",
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
      outcome: "Explain the purpose of vision, pupil, motility, and confrontation field checks.",
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
      outcome: "Understand IOP measurement concepts, sources of error, infection control, and when to repeat or escalate.",
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
      outcome: "Read basic spectacle prescription concepts and understand entry-level lensometry workflow.",
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
      outcome: "Recognize common imaging and visual-field test types and explain quality problems that require repeat testing.",
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
      outcome: "Understand technician responsibilities around slit-lamp setup, dilation workflow, and common eye-region vocabulary.",
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
      outcome: "Explain beginner safety habits for procedure support, patient identification, time-outs, allergies, and clean technique.",
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
      outcome: "Prepare for supervised practice, interviews, Skills Passport use, and future certification pathway research.",
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
```

- [ ] **Step 4: Replace client curriculum data with an adapter**

Replace `client/src/data/curriculum.ts`:

```ts
import { optiTechCourse } from "@shared/course/courseCatalog";
import type { CourseModule } from "@shared/course/types";

export interface CurriculumModule {
  id: string;
  day: number;
  title: string;
  description: string;
  objectives: string[];
  topics: string[];
  assets: string[];
  icon: string;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  status: CourseModule["status"];
  outcome: string;
}

const levelToDifficulty: Record<CourseModule["level"], CurriculumModule["difficulty"]> = {
  Foundational: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};

const moduleIcons = ["Eye", "BookOpen", "ClipboardList", "Activity", "Gauge", "Glasses", "ScanEye", "Search", "ShieldCheck", "GraduationCap"];

export const curriculumModules: CurriculumModule[] = optiTechCourse.modules.map((module, index) => ({
  id: module.id,
  day: module.moduleNumber,
  title: module.title,
  description: module.description,
  objectives: module.objectives,
  topics: module.topics,
  assets: module.status === "published" ? ["Lesson", "Knowledge Check", "Skills Passport"] : ["Scheduled Curriculum"],
  icon: moduleIcons[index] ?? "BookOpen",
  duration: `${Math.round(module.durationMinutes / 5) * 5} minutes`,
  difficulty: levelToDifficulty[module.level],
  status: module.status,
  outcome: module.outcome,
}));

export const getModuleById = (id: string): CurriculumModule | undefined => {
  return curriculumModules.find((module) => module.id === id);
};

export const getModulesByDay = (day: number): CurriculumModule[] => {
  return curriculumModules.filter((module) => module.day === day);
};

export const getModulesByDifficulty = (
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): CurriculumModule[] => {
  return curriculumModules.filter((module) => module.difficulty === difficulty);
};

export const getTotalCourseDuration = (): number => {
  return optiTechCourse.modules.reduce((total, module) => total + module.durationMinutes / 60, 0);
};
```

- [ ] **Step 5: Run catalog tests**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- shared/course/courseCatalog.test.ts
```

Expected: FAIL only because `moduleOneLessons.ts` is not created yet. The catalog-specific tests should pass.

- [ ] **Step 6: Commit the catalog**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add shared/course client/src/data/curriculum.ts
& "$gitRoot\cmd\git.exe" commit -m "feat: add canonical course catalog"
```

## Task 3: Publish Module 1 Starter Lessons

**Files:**
- Create: `shared/course/moduleOneLessons.ts`
- Modify: `client/src/data/quizzes.ts`

- [ ] **Step 1: Create Module 1 lessons**

Create `shared/course/moduleOneLessons.ts`:

```ts
import { getCourseSource } from "./sourceInventory";
import type { ContentReview, Lesson } from "./types";

const draftReview: ContentReview = {
  author: "OptiTech Academy",
  clinicalReviewer: "Clinical review required before production sale",
  reviewStatus: "draft-reviewed-for-structure",
  reviewDate: "2026-06-26",
  nextReviewDate: "2026-09-26",
};

export const moduleOneLessons: Lesson[] = [
  {
    id: "m1-l1-what-techs-do",
    moduleId: "entering-ophthalmic-care",
    title: "What Ophthalmic Technicians Do",
    durationMinutes: 12,
    status: "published",
    outcome: "Describe the technician role without overstating medical authority.",
    body: [
      "Ophthalmic technicians help the eye-care team collect accurate information before the provider examines the patient.",
      "Common beginner tasks include confirming history, checking vision, preparing rooms, helping with diagnostic testing, documenting carefully, and telling the provider when something needs attention.",
      "The technician role is powerful because small details can change the visit. A missed medication, wrong eye, new symptom, or unreliable test can affect care.",
    ],
    clinicContext:
      "A technician is often the first clinical person the patient meets. Calm, accurate, respectful work helps the provider make better decisions.",
    commonMistakes: [
      "Guessing instead of asking a supervisor.",
      "Using medical words the patient does not understand.",
      "Documenting what was not actually asked or observed.",
    ],
    patientFriendlyScript:
      "I am part of the clinical team. I will gather your history and perform some starting tests so the doctor has accurate information for your exam.",
    scenarioPrompt:
      "A patient asks whether their blurry vision means they have glaucoma. Choose the answer that stays inside the technician role.",
    scopeNote:
      "This lesson does not teach diagnosis. Learners practice role clarity, documentation, and escalation.",
    sources: [
      getCourseSource("drive-bootcamp-curriculum"),
      getCourseSource("onet-ophthalmic-medical-technicians"),
    ],
    review: draftReview,
  },
  {
    id: "m1-l2-patient-journey",
    moduleId: "entering-ophthalmic-care",
    title: "The Eye Clinic Patient Journey",
    durationMinutes: 15,
    status: "published",
    outcome: "Map the patient visit from check-in through provider handoff.",
    body: [
      "A typical eye visit moves from scheduling and check-in to technician workup, diagnostic testing, provider examination, checkout, and follow-up instructions.",
      "Technicians help the handoff work smoothly by checking identity, updating history, noting the chief complaint, recording testing quality, and flagging urgent symptoms.",
      "Different practices use different equipment and workflows. The important beginner habit is to understand the next person who needs your information.",
    ],
    clinicContext:
      "Clinic flow is like a relay race. If the technician passes clear information forward, the provider can move faster and safer.",
    commonMistakes: [
      "Treating every visit type the same.",
      "Forgetting to mention testing problems.",
      "Assuming the provider already knows a new symptom.",
    ],
    patientFriendlyScript:
      "I will start by confirming why you are here today and checking a few measurements. Then I will make sure the doctor has the key details.",
    scenarioPrompt:
      "A patient reports new flashes and floaters during a routine visit. Decide what should happen next.",
    scopeNote:
      "This lesson does not teach diagnosis. Learners practice recognizing when information should be escalated.",
    sources: [
      getCourseSource("drive-bootcamp-syllabus"),
      getCourseSource("drive-clinical-pattern-hpi"),
    ],
    review: draftReview,
  },
  {
    id: "m1-l3-professional-boundaries",
    moduleId: "entering-ophthalmic-care",
    title: "Professional Boundaries, Privacy, and Escalation",
    durationMinutes: 18,
    status: "published",
    outcome: "Choose safe responses when patients ask questions outside beginner scope.",
    body: [
      "Patients may ask technicians for results, predictions, medication advice, or reassurance. A safe technician does not guess.",
      "Privacy means discussing patient information only with the care team members who need it for the patient's care.",
      "Escalation is a strength. New pain, sudden vision change, wrong-eye confusion, medication allergy concerns, and uncertain instructions should be brought to the provider or supervisor.",
    ],
    clinicContext:
      "Professional boundaries protect the patient, the practice, and the learner. Clear escalation is one of the most important beginner skills.",
    commonMistakes: [
      "Answering a medical question because the patient seems anxious.",
      "Talking about patient details in public spaces.",
      "Waiting until the end of the visit to report urgent symptoms.",
    ],
    patientFriendlyScript:
      "That is an important question for the doctor. I will make sure it is brought to their attention.",
    scenarioPrompt:
      "A patient asks if they should stop an eye drop because it burns. Select the response that protects safety and scope.",
    scopeNote:
      "This lesson does not teach diagnosis or medication management. Learners practice privacy and escalation habits.",
    sources: [
      getCourseSource("drive-bootcamp-curriculum"),
      getCourseSource("drive-clinical-pattern-hpi"),
    ],
    review: draftReview,
  },
];
```

- [ ] **Step 2: Align Module 1 quiz**

In `client/src/data/quizzes.ts`, update the first quiz object only:

```ts
{
  id: "quiz-entering-ophthalmic-care",
  title: "Module 1: Entering Ophthalmic Care",
  description: "Check your understanding of clinic roles, privacy, scope, and escalation.",
  day: 1,
  passingScore: 80,
  questions: [
    {
      id: "m1-q1",
      question: "A new ophthalmic technician should describe their role as:",
      type: "multiple-choice",
      options: [
        "The person who diagnoses the eye problem",
        "A clinical team member who gathers accurate information and performs starting tests",
        "The person who decides whether surgery is needed",
        "A billing specialist who schedules follow-up care",
      ],
      correctAnswer: "A clinical team member who gathers accurate information and performs starting tests",
      explanation:
        "Entry-level technicians support the eye-care team by gathering information, testing carefully, documenting, and escalating concerns.",
    },
    {
      id: "m1-q2",
      question: "If a patient asks whether their symptoms mean they have glaucoma, the safest beginner response is:",
      type: "multiple-choice",
      options: [
        "Yes, because blurry vision usually means glaucoma",
        "No, glaucoma never causes blurry vision",
        "That is a diagnosis question for the provider, and I will make sure they know your concern",
        "Search the internet with the patient",
      ],
      correctAnswer: "That is a diagnosis question for the provider, and I will make sure they know your concern",
      explanation:
        "The technician should acknowledge the concern, avoid diagnosis, and escalate the question to the provider.",
    },
    {
      id: "m1-q3",
      question: "Privacy means patient details should be discussed only with care team members who need the information for care.",
      type: "true-false",
      correctAnswer: "True",
      explanation:
        "Patient information should not be discussed casually or in public spaces.",
    },
    {
      id: "m1-q4",
      question: "Which situation should be escalated promptly?",
      type: "multiple-choice",
      options: [
        "A patient asks where the restroom is",
        "A patient reports sudden new flashes and floaters",
        "A patient asks for a printed appointment reminder",
        "A patient says the waiting room is cold",
      ],
      correctAnswer: "A patient reports sudden new flashes and floaters",
      explanation:
        "Sudden flashes and floaters can signal an urgent eye problem and should be brought to the provider or supervisor promptly.",
    }
  ],
  timeLimit: 15,
}
```

- [ ] **Step 3: Run tests**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- shared/course/courseCatalog.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit the lessons**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add shared/course/moduleOneLessons.ts client/src/data/quizzes.ts
& "$gitRoot\cmd\git.exe" commit -m "feat: publish module one starter lessons"
```

## Task 4: Add Local Learner Progress

**Files:**
- Create: `client/src/lib/progressStore.ts`
- Create: `client/src/lib/progressStore.test.ts`

- [ ] **Step 1: Write failing progress tests**

Create `client/src/lib/progressStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  getProgressPercent,
  loadProgress,
  markLessonComplete,
  resetProgress,
  saveProgress,
  type StorageLike,
} from "./progressStore";

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

let storage: StorageLike;

beforeEach(() => {
  storage = createMemoryStorage();
});

describe("progressStore", () => {
  it("starts empty", () => {
    const progress = createEmptyProgress();
    expect(progress.completedLessonIds).toEqual([]);
    expect(progress.quizScores).toEqual({});
  });

  it("saves and loads progress", () => {
    const progress = markLessonComplete(createEmptyProgress(), "m1-l1-what-techs-do");
    saveProgress(storage, progress);
    expect(loadProgress(storage).completedLessonIds).toEqual(["m1-l1-what-techs-do"]);
  });

  it("does not duplicate completed lessons", () => {
    const once = markLessonComplete(createEmptyProgress(), "m1-l1-what-techs-do");
    const twice = markLessonComplete(once, "m1-l1-what-techs-do");
    expect(twice.completedLessonIds).toEqual(["m1-l1-what-techs-do"]);
  });

  it("calculates completion percentage", () => {
    const progress = markLessonComplete(createEmptyProgress(), "m1-l1-what-techs-do");
    expect(getProgressPercent(progress, 3)).toBe(33);
  });

  it("resets saved progress", () => {
    saveProgress(storage, markLessonComplete(createEmptyProgress(), "m1-l1-what-techs-do"));
    resetProgress(storage);
    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- client/src/lib/progressStore.test.ts
```

Expected: FAIL because `progressStore.ts` does not exist.

- [ ] **Step 3: Implement progress store**

Create `client/src/lib/progressStore.ts`:

```ts
const STORAGE_KEY = "optitech.learning.progress.v1";

export interface LearnerProgress {
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  updatedAt: string | null;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createEmptyProgress(): LearnerProgress {
  return {
    completedLessonIds: [],
    quizScores: {},
    updatedAt: null,
  };
}

export function loadProgress(storage: StorageLike): LearnerProgress {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return createEmptyProgress();

  try {
    const parsed = JSON.parse(raw) as LearnerProgress;
    if (!Array.isArray(parsed.completedLessonIds) || typeof parsed.quizScores !== "object") {
      return createEmptyProgress();
    }
    return {
      completedLessonIds: parsed.completedLessonIds,
      quizScores: parsed.quizScores ?? {},
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(storage: StorageLike, progress: LearnerProgress): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonComplete(progress: LearnerProgress, lessonId: string): LearnerProgress {
  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  return {
    ...progress,
    completedLessonIds,
    updatedAt: new Date().toISOString(),
  };
}

export function saveQuizScore(progress: LearnerProgress, quizId: string, score: number): LearnerProgress {
  return {
    ...progress,
    quizScores: {
      ...progress.quizScores,
      [quizId]: score,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getProgressPercent(progress: LearnerProgress, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  return Math.round((progress.completedLessonIds.length / totalLessons) * 100);
}

export function resetProgress(storage: StorageLike): void {
  storage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: Run tests**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- client/src/lib/progressStore.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit progress store**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client/src/lib/progressStore.ts client/src/lib/progressStore.test.ts
& "$gitRoot\cmd\git.exe" commit -m "feat: add local learner progress"
```

## Task 5: Add The Learner Dashboard And Lesson Player

**Files:**
- Create: `client/src/pages/Learn.tsx`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Create learner page**

Create `client/src/pages/Learn.tsx`. It must:

- Show Module 1 lessons from `moduleOneLessons`.
- Show completion percentage from `progressStore`.
- Let the learner select a lesson.
- Let the learner mark a lesson complete.
- Show scope note and sources.
- Avoid saying hands-on skills are verified.

Use this component structure:

```tsx
import { moduleOneLessons } from "@shared/course/moduleOneLessons";
import { optiTechCourse } from "@shared/course/courseCatalog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, ExternalLink, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import {
  createEmptyProgress,
  getProgressPercent,
  loadProgress,
  markLessonComplete,
  saveProgress,
} from "@/lib/progressStore";

const storage = typeof window === "undefined" ? null : window.localStorage;

export default function Learn() {
  const [selectedLessonId, setSelectedLessonId] = useState(moduleOneLessons[0]?.id);
  const [progress, setProgress] = useState(() => (storage ? loadProgress(storage) : createEmptyProgress()));

  const selectedLesson = useMemo(
    () => moduleOneLessons.find((lesson) => lesson.id === selectedLessonId) ?? moduleOneLessons[0],
    [selectedLessonId]
  );

  const completePercent = getProgressPercent(progress, moduleOneLessons.length);
  const moduleOne = optiTechCourse.modules[0];

  const completeLesson = () => {
    if (!selectedLesson || !storage) return;
    const nextProgress = markLessonComplete(progress, selectedLesson.id);
    setProgress(nextProgress);
    saveProgress(storage, nextProgress);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">OptiTech Academy</p>
            <h1 className="mt-2 text-3xl font-bold">{moduleOne.title}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{moduleOne.outcome}</p>
          </div>
          <a href="/">
            <Button variant="outline">Back to course home</Button>
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Module progress</span>
              <span className="text-sm text-slate-600">{completePercent}%</span>
            </div>
            <Progress className="mt-3" value={completePercent} />
          </Card>

          <Card className="overflow-hidden">
            {moduleOneLessons.map((lesson) => {
              const complete = progress.completedLessonIds.includes(lesson.id);
              const active = selectedLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  className={`flex w-full items-start gap-3 border-b px-4 py-4 text-left last:border-b-0 ${
                    active ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  {complete ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                  ) : (
                    <BookOpen className="mt-1 h-5 w-5 text-blue-700" />
                  )}
                  <span>
                    <span className="block font-semibold">{lesson.title}</span>
                    <span className="text-sm text-slate-600">{lesson.durationMinutes} minutes</span>
                  </span>
                </button>
              );
            })}
          </Card>
        </aside>

        {selectedLesson && (
          <article className="space-y-6">
            <Card className="p-6">
              <p className="text-sm font-semibold text-blue-700">Lesson</p>
              <h2 className="mt-2 text-3xl font-bold">{selectedLesson.title}</h2>
              <p className="mt-3 text-lg text-slate-700">{selectedLesson.outcome}</p>
              <div className="mt-6 space-y-4">
                {selectedLesson.body.map((paragraph) => (
                  <p key={paragraph} className="leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="grid gap-4 p-6 md:grid-cols-2">
              <section>
                <h3 className="font-semibold">In the clinic</h3>
                <p className="mt-2 text-slate-700">{selectedLesson.clinicContext}</p>
              </section>
              <section>
                <h3 className="font-semibold">Patient-friendly words</h3>
                <p className="mt-2 rounded-md bg-slate-100 p-3 text-slate-700">
                  {selectedLesson.patientFriendlyScript}
                </p>
              </section>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold">Common mistakes to avoid</h3>
              <ul className="mt-3 space-y-2">
                {selectedLesson.commonMistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-2 text-slate-700">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold">Scenario practice</h3>
              <p className="mt-2 text-slate-700">{selectedLesson.scenarioPrompt}</p>
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {selectedLesson.scopeNote}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold">Sources and review status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Review: {selectedLesson.review.reviewStatus}. Reviewer: {selectedLesson.review.clinicalReviewer}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLesson.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                  >
                    {source.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </Card>

            <Button className="w-full md:w-auto" onClick={completeLesson}>
              Mark lesson complete
            </Button>
          </article>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add route**

Modify `client/src/App.tsx`:

```tsx
import Learn from "./pages/Learn";
```

Add the route before the 404 route:

```tsx
<Route path={"/learn"} component={Learn} />
```

- [ ] **Step 3: Run typecheck**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
```

Expected: PASS.

- [ ] **Step 4: Commit learner page**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client/src/pages/Learn.tsx client/src/App.tsx
& "$gitRoot\cmd\git.exe" commit -m "feat: add learner dashboard"
```

## Task 6: Make The Public Pages Honest And Cleaner

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Modify: `client/src/pages/Curriculum.tsx`
- Modify: `client/src/components/EnrollmentForm.tsx`

- [ ] **Step 1: Fix homepage claims**

In `client/src/pages/Home.tsx`:

- Change price from `$699` to `$199`.
- Replace "lifetime access" with "12 months of course access".
- Remove "Limited spots available this month".
- Remove "65,000+", "16%", and "86%" stats.
- Replace "Join thousands" and "Join hundreds" claims with founding learner language.
- Add a button linking to `/learn` labeled `Preview Module 1`.

Use this stats array:

```ts
const stats = [
  { number: "10", label: "Planned modules" },
  { number: "3", label: "Module 1 starter lessons" },
  { number: "80%", label: "Target passing score" },
  { number: "12 mo", label: "Founding learner access" },
];
```

- [ ] **Step 2: Label scheduled modules on curriculum page**

In `client/src/pages/Curriculum.tsx`, show `Preview available` for Module 1 and `Scheduled content` for Modules 2 through 10 by reading `module.status`.

Use button text:

```tsx
{module.status === "published" ? "Preview Module" : "Scheduled Content"}
```

When `module.status === "published"`, link the button to `/learn`.

- [ ] **Step 3: Fix enrollment form copy**

In `client/src/components/EnrollmentForm.tsx`, replace any "7-day intensive" or rigid "10-day" enrollment promise with:

```tsx
"Founding access includes the self-paced course preview, published Module 1 lessons, and access to additional modules as they are released."
```

- [ ] **Step 4: Run checks**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

Expected: all commands PASS.

- [ ] **Step 5: Commit public page cleanup**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client/src/pages/Home.tsx client/src/pages/Curriculum.tsx client/src/components/EnrollmentForm.tsx
& "$gitRoot\cmd\git.exe" commit -m "feat: make phase one offer truthful"
```

## Task 7: Browser Verification

**Files:**
- No source files unless verification reveals a bug.

- [ ] **Step 1: Start local dev server**

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm dev
```

Expected: Vite prints a local URL, usually `http://localhost:3000/`.

- [ ] **Step 2: Verify pages manually in browser**

Open:

- `http://localhost:3000/`
- `http://localhost:3000/curriculum`
- `http://localhost:3000/learn`

Check:

- No broken emoji mojibake is visible.
- The home page does not show unsupported success numbers or fake scarcity.
- The curriculum page clearly marks scheduled modules.
- The learner page lets a learner open all three Module 1 lessons.
- The progress bar moves after marking lessons complete.
- Source links render and open in new tabs.
- Text fits on mobile width around 390 px and desktop width around 1440 px.

- [ ] **Step 3: Fix any found rendering issue**

If verification finds a rendering issue, make the smallest source edit that directly fixes the visible problem, then rerun:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

- [ ] **Step 4: Commit verification fixes**

If files changed during verification:

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client shared package.json
& "$gitRoot\cmd\git.exe" commit -m "fix: polish phase one learner experience"
```

## Final Verification Gate

Run:

```powershell
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

All three commands must pass before the branch is ready for review.

## Self-Review Notes

- Spec coverage: This plan covers the first commercial milestone foundation: truthful storefront, published Module 1 content, canonical catalog, progress, and source governance. It intentionally leaves Stripe, authentication, organization seats, certificates, and database persistence for separate plans because those are different subsystems.
- Completion scan: The plan contains no empty file instructions. Every created file has concrete code or explicit acceptance checks.
- Type consistency: `CourseModule`, `Lesson`, `CourseCatalog`, and progress types are defined before they are consumed. IDs in tests, catalog, lesson content, and learner page use the same stable strings.
