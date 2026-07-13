import type { Request, Response, Router } from "express";
import { getHealthReport } from "../config/health";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export function setupLaunchReadinessRoutes(router: Router) {
  router.get("/health", (_req: Request, res: Response) => {
    res.json(getHealthReport());
  });

  router.get("/launch/readiness", (_req: Request, res: Response) => {
    res.json(getRuntimeLaunchReadinessReport());
  });
}
