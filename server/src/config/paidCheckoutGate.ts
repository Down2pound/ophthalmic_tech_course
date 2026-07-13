import type { LaunchDatabaseReadinessStatus } from "../db/launchDatabaseReadiness";
import {
  getAlertAdminEnvironmentStatus,
  getAuthEnvironmentStatus,
  getClinicalReviewEnvironmentStatus,
  getCommerceEnvironmentStatus,
  getDatabaseEnvironmentStatus,
  getPracticeSeatEnvironmentStatus,
  type EnvironmentMap,
} from "./environment";

export interface PaidCheckoutGateInput {
  env?: EnvironmentMap;
  databaseReadiness: LaunchDatabaseReadinessStatus;
}

export interface PaidCheckoutGateStatus {
  ready: boolean;
  warnings: string[];
  missingVariables: string[];
}

function missingWarning(
  label: string,
  missingVariables: string[]
): string | null {
  if (missingVariables.length === 0) return null;
  return `${label} setup is missing: ${missingVariables.join(", ")}.`;
}

export function getPaidCheckoutGateStatus({
  env = process.env,
  databaseReadiness,
}: PaidCheckoutGateInput): PaidCheckoutGateStatus {
  const commerce = getCommerceEnvironmentStatus(env);
  const auth = getAuthEnvironmentStatus(env);
  const practiceSeatAdmin = getPracticeSeatEnvironmentStatus(env);
  const alertAdmin = getAlertAdminEnvironmentStatus(env);
  const database = getDatabaseEnvironmentStatus(env);
  const clinicalReview = getClinicalReviewEnvironmentStatus(env);

  const missingVariables = [
    ...commerce.missingCheckoutVariables,
    ...commerce.missingWebhookVariables,
    ...auth.missingPasswordlessVariables,
    ...practiceSeatAdmin.missingPracticeSeatAdminVariables,
    ...alertAdmin.missingAlertAdminVariables,
    ...database.missingDatabaseVariables,
    ...clinicalReview.missingModuleOneReviewVariables,
  ];
  const warnings = [
    missingWarning("Stripe checkout", commerce.missingCheckoutVariables),
    missingWarning("Stripe webhook", commerce.missingWebhookVariables),
    missingWarning("Passwordless sign-in", auth.missingPasswordlessVariables),
    missingWarning(
      "Practice seat assignment",
      practiceSeatAdmin.missingPracticeSeatAdminVariables
    ),
    missingWarning("Alert administration", alertAdmin.missingAlertAdminVariables),
    missingWarning("Database", database.missingDatabaseVariables),
    missingWarning(
      "Module 1 clinical review",
      clinicalReview.missingModuleOneReviewVariables
    ),
    commerce.paidEnrollmentEnabled
      ? null
      : "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
    clinicalReview.moduleOneReviewApproved
      ? null
      : "Module 1 clinical review signoff is missing or not approved.",
    database.databaseConfigured && databaseReadiness.checkFailed
      ? "Launch database schema check failed. Confirm the database is reachable and run pnpm db:setup."
      : null,
    database.databaseConfigured && !databaseReadiness.schemaVerified
      ? `Launch database schema is not verified. Missing tables: ${databaseReadiness.missingTables.join(", ")}.`
      : null,
  ].filter((warning): warning is string => Boolean(warning));

  return {
    ready:
      commerce.checkoutConfigured &&
      commerce.paidEnrollmentEnabled &&
      commerce.webhookConfigured &&
      auth.passwordlessConfigured &&
      practiceSeatAdmin.practiceSeatAdminConfigured &&
      alertAdmin.alertAdminConfigured &&
      database.databaseConfigured &&
      databaseReadiness.schemaVerified &&
      clinicalReview.moduleOneReviewApproved,
    warnings,
    missingVariables,
  };
}
