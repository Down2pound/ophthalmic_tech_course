import type { LaunchReadinessSummary } from "@shared/launch/launchReadiness";

type Fetcher = typeof fetch;

export interface RuntimeCommerceStatus {
  checkoutConfigured: boolean;
  webhookConfigured: boolean;
  missingCheckoutVariables: string[];
  missingWebhookVariables: string[];
}

export interface RuntimeLaunchReadinessReport {
  generatedAt: string;
  readyForPaidLaunch: boolean;
  staticSummary: LaunchReadinessSummary;
  commerce: RuntimeCommerceStatus;
  warnings: string[];
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
