export interface HealthReport {
  ok: true;
  service: "optitech-academy";
  environment: string;
  uptimeSeconds: number;
  release: HealthReleaseReport;
}

export interface HealthReleaseReport {
  host: "render" | "local";
  branch?: string;
  commit?: string;
  serviceName?: string;
  url?: string;
}

function getTrimmedEnv(env: NodeJS.ProcessEnv, variableName: string) {
  const value = env[variableName]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function getShortCommit(value: string | undefined) {
  if (!value) return undefined;
  return value.slice(0, 7);
}

export function getHealthReleaseReport(
  env: NodeJS.ProcessEnv = process.env
): HealthReleaseReport {
  const renderCommit = getTrimmedEnv(env, "RENDER_GIT_COMMIT");

  if (renderCommit) {
    return {
      host: "render",
      branch: getTrimmedEnv(env, "RENDER_GIT_BRANCH"),
      commit: getShortCommit(renderCommit),
      serviceName: getTrimmedEnv(env, "RENDER_SERVICE_NAME"),
      url: getTrimmedEnv(env, "RENDER_EXTERNAL_URL"),
    };
  }

  return {
    host: "local",
  };
}

export function getHealthReport({
  env = process.env,
  uptime = () => process.uptime(),
}: {
  env?: NodeJS.ProcessEnv;
  uptime?: () => number;
} = {}): HealthReport {
  return {
    ok: true,
    service: "optitech-academy",
    environment: env.NODE_ENV?.trim() || "development",
    uptimeSeconds: Math.round(uptime()),
    release: getHealthReleaseReport(env),
  };
}
