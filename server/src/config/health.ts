export interface HealthReport {
  ok: true;
  service: "optitech-academy";
  environment: string;
  uptimeSeconds: number;
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
  };
}
