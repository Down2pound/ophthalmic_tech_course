import type {
  LaunchReadinessItem,
  LaunchReadinessSummary,
} from "@shared/launch/launchReadiness";
import type { LaunchActionItem } from "@shared/launch/launchActionPlan";
import type { ClinicalReviewPacket } from "@shared/course/clinicalReviewPacket";

type Fetcher = typeof fetch;

export interface RuntimeCommerceStatus {
  checkoutConfigured: boolean;
  paidEnrollmentEnabled: boolean;
  webhookConfigured: boolean;
  stripeSecretKeyMode: "missing" | "test" | "live" | "unknown";
  missingCheckoutVariables: string[];
  missingWebhookVariables: string[];
}

export interface RuntimeLaunchReadinessReport {
  generatedAt: string;
  readyForPaidLaunch: boolean;
  salesChannels: {
    individualLearner: RuntimeSalesChannelStatus;
    practicePacks: RuntimeSalesChannelStatus;
  };
  staticSummary: LaunchReadinessSummary;
  launchChecklist: LaunchReadinessItem[];
  commerce: RuntimeCommerceStatus;
  auth: {
    passwordlessConfigured: boolean;
    missingPasswordlessVariables: string[];
  };
  practiceSeatAdmin: {
    practiceSeatAdminConfigured: boolean;
    missingPracticeSeatAdminVariables: string[];
  };
  database: {
    databaseConfigured: boolean;
    missingDatabaseVariables: string[];
  };
  databaseReadiness: {
    schemaVerified: boolean;
    requiredTables: string[];
    checkedTableCount: number;
    missingTables: string[];
    checkFailed: boolean;
  };
  clinicalReview: {
    moduleOneReviewConfigured: boolean;
    moduleOneReviewApproved: boolean;
    missingModuleOneReviewVariables: string[];
    reviewerName: string;
    reviewerRole: string;
    reviewDate: string;
    approvedVersion: string;
  };
  warnings: string[];
  nextSetupSteps: Array<{
    title: string;
    detail: string;
    command?: string;
  }>;
  launchActions: LaunchActionItem[];
  clinicalReviewPacket: ClinicalReviewPacket;
}

export interface RuntimeSalesChannelStatus {
  ready: boolean;
  blockers: string[];
}

interface RuntimeReadinessErrorResponse {
  error?: string;
}

export async function fetchRuntimeLaunchReadiness({
  fetcher = fetch,
}: {
  fetcher?: Fetcher;
} = {}): Promise<RuntimeLaunchReadinessReport> {
  const response = await fetcher("/api/launch/readiness");
  const payload = (await response.json()) as
    | RuntimeLaunchReadinessReport
    | RuntimeReadinessErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Launch readiness is unavailable right now."
    );
  }

  return payload as RuntimeLaunchReadinessReport;
}
