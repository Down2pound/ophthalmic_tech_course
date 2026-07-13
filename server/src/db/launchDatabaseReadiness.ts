import {
  launchDatabaseSchemas,
  type LaunchDatabaseSchema,
} from "./setupLaunchDatabase";
import type { Queryable } from "./postgres";

export interface LaunchDatabaseReadinessStatus {
  schemaVerified: boolean;
  requiredTables: string[];
  checkedTableCount: number;
  missingTables: string[];
  checkFailed: boolean;
}

export const unverifiedLaunchDatabaseReadiness: LaunchDatabaseReadinessStatus =
  {
    schemaVerified: false,
    requiredTables: launchDatabaseSchemas.flatMap(schema => [...schema.tables]),
    checkedTableCount: 0,
    missingTables: launchDatabaseSchemas.flatMap(schema => [...schema.tables]),
    checkFailed: false,
  };

export async function getLaunchDatabaseReadiness({
  db,
  schemas = launchDatabaseSchemas,
}: {
  db: Queryable | null;
  schemas?: LaunchDatabaseSchema[];
}): Promise<LaunchDatabaseReadinessStatus> {
  const requiredTables = schemas.flatMap(schema => [...schema.tables]);

  if (!db) {
    return {
      schemaVerified: false,
      requiredTables,
      checkedTableCount: 0,
      missingTables: requiredTables,
      checkFailed: false,
    };
  }

  const missingTables: string[] = [];
  let checkedTableCount = 0;

  try {
    for (const tableName of requiredTables) {
      const result = await db.query<{ existing_table: string | null }>(
        "SELECT to_regclass($1) AS existing_table",
        [tableName]
      );

      checkedTableCount += 1;

      if (!result.rows[0]?.existing_table) {
        missingTables.push(tableName);
      }
    }
  } catch {
    return {
      schemaVerified: false,
      requiredTables,
      checkedTableCount,
      missingTables: requiredTables,
      checkFailed: true,
    };
  }

  return {
    schemaVerified: missingTables.length === 0,
    requiredTables,
    checkedTableCount,
    missingTables,
    checkFailed: false,
  };
}
