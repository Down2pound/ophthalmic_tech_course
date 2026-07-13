import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export interface DeploymentSmokeTestReport {
  baseUrl: string;
  healthOk: boolean;
  readyForPaidLaunch: boolean;
  blockers: string[];
  warnings: string[];
}

export interface DeploymentSmokeTestInput {
  baseUrl: string;
  fetcher?: typeof fetch;
}

interface HealthResponse {
  ok?: boolean;
}

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

async function fetchJson<T>({
  fetcher,
  url,
}: {
  fetcher: typeof fetch;
  url: string;
}): Promise<T> {
  const response = await fetcher(url);

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function runDeploymentSmokeTest({
  baseUrl,
  fetcher = fetch,
}: DeploymentSmokeTestInput): Promise<DeploymentSmokeTestReport> {
  const normalizedBaseUrl = trimBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    throw new Error("A deployed base URL is required.");
  }

  const health = await fetchJson<HealthResponse>({
    fetcher,
    url: `${normalizedBaseUrl}/api/health`,
  });
  const readiness = await fetchJson<RuntimeLaunchReadinessReport>({
    fetcher,
    url: `${normalizedBaseUrl}/api/launch/readiness`,
  });

  return {
    baseUrl: normalizedBaseUrl,
    healthOk: health.ok === true,
    readyForPaidLaunch: readiness.readyForPaidLaunch,
    blockers: readiness.staticSummary.blockers,
    warnings: readiness.warnings,
  };
}
