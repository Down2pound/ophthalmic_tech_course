import {
  assessmentSchemaSql,
  assessmentSchemaTables,
} from "../assessments/assessmentSchema";
import { authSchemaSql, authSchemaTables } from "../auth/authSchema";
import {
  commerceSchemaSql,
  commerceSchemaTables,
} from "../commerce/commerceSchema";
import type { Queryable } from "./postgres";

export interface LaunchDatabaseSchema {
  id: "commerce" | "auth" | "assessment";
  tables: readonly string[];
  sql: string;
}

export interface LaunchDatabaseSetupResult {
  appliedSchemas: Array<{
    id: LaunchDatabaseSchema["id"];
    tables: readonly string[];
  }>;
}

export const launchDatabaseSchemas: LaunchDatabaseSchema[] = [
  {
    id: "commerce",
    tables: commerceSchemaTables,
    sql: commerceSchemaSql,
  },
  {
    id: "auth",
    tables: authSchemaTables,
    sql: authSchemaSql,
  },
  {
    id: "assessment",
    tables: assessmentSchemaTables,
    sql: assessmentSchemaSql,
  },
];

export async function setupLaunchDatabase({
  db,
  schemas = launchDatabaseSchemas,
}: {
  db: Queryable;
  schemas?: LaunchDatabaseSchema[];
}): Promise<LaunchDatabaseSetupResult> {
  const appliedSchemas: LaunchDatabaseSetupResult["appliedSchemas"] = [];

  for (const schema of schemas) {
    await db.query(schema.sql);
    appliedSchemas.push({
      id: schema.id,
      tables: schema.tables,
    });
  }

  return { appliedSchemas };
}
