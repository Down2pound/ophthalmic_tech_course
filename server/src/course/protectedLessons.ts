import { optiTechCourse } from "../../../shared/course/courseCatalog";
import { moduleOneLessons } from "../../../shared/course/moduleOneLessons";
import type { CourseModule, Lesson } from "../../../shared/course/types";
import type { LearnerSessionAccess } from "../auth/sessionAccess";

export interface ProtectedModuleOneLessonsPayload {
  module: CourseModule;
  lessons: Lesson[];
  access: Extract<LearnerSessionAccess, { authenticated: true; hasAccess: true }>;
}

export type ProtectedModuleOneLessonsResponse =
  | {
      status: 200;
      payload: ProtectedModuleOneLessonsPayload;
    }
  | {
      status: 401 | 403;
      payload: {
        error: string;
      };
    };

export function getProtectedModuleOneLessons(
  access: LearnerSessionAccess
): ProtectedModuleOneLessonsResponse {
  if (!access.authenticated) {
    return {
      status: 401,
      payload: {
        error: access.reason,
      },
    };
  }

  if (!access.hasAccess) {
    return {
      status: 403,
      payload: {
        error: access.reason,
      },
    };
  }

  const module = optiTechCourse.modules.find(
    (courseModule) => courseModule.id === "entering-ophthalmic-care"
  );

  if (!module) {
    return {
      status: 403,
      payload: {
        error: "Published course module is unavailable.",
      },
    };
  }

  return {
    status: 200,
    payload: {
      module,
      lessons: moduleOneLessons,
      access,
    },
  };
}
