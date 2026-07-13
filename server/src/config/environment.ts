export type EnvironmentMap = Record<string, string | undefined>;

export interface CommerceEnvironmentStatus {
  checkoutConfigured: boolean;
  paidEnrollmentEnabled: boolean;
  webhookConfigured: boolean;
  missingCheckoutVariables: string[];
  missingWebhookVariables: string[];
}

export interface AuthEnvironmentStatus {
  passwordlessConfigured: boolean;
  missingPasswordlessVariables: string[];
}

export interface PracticeSeatEnvironmentStatus {
  practiceSeatAdminConfigured: boolean;
  missingPracticeSeatAdminVariables: string[];
}

export interface DatabaseEnvironmentStatus {
  databaseConfigured: boolean;
  missingDatabaseVariables: string[];
}

export interface ClinicalReviewEnvironmentStatus {
  moduleOneReviewConfigured: boolean;
  moduleOneReviewApproved: boolean;
  missingModuleOneReviewVariables: string[];
  reviewerName: string;
  reviewerRole: string;
  reviewDate: string;
  approvedVersion: string;
}

export const checkoutEnvironmentVariables = [
  "STRIPE_SECRET_KEY",
  "PUBLIC_APP_URL",
  "ENABLE_PAID_ENROLLMENT",
] as const;

export const webhookEnvironmentVariables = ["STRIPE_WEBHOOK_SECRET"] as const;

export const passwordlessEnvironmentVariables = [
  "AUTH_SESSION_SECRET",
  "TRANSACTIONAL_EMAIL_API_URL",
  "TRANSACTIONAL_EMAIL_API_KEY",
  "SIGN_IN_FROM_EMAIL",
  "PUBLIC_APP_URL",
] as const;

export const practiceSeatAdminEnvironmentVariables = [
  "PRACTICE_SEAT_ADMIN_TOKEN",
] as const;

export const databaseEnvironmentVariables = ["DATABASE_URL"] as const;

export const moduleOneClinicalReviewEnvironmentVariables = [
  "MODULE_ONE_CLINICAL_REVIEWER_NAME",
  "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
  "MODULE_ONE_CLINICAL_REVIEW_DATE",
  "MODULE_ONE_CLINICAL_APPROVED_VERSION",
  "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
] as const;

export function isEnvironmentFlagEnabled(
  env: EnvironmentMap,
  variableName: string
): boolean {
  return env[variableName]?.trim().toLowerCase() === "true";
}

export function isPlaceholderEnvironmentValue(
  variableName: string,
  value: string
): boolean {
  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.toLowerCase();

  if (
    normalizedValue.includes("replace_with") ||
    normalizedValue.includes("_replace_") ||
    normalizedValue.includes("your_") ||
    normalizedValue.includes("example.com")
  ) {
    return true;
  }

  if (
    variableName === "PUBLIC_APP_URL" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
      trimmedValue
    )
  ) {
    return true;
  }

  return false;
}

export function getMissingEnvironmentVariables(
  env: EnvironmentMap,
  requiredVariables: readonly string[]
): string[] {
  return requiredVariables.filter(variableName => {
    const value = env[variableName];
    return (
      !value ||
      value.trim().length === 0 ||
      isPlaceholderEnvironmentValue(variableName, value)
    );
  });
}

export function getCommerceEnvironmentStatus(
  env: EnvironmentMap = process.env
): CommerceEnvironmentStatus {
  const missingCheckoutVariables = getMissingEnvironmentVariables(
    env,
    checkoutEnvironmentVariables
  );
  const missingWebhookVariables = getMissingEnvironmentVariables(
    env,
    webhookEnvironmentVariables
  );

  return {
    checkoutConfigured: missingCheckoutVariables.length === 0,
    paidEnrollmentEnabled: isEnvironmentFlagEnabled(
      env,
      "ENABLE_PAID_ENROLLMENT"
    ),
    webhookConfigured: missingWebhookVariables.length === 0,
    missingCheckoutVariables,
    missingWebhookVariables,
  };
}

export function getAuthEnvironmentStatus(
  env: EnvironmentMap = process.env
): AuthEnvironmentStatus {
  const missingPasswordlessVariables = getMissingEnvironmentVariables(
    env,
    passwordlessEnvironmentVariables
  );

  return {
    passwordlessConfigured: missingPasswordlessVariables.length === 0,
    missingPasswordlessVariables,
  };
}

export function getPracticeSeatEnvironmentStatus(
  env: EnvironmentMap = process.env
): PracticeSeatEnvironmentStatus {
  const missingPracticeSeatAdminVariables = getMissingEnvironmentVariables(
    env,
    practiceSeatAdminEnvironmentVariables
  );

  return {
    practiceSeatAdminConfigured: missingPracticeSeatAdminVariables.length === 0,
    missingPracticeSeatAdminVariables,
  };
}

export function getDatabaseEnvironmentStatus(
  env: EnvironmentMap = process.env
): DatabaseEnvironmentStatus {
  const missingDatabaseVariables = getMissingEnvironmentVariables(
    env,
    databaseEnvironmentVariables
  );

  return {
    databaseConfigured: missingDatabaseVariables.length === 0,
    missingDatabaseVariables,
  };
}

export function getClinicalReviewEnvironmentStatus(
  env: EnvironmentMap = process.env
): ClinicalReviewEnvironmentStatus {
  const missingModuleOneReviewVariables = getMissingEnvironmentVariables(
    env,
    moduleOneClinicalReviewEnvironmentVariables
  );
  const moduleOneReviewApproved = isEnvironmentFlagEnabled(
    env,
    "MODULE_ONE_CLINICAL_REVIEW_APPROVED"
  );

  return {
    moduleOneReviewConfigured: missingModuleOneReviewVariables.length === 0,
    moduleOneReviewApproved:
      missingModuleOneReviewVariables.length === 0 && moduleOneReviewApproved,
    missingModuleOneReviewVariables,
    reviewerName: env.MODULE_ONE_CLINICAL_REVIEWER_NAME?.trim() ?? "",
    reviewerRole: env.MODULE_ONE_CLINICAL_REVIEWER_ROLE?.trim() ?? "",
    reviewDate: env.MODULE_ONE_CLINICAL_REVIEW_DATE?.trim() ?? "",
    approvedVersion: env.MODULE_ONE_CLINICAL_APPROVED_VERSION?.trim() ?? "",
  };
}
