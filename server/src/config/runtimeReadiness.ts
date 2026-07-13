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
  unverifiedLaunchDatabaseReadiness,
  type LaunchDatabaseReadinessStatus,
} from "../db/launchDatabaseReadiness";
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
  databaseReadiness?: LaunchDatabaseReadinessStatus;
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
  databaseReadiness: LaunchDatabaseReadinessStatus;
  clinicalReview: ClinicalReviewEnvironmentStatus;
  warnings: string[];
  nextSetupSteps: RuntimeLaunchNextStep[];
  launchActions: LaunchActionItem[];
  clinicalReviewPacket: ClinicalReviewPacket;
}

export interface RuntimeLaunchNextStep {
  title: string;
  detail: string;
  command?: string;
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

function getRuntimeLaunchNextSteps({
  commerce,
  auth,
  practiceSeatAdmin,
  database,
  databaseReadiness,
  clinicalReview,
}: {
  commerce: CommerceEnvironmentStatus;
  auth: AuthEnvironmentStatus;
  practiceSeatAdmin: PracticeSeatEnvironmentStatus;
  database: DatabaseEnvironmentStatus;
  databaseReadiness: LaunchDatabaseReadinessStatus;
  clinicalReview: ClinicalReviewEnvironmentStatus;
}): RuntimeLaunchNextStep[] {
  const steps: RuntimeLaunchNextStep[] = [];

  if (!clinicalReview.moduleOneReviewApproved) {
    steps.push({
      title: "Finish Module 1 clinical review",
      detail:
        "Download the review packet, resolve corrections, then set the MODULE_ONE_CLINICAL_* signoff values in the host dashboard.",
      command: "GET /api/launch/clinical-review-packet.md",
    });
  }

  if (!database.databaseConfigured) {
    steps.push({
      title: "Connect hosted PostgreSQL",
      detail:
        "Use the Render Blueprint database or set DATABASE_URL and DATABASE_SSL=true in the production host dashboard.",
      command: "DATABASE_URL=... DATABASE_SSL=true",
    });
  } else if (!databaseReadiness.schemaVerified) {
    steps.push({
      title: "Create launch database tables",
      detail:
        "Run the setup command against the same hosted database used by the deployed app, then recheck launch readiness.",
      command: "pnpm db:setup",
    });
  }

  if (!commerce.checkoutConfigured || !commerce.webhookConfigured) {
    steps.push({
      title: "Finish Stripe checkout and webhook setup",
      detail:
        "Add the Stripe secret key, create the checkout.session.completed webhook endpoint, and save the webhook signing secret in the host dashboard.",
      command: "POST /api/stripe/webhook",
    });
  }

  if (!auth.passwordlessConfigured) {
    steps.push({
      title: "Configure passwordless sign-in email",
      detail:
        "Add the transactional email API URL, API key, and verified from-address so buyers can receive sign-in links.",
      command:
        "TRANSACTIONAL_EMAIL_API_URL=... TRANSACTIONAL_EMAIL_API_KEY=... SIGN_IN_FROM_EMAIL=...",
    });
  }

  if (!practiceSeatAdmin.practiceSeatAdminConfigured) {
    steps.push({
      title: "Protect practice seat assignment",
      detail:
        "Set a strong practice-seat admin token before selling team packs to clinics.",
      command: "PRACTICE_SEAT_ADMIN_TOKEN=...",
    });
  }

  if (!commerce.paidEnrollmentEnabled) {
    steps.push({
      title: "Keep paid enrollment disabled until final proof",
      detail:
        "Turn this on only after clinical review, Stripe, email, database schema, deployed smoke test, and manual buyer-flow QA all pass.",
      command: "ENABLE_PAID_ENROLLMENT=true",
    });
  }

  if (steps.length === 0 && !databaseReadiness.schemaVerified) {
    steps.push({
      title: "Verify production database schema",
      detail:
        "The launch environment variables are present, but the database schema still needs a passing readiness check.",
      command: "GET /api/launch/readiness",
    });
  }

  return steps;
}

export function getRuntimeLaunchReadinessReport({
  env = process.env,
  databaseReadiness = unverifiedLaunchDatabaseReadiness,
  now = () => new Date().toISOString(),
}: RuntimeLaunchReadinessInput = {}): RuntimeLaunchReadinessReport {
  const clinicalReview = getClinicalReviewEnvironmentStatus(env);
  const launchChecklist = getRuntimeLaunchChecklist(clinicalReview);
  const staticSummary = getLaunchReadinessSummary(launchChecklist);
  const commerce = getCommerceEnvironmentStatus(env);
  const auth = getAuthEnvironmentStatus(env);
  const practiceSeatAdmin = getPracticeSeatEnvironmentStatus(env);
  const database = getDatabaseEnvironmentStatus(env);
  const nextSetupSteps = getRuntimeLaunchNextSteps({
    commerce,
    auth,
    practiceSeatAdmin,
    database,
    databaseReadiness,
    clinicalReview,
  });
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
    database.databaseConfigured && databaseReadiness.checkFailed
      ? "Launch database schema check failed. Confirm the database is reachable and run pnpm db:setup."
      : null,
    database.databaseConfigured && !databaseReadiness.schemaVerified
      ? `Launch database schema is not verified. Missing tables: ${databaseReadiness.missingTables.join(", ")}.`
      : null,
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
      database.databaseConfigured &&
      databaseReadiness.schemaVerified,
    staticSummary,
    launchChecklist,
    commerce,
    auth,
    practiceSeatAdmin,
    database,
    databaseReadiness,
    clinicalReview,
    warnings,
    nextSetupSteps,
    launchActions: getRemainingLaunchActions(),
    clinicalReviewPacket: getModuleOneClinicalReviewPacket(),
  };
}
