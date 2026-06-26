import type { Request, Response, Router } from "express";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export function setupLaunchReadinessRoutes(router: Router) {
  router.get("/launch/readiness", (_req: Request, res: Response) => {
    res.json(getRuntimeLaunchReadinessReport());
  });
}
