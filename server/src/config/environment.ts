export type EnvironmentMap = Record<string, string | undefined>;

export interface CommerceEnvironmentStatus {
  checkoutConfigured: boolean;
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

export const checkoutEnvironmentVariables = [
  "STRIPE_SECRET_KEY",
  "PUBLIC_APP_URL",
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

export function getMissingEnvironmentVariables(
  env: EnvironmentMap,
  requiredVariables: readonly string[]
): string[] {
  return requiredVariables.filter(variableName => {
    const value = env[variableName];
    return !value || value.trim().length === 0;
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
