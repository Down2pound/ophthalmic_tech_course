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

const levelToDifficulty: Record<
  CourseModule["level"],
  CurriculumModule["difficulty"]
> = {
  Foundational: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};

const moduleIcons = [
  "Eye",
  "BookOpen",
  "ClipboardList",
  "Activity",
  "Gauge",
  "Glasses",
  "ScanEye",
  "Search",
  "ShieldCheck",
  "GraduationCap",
];

export const curriculumModules: CurriculumModule[] = optiTechCourse.modules.map(
  (module, index) => ({
    id: module.id,
    day: module.moduleNumber,
    title: module.title,
    description: module.description,
    objectives: module.objectives,
    topics: module.topics,
    assets:
      module.status === "published"
        ? ["Lesson", "Knowledge Check", "Skills Passport"]
        : ["Scheduled Curriculum"],
    icon: moduleIcons[index] ?? "BookOpen",
    duration: `${Math.round(module.durationMinutes / 5) * 5} minutes`,
    difficulty: levelToDifficulty[module.level],
    status: module.status,
    outcome: module.outcome,
  })
);

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
  return optiTechCourse.modules.reduce(
    (total, module) => total + module.durationMinutes / 60,
    0
  );
};
