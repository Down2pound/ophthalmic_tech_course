import {
  getLaunchReadinessSummary,
  launchReadinessChecklist,
  type LaunchReadinessItem,
  type LaunchReadinessSummary,
} from "../../../shared/launch/launchReadiness";
import {
  getRemainingLaunchActions,
  type LaunchActionItem,
} from "../../../shared/launch/launchActionPlan";
import {
  getModuleOneClinicalReviewPacket,
  type ClinicalReviewPacket,
} from "../../../shared/course/clinicalReviewPacket";
import {
  getAuthEnvironmentStatus,
  getClinicalReviewEnvironmentStatus,
  getCommerceEnvironmentStatus,
  getDatabaseEnvironmentStatus,
  getPracticeSeatEnvironmentStatus,
  type AuthEnvironmentStatus,
  type ClinicalReviewEnvironmentStatus,
  type CommerceEnvironmentStatus,
  type DatabaseEnvironmentStatus,
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
  launchChecklist: LaunchReadinessItem[];
  commerce: CommerceEnvironmentStatus;
  auth: AuthEnvironmentStatus;
  practiceSeatAdmin: PracticeSeatEnvironmentStatus;
  database: DatabaseEnvironmentStatus;
  clinicalReview: ClinicalReviewEnvironmentStatus;
  warnings: string[];
  launchActions: LaunchActionItem[];
  clinicalReviewPacket: ClinicalReviewPacket;
}

function formatMissingWarning(label: string, missingVariables: string[]) {
  if (missingVariables.length === 0) return null;
  return `${label} setup is missing: ${missingVariables.join(", ")}.`;
}

function getRuntimeLaunchChecklist(
  clinicalReview: ClinicalReviewEnvironmentStatus
): LaunchReadinessItem[] {
  return launchReadinessChecklist.map(item => {
    if (item.id !== "clinical-review") return item;

    if (!clinicalReview.moduleOneReviewApproved) return item;

    return {
      ...item,
      status: "ready",
      evidence: `Module 1 clinical review approved by ${clinicalReview.reviewerName}, ${clinicalReview.reviewerRole}, on ${clinicalReview.reviewDate} for ${clinicalReview.approvedVersion}.`,
      nextAction:
        "Keep the approved packet with launch records and repeat clinical review whenever lesson content changes.",
    };
  });
}

export function getRuntimeLaunchReadinessReport({
  env = process.env,
  now = () => new Date().toISOString(),
}: RuntimeLaunchReadinessInput = {}): RuntimeLaunchReadinessReport {
  const clinicalReview = getClinicalReviewEnvironmentStatus(env);
  const launchChecklist = getRuntimeLaunchChecklist(clinicalReview);
  const staticSummary = getLaunchReadinessSummary(launchChecklist);
  const commerce = getCommerceEnvironmentStatus(env);
  const auth = getAuthEnvironmentStatus(env);
  const practiceSeatAdmin = getPracticeSeatEnvironmentStatus(env);
  const database = getDatabaseEnvironmentStatus(env);
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
    formatMissingWarning("Database", database.missingDatabaseVariables),
    clinicalReview.moduleOneReviewApproved
      ? null
      : "Module 1 clinical review signoff is missing or not approved.",
    formatMissingWarning(
      "Module 1 clinical review",
      clinicalReview.missingModuleOneReviewVariables
    ),
    commerce.paidEnrollmentEnabled
      ? null
      : "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
  ].filter((warning): warning is string => Boolean(warning));

  return {
    generatedAt: now(),
    readyForPaidLaunch:
      staticSummary.ready &&
      commerce.checkoutConfigured &&
      commerce.paidEnrollmentEnabled &&
      commerce.webhookConfigured &&
      auth.passwordlessConfigured &&
      practiceSeatAdmin.practiceSeatAdminConfigured &&
      database.databaseConfigured,
    staticSummary,
    launchChecklist,
    commerce,
    auth,
    practiceSeatAdmin,
    database,
    clinicalReview,
    warnings,
    launchActions: getRemainingLaunchActions(),
    clinicalReviewPacket: getModuleOneClinicalReviewPacket(),
  };
}
