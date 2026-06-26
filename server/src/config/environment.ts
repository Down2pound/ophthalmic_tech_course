export type EnvironmentMap = Record<string, string | undefined>;

export interface CommerceEnvironmentStatus {
  checkoutConfigured: boolean;
  webhookConfigured: boolean;
  missingCheckoutVariables: string[];
  missingWebhookVariables: string[];
}

export const checkoutEnvironmentVariables = [
  "STRIPE_SECRET_KEY",
  "PUBLIC_APP_URL",
] as const;

export const webhookEnvironmentVariables = ["STRIPE_WEBHOOK_SECRET"] as const;

export function getMissingEnvironmentVariables(
  env: EnvironmentMap,
  requiredVariables: readonly string[]
): string[] {
  return requiredVariables.filter((variableName) => {
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
