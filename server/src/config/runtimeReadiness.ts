import {
  getLaunchReadinessSummary,
  launchReadinessChecklist,
  type LaunchReadinessSummary,
} from "../../../shared/launch/launchReadiness";
import {
  getAuthEnvironmentStatus,
  getCommerceEnvironmentStatus,
  getPracticeSeatEnvironmentStatus,
  type AuthEnvironmentStatus,
  type CommerceEnvironmentStatus,
  type EnvironmentMap,
  type PracticeSeatEnvironmentStatus,
} from "./environment";

export interface RuntimeLaunchReadinessInput {
  env?: EnvironmentMap;
  now?: () => string;
}

export interface RuntimeLaunchReadinessReport {
  generatedAt: string;
  readyForPaidLaunch: boolean;
  staticSummary: LaunchReadinessSummary;
  commerce: CommerceEnvironmentStatus;
  auth: AuthEnvironmentStatus;
  practiceSeatAdmin: PracticeSeatEnvironmentStatus;
  warnings: string[];
}

function formatMissingWarning(label: string, missingVariables: string[]) {
  if (missingVariables.length === 0) return null;
  return `${label} setup is missing: ${missingVariables.join(", ")}.`;
}

export function getRuntimeLaunchReadinessReport({
  env = process.env,
  now = () => new Date().toISOString(),
}: RuntimeLaunchReadinessInput = {}): RuntimeLaunchReadinessReport {
  const staticSummary = getLaunchReadinessSummary(launchReadinessChecklist);
  const commerce = getCommerceEnvironmentStatus(env);
  const auth = getAuthEnvironmentStatus(env);
  const practiceSeatAdmin = getPracticeSeatEnvironmentStatus(env);
  const warnings = [
    staticSummary.ready
      ? null
      : `Launch checklist still has ${staticSummary.blockedCount} blocked gate(s).`,
    formatMissingWarning("Stripe checkout", commerce.missingCheckoutVariables),
    formatMissingWarning("Stripe webhook", commerce.missingWebhookVariables),
    formatMissingWarning(
      "Passwordless sign-in",
      auth.missingPasswordlessVariables
    ),
    formatMissingWarning(
      "Practice seat assignment",
      practiceSeatAdmin.missingPracticeSeatAdminVariables
    ),
  ].filter((warning): warning is string => Boolean(warning));

  return {
    generatedAt: now(),
    readyForPaidLaunch:
      staticSummary.ready &&
      commerce.checkoutConfigured &&
      commerce.webhookConfigured &&
      auth.passwordlessConfigured &&
      practiceSeatAdmin.practiceSeatAdminConfigured,
    staticSummary,
    commerce,
    auth,
    practiceSeatAdmin,
    warnings,
  };
}
