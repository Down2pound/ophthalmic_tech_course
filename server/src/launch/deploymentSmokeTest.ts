import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import type { LaunchActionItem } from "../../../shared/launch/launchActionPlan";

export interface DeploymentSmokeTestReport {
  baseUrl: string;
  healthOk: boolean;
  publicPagesOk: boolean;
  publicPages: DeploymentSmokePublicPageResult[];
  readyForPaidLaunch: boolean;
  generatedAt: string;
  blockers: string[];
  warnings: string[];
  launchActions: LaunchActionItem[];
}

export interface DeploymentSmokeTestInput {
  baseUrl: string;
  fetcher?: typeof fetch;
  now?: () => string;
}

export interface DeploymentSmokePublicPageResult {
  path: string;
  ok: boolean;
  status: number;
}

interface HealthResponse {
  ok?: boolean;
}

export const deploymentSmokePublicPaths = [
  "/",
  "/checkout",
  "/checkout?checkout=cancelled&offer=founding-learner",
  "/learn?checkout=success&offer=founding-learner",
  "/practice-packs",
  "/practice-packs?checkout=cancelled&offer=practice-five-seat-pack",
  "/practice-packs?checkout=success&offer=practice-five-seat-pack",
  "/policies",
  "/curriculum",
  "/onboarding",
] as const;

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

async function fetchPublicPage({
  fetcher,
  baseUrl,
  path,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
  path: string;
}): Promise<DeploymentSmokePublicPageResult> {
  const response = await fetcher(`${baseUrl}${path}`);

  return {
    path,
    ok: response.ok,
    status: response.status,
  };
}

export async function runDeploymentSmokeTest({
  baseUrl,
  fetcher = fetch,
  now = () => new Date().toISOString(),
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
  const publicPages = await Promise.all(
    deploymentSmokePublicPaths.map(path =>
      fetchPublicPage({ fetcher, baseUrl: normalizedBaseUrl, path })
    )
  );

  return {
    baseUrl: normalizedBaseUrl,
    healthOk: health.ok === true,
    publicPagesOk: publicPages.every(page => page.ok),
    publicPages,
    readyForPaidLaunch: readiness.readyForPaidLaunch,
    generatedAt: now(),
    blockers: readiness.staticSummary.blockers,
    warnings: readiness.warnings,
    launchActions: readiness.launchActions,
  };
}

function renderList(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

export function renderDeploymentSmokeReport(
  report: DeploymentSmokeTestReport
): string {
  return [
    "# OptiTech Academy Deployment Smoke Test",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    `Deployment URL: ${report.baseUrl}`,
    "",
    "## Result",
    "",
    `- Health endpoint: ${report.healthOk ? "ok" : "failed"}`,
    `- Public buyer pages: ${report.publicPagesOk ? "ok" : "failed"}`,
    `- Paid launch readiness: ${report.readyForPaidLaunch ? "ready" : "not ready"}`,
    "",
    "## Public Page Checks",
    "",
    ...report.publicPages.map(
      page =>
        `- ${page.path}: ${page.ok ? "ok" : "failed"} (HTTP ${page.status})`
    ),
    "",
    "## Blockers",
    "",
    ...renderList(report.blockers, "No launch blockers reported."),
    "",
    "## Warnings",
    "",
    ...renderList(report.warnings, "No runtime warnings reported."),
    "",
    "## Next Launch Actions",
    "",
    ...renderList(
      report.launchActions.map(
        action =>
          `${action.title}: ${action.action} Evidence needed: ${action.evidenceNeeded}`
      ),
      "No remaining launch actions reported."
    ),
    "",
    "Do not paste secrets, tokens, cookies, card numbers, or database passwords into this report.",
    "",
  ].join("\n");
}
