import type { Request, Response, Router } from "express";
import { renderModuleOneClinicalReviewPacketMarkdown } from "../../../shared/course/clinicalReviewPacket";
import { getHealthReport } from "../config/health";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import { getLaunchDatabaseReadiness } from "../db/launchDatabaseReadiness";
import { getPostgresPool } from "../db/postgres";

export function setupLaunchReadinessRoutes(router: Router) {
  router.get("/health", (_req: Request, res: Response) => {
    res.json(getHealthReport());
  });

  router.get("/launch/readiness", async (_req: Request, res: Response) => {
    const databaseReadiness = await getLaunchDatabaseReadiness({
      db: getPostgresPool(),
    });

    res.json(getRuntimeLaunchReadinessReport({ databaseReadiness }));
  });

  router.get(
    "/launch/clinical-review-packet.md",
    (_req: Request, res: Response) => {
      res
        .type("text/markdown")
        .set(
          "Content-Disposition",
          'attachment; filename="module-1-clinical-review-packet.md"'
        )
        .send(renderModuleOneClinicalReviewPacketMarkdown());
    }
  );
}
