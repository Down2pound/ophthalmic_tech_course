import type { Queryable } from "../db/postgres";
import {
  buildModuleLessonProgress,
  normalizeLearnerEmail,
  sortLessonCompletions,
  type LessonCompletionRecord,
  type LessonProgressStore,
} from "./lessonProgressStore";

interface LessonCompletionRow extends Record<string, unknown> {
  id: string;
  learner_email: string;
  module_id: string;
  lesson_id: string;
  completed_at: Date | string;
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapCompletionRow(row: LessonCompletionRow): LessonCompletionRecord {
  return {
    id: row.id,
    learnerEmail: row.learner_email,
    moduleId: row.module_id,
    lessonId: row.lesson_id,
    completedAt: toIsoString(row.completed_at),
  };
}

export function createPostgresLessonProgressStore(
  db: Queryable
): LessonProgressStore {
  return {
    async recordLessonCompletion(completion) {
      const result = await db.query<LessonCompletionRow>(
        `
        INSERT INTO learning_lesson_completions (
          id, learner_email, module_id, lesson_id, completed_at
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (learner_email, module_id, lesson_id) DO NOTHING
        RETURNING *
        `,
        [
          completion.id,
          normalizeLearnerEmail(completion.learnerEmail),
          completion.moduleId,
          completion.lessonId,
          completion.completedAt,
        ]
      );

      if (result.rows[0]) {
        return { created: true, completion: mapCompletionRow(result.rows[0]) };
      }

      const existing = await db.query<LessonCompletionRow>(
        `
        SELECT *
        FROM learning_lesson_completions
        WHERE learner_email = $1 AND module_id = $2 AND lesson_id = $3
        `,
        [
          normalizeLearnerEmail(completion.learnerEmail),
          completion.moduleId,
          completion.lessonId,
        ]
      );

      return { created: false, completion: mapCompletionRow(existing.rows[0]) };
    },
    async listCompletions() {
      const result = await db.query<LessonCompletionRow>(
        `
        SELECT *
        FROM learning_lesson_completions
        ORDER BY completed_at ASC
        `
      );

      return sortLessonCompletions(result.rows.map(mapCompletionRow));
    },
    async findCompletionsByLearnerAndModule(learnerEmail, moduleId) {
      const result = await db.query<LessonCompletionRow>(
        `
        SELECT *
        FROM learning_lesson_completions
        WHERE learner_email = $1 AND module_id = $2
        ORDER BY completed_at ASC
        `,
        [normalizeLearnerEmail(learnerEmail), moduleId]
      );

      return sortLessonCompletions(result.rows.map(mapCompletionRow));
    },
    async getModuleLessonProgress({ learnerEmail, moduleId, lessonIds }) {
      return buildModuleLessonProgress({
        learnerEmail,
        moduleId,
        lessonIds,
        completions: await this.findCompletionsByLearnerAndModule(
          learnerEmail,
          moduleId
        ),
      });
    },
  };
}
