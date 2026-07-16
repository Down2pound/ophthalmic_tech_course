export type EnvironmentMap = Record<string, string | undefined>;

export type StripeSecretKeyMode = "missing" | "test" | "live" | "unknown";

export interface CommerceEnvironmentStatus {
  checkoutConfigured: boolean;
  paidEnrollmentEnabled: boolean;
  webhookConfigured: boolean;
  stripeSecretKeyMode: StripeSecretKeyMode;
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

export interface AlertAdminEnvironmentStatus {
  alertAdminConfigured: boolean;
  missingAlertAdminVariables: string[];
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

export const alertAdminEnvironmentVariables = ["ALERT_ADMIN_TOKEN"] as const;

export const databaseEnvironmentVariables = [
  "DATABASE_URL",
  "DATABASE_SSL",
] as const;

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

function hasMinimumLength(value: string, minimumLength: number): boolean {
  return value.trim().length >= minimumLength;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

function isPostgresUrl(value: string): boolean {
  try {
    const protocol = new URL(value.trim()).protocol;
    return protocol === "postgres:" || protocol === "postgresql:";
  } catch {
    return false;
  }
}

function isResendEmailApiUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const pathname = url.pathname.replace(/\/$/, "");
    return url.origin === "https://api.resend.com" && pathname === "/emails";
  } catch {
    return false;
  }
}

export function isResendEmailConfiguration(
  env: EnvironmentMap = process.env
): boolean {
  const apiUrl = env.TRANSACTIONAL_EMAIL_API_URL;
  return Boolean(apiUrl && isResendEmailApiUrl(apiUrl));
}

export function isTransactionalEmailApiKeyUnsafe(
  value: string,
  env: EnvironmentMap = process.env
): boolean {
  const trimmedValue = value.trim();

  if (!hasMinimumLength(trimmedValue, 16)) return true;

  if (isResendEmailConfiguration(env)) {
    return !trimmedValue.startsWith("re_");
  }

  return false;
}

export function getStripeSecretKeyMode(
  env: EnvironmentMap = process.env
): StripeSecretKeyMode {
  const secretKey = env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey || secretKey.length === 0) return "missing";
  if (secretKey.startsWith("sk_test_")) return "test";
  if (secretKey.startsWith("sk_live_")) return "live";
  return "unknown";
}

export function isUnsafeLaunchEnvironmentValue(
  variableName: string,
  value: string,
  env: EnvironmentMap = process.env
): boolean {
  if (isPlaceholderEnvironmentValue(variableName, value)) return true;

  const trimmedValue = value.trim();

  switch (variableName) {
    case "STRIPE_SECRET_KEY":
      return (
        getStripeSecretKeyMode({ STRIPE_SECRET_KEY: trimmedValue }) ===
          "unknown" || !hasMinimumLength(value, 16)
      );
    case "STRIPE_WEBHOOK_SECRET":
      return !trimmedValue.startsWith("whsec_") || !hasMinimumLength(value, 16);
    case "PUBLIC_APP_URL":
    case "TRANSACTIONAL_EMAIL_API_URL":
      return !isHttpsUrl(trimmedValue);
    case "AUTH_SESSION_SECRET":
    case "PRACTICE_SEAT_ADMIN_TOKEN":
    case "ALERT_ADMIN_TOKEN":
      return !hasMinimumLength(value, 32);
    case "DATABASE_URL":
      return !isPostgresUrl(trimmedValue);
    case "DATABASE_SSL":
      return trimmedValue.toLowerCase() !== "true";
    case "TRANSACTIONAL_EMAIL_API_KEY":
      return isTransactionalEmailApiKeyUnsafe(trimmedValue, env);
    case "SIGN_IN_FROM_EMAIL":
      return !trimmedValue.includes("@");
    default:
      return false;
  }
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
      isUnsafeLaunchEnvironmentValue(variableName, value, env)
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
    stripeSecretKeyMode: getStripeSecretKeyMode(env),
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

export function getAlertAdminEnvironmentStatus(
  env: EnvironmentMap = process.env
): AlertAdminEnvironmentStatus {
  const missingAlertAdminVariables = getMissingEnvironmentVariables(
    env,
    alertAdminEnvironmentVariables
  );

  return {
    alertAdminConfigured: missingAlertAdminVariables.length === 0,
    missingAlertAdminVariables,
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
