import type { LaunchDatabaseReadinessStatus } from "../db/launchDatabaseReadiness";
import {
  getDatabaseEnvironmentStatus,
  type EnvironmentMap,
} from "./environment";

export interface WebhookFulfillmentGateStatus {
  ready: boolean;
  warnings: string[];
  missingVariables: string[];
}

export function getWebhookFulfillmentGateStatus({
  env = process.env,
  databaseReadiness,
}: {
  env?: EnvironmentMap;
  databaseReadiness: LaunchDatabaseReadinessStatus;
}): WebhookFulfillmentGateStatus {
  const database = getDatabaseEnvironmentStatus(env);
  const warnings = [
    database.databaseConfigured
      ? null
      : `Database setup is missing: ${database.missingDatabaseVariables.join(", ")}.`,
    database.databaseConfigured && databaseReadiness.checkFailed
      ? "Launch database schema check failed. Confirm the database is reachable and run pnpm db:setup."
      : null,
    database.databaseConfigured && !databaseReadiness.schemaVerified
      ? `Launch database schema is not verified. Missing tables: ${databaseReadiness.missingTables.join(", ")}.`
      : null,
  ].filter((warning): warning is string => Boolean(warning));

  return {
    ready: database.databaseConfigured && databaseReadiness.schemaVerified,
    warnings,
    missingVariables: database.missingDatabaseVariables,
  };
}
