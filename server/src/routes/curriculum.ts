/**
 * Curriculum API routes
 * Handles curriculum module retrieval, progress tracking, and assessment management
 */

import type { Router, Request, Response } from "express";
import type {
  Module,
  StudentProgress,
  CurriculumOverview,
} from "../../../shared/types/curriculum";
import { CURRICULUM_CONFIG } from "../../../shared/types/curriculum";

export function setupCurriculumRoutes(router: Router) {
  /**
   * GET /api/curriculum/overview
   * Retrieves the complete curriculum overview with all 10 modules
   */
  router.get("/curriculum/overview", (req: Request, res: Response) => {
    try {
      const overview: CurriculumOverview = {
        title: "10-Day Ophthalmic Technician Training Program",
        description:
          "A comprehensive high-intensity multimedia training program designed to prepare new hires and career changers to become clinic-ready ophthalmic technicians.",
        totalDays: CURRICULUM_CONFIG.TOTAL_DAYS,
        modules: [...CURRICULUM_CONFIG.MODULES] as Module[], // Will be populated from database
        notebookLmUrl: CURRICULUM_CONFIG.NOTEBOOKLM_URL,
        lastUpdated: new Date(),
      };

      res.json(overview);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch curriculum overview" });
    }
  });

  /**
   * GET /api/curriculum/modules
   * Retrieves all curriculum modules
   */
  router.get("/curriculum/modules", (req: Request, res: Response) => {
    try {
      const modules = CURRICULUM_CONFIG.MODULES;
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  /**
   * GET /api/curriculum/modules/:day
   * Retrieves a specific module by day number
   */
  router.get("/curriculum/modules/:day", (req: Request, res: Response) => {
    try {
      const day = parseInt(req.params.day);

      if (day < 1 || day > CURRICULUM_CONFIG.TOTAL_DAYS) {
        res
          .status(404)
          .json({ error: `Module for day ${day} not found` });
        return;
      }

      const module = CURRICULUM_CONFIG.MODULES.find((m) => m.day === day);

      if (!module) {
        res.status(404).json({ error: `Module for day ${day} not found` });
        return;
      }

      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  /**
   * POST /api/curriculum/progress
   * Records student progress for a module
   */
  router.post("/curriculum/progress", (req: Request, res: Response) => {
    try {
      const { studentId, moduleId, day, status, assessmentScore } = req.body;

      if (!studentId || !day) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const progress: StudentProgress = {
        studentId,
        moduleId,
        day,
        status,
        completedAt: status === "completed" ? new Date() : undefined,
        assessmentScore,
      };

      // TODO: Save to database
      res.json({
        message: "Progress recorded successfully",
        progress,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to record progress" });
    }
  });

  /**
   * GET /api/curriculum/progress/:studentId
   * Retrieves student progress across all modules
   */
  router.get(
    "/curriculum/progress/:studentId",
    (req: Request, res: Response) => {
      try {
        const { studentId } = req.params;

        // TODO: Fetch from database
        const progress: StudentProgress[] = [];

        res.json(progress);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch student progress" });
      }
    }
  );

  /**
   * POST /api/curriculum/assessment
   * Submits assessment/quiz results
   */
  router.post("/curriculum/assessment", (req: Request, res: Response) => {
    try {
      const { studentId, day, score, answers } = req.body;

      if (!studentId || !day || score === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      // TODO: Save assessment results to database
      // TODO: Validate answers and calculate score

      res.json({
        message: "Assessment submitted successfully",
        studentId,
        day,
        score,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit assessment" });
    }
  });
}
