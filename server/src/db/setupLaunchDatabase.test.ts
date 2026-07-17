import { describe, expect, it } from "vitest";
import type { QueryParameters, Queryable } from "./postgres";
import {
  launchDatabaseSchemas,
  setupLaunchDatabase,
} from "./setupLaunchDatabase";

class FakeDatabase implements Queryable {
  readonly calls: Array<{ sql: string; params?: QueryParameters }> = [];

  async query<T extends Record<string, unknown>>(
    sql: string,
    params?: QueryParameters
  ): Promise<{ rows: T[] }> {
    this.calls.push({ sql, params });
    return { rows: [] };
  }
}

describe("setupLaunchDatabase", () => {
  it("applies commerce, auth, learning, and assessment schemas in launch order", async () => {
    const db = new FakeDatabase();

    const result = await setupLaunchDatabase({ db });

    expect(result.appliedSchemas.map(schema => schema.id)).toEqual([
      "commerce",
      "auth",
      "learning",
      "assessment",
    ]);
    expect(db.calls.map(call => call.sql)).toEqual(
      launchDatabaseSchemas.map(schema => schema.sql)
    );
    expect(result.appliedSchemas.flatMap(schema => schema.tables)).toEqual([
      "commerce_purchases",
      "commerce_enrollments",
      "commerce_practice_seat_packs",
      "commerce_practice_seat_assignments",
      "commerce_practice_inquiries",
      "commerce_learner_interests",
      "auth_users",
      "auth_magic_links",
      "auth_sessions",
      "learning_lesson_completions",
      "assessment_attempts",
      "assessment_question_results",
    ]);
  });
});
