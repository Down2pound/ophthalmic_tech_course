import type { Request, Response, Router } from "express";
import { COOKIE_NAME } from "../../../shared/const";
import { authorizeLearnerSession } from "../auth/sessionAccess";
import {
  getModuleOneKnowledgeCheck,
  scoreModuleOneKnowledgeCheck,
  type SubmittedKnowledgeCheckAnswer,
} from "../assessments/moduleOneKnowledgeCheck";
import {
  createAssessmentAttemptRecord,
  createInMemoryAssessmentAttemptStore,
  type AssessmentAttemptStore,
} from "../assessments/assessmentAttemptStore";
import { getProtectedModuleOneLessons } from "../course/protectedLessons";
import { getPostgresPool } from "../db/postgres";
import { createPostgresAssessmentAttemptStore } from "../assessments/postgresAssessmentAttemptStore";
import { getSessionStore } from "./auth";
import { getEnrollmentStore } from "./stripeWebhook";

function createAssessmentAttemptStore(): AssessmentAttemptStore {
  const postgresPool = getPostgresPool();

  if (postgresPool) {
    return createPostgresAssessmentAttemptStore(postgresPool);
  }

  return createInMemoryAssessmentAttemptStore();
}

const assessmentAttemptStore = createAssessmentAttemptStore();

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return "";

  return (
    cookieHeader
      .split(";")
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? ""
  );
}

export function setupLearnRoutes(router: Router) {
  function getAccess(req: Request) {
    const sessionToken = getCookieValue(req.get("cookie"), COOKIE_NAME);
    return authorizeLearnerSession({
      rawSessionToken: sessionToken,
      sessionStore: getSessionStore(),
      enrollmentStore: getEnrollmentStore(),
    });
  }

  router.get(
    "/learn/module-one/lessons",
    async (req: Request, res: Response) => {
      const access = await getAccess(req);
      const response = getProtectedModuleOneLessons(access);

      res.status(response.status).json(response.payload);
    }
  );

  router.get("/learn/module-one/quiz", async (req: Request, res: Response) => {
    const access = await getAccess(req);

    if (!access.authenticated) {
      res.status(401).json({ error: access.reason });
      return;
    }

    if (!access.hasAccess) {
      res.status(403).json({ error: access.reason });
      return;
    }

    res.json(getModuleOneKnowledgeCheck());
  });

  router.post(
    "/learn/module-one/quiz/submit",
    async (req: Request, res: Response) => {
      const access = await getAccess(req);

      if (!access.authenticated) {
        res.status(401).json({ error: access.reason });
        return;
      }

      if (!access.hasAccess) {
        res.status(403).json({ error: access.reason });
        return;
      }

      const answers = Array.isArray(req.body?.answers)
        ? (req.body.answers as SubmittedKnowledgeCheckAnswer[])
        : [];

      const score = scoreModuleOneKnowledgeCheck({
        learnerEmail: access.email,
        answers,
      });
      const previousAttempts =
        await assessmentAttemptStore.findAttemptsByLearnerAndQuiz(
          access.email,
          score.quizId
        );
      const attempt = createAssessmentAttemptRecord({
        score,
        attemptNumber: previousAttempts.length + 1,
      });

      await assessmentAttemptStore.recordAttempt(attempt);

      res.json({
        ...score,
        attempt,
        progress: await assessmentAttemptStore.getLearnerQuizProgress(
          access.email,
          score.quizId
        ),
      });
    }
  );
}

export function listAssessmentAttempts() {
  return assessmentAttemptStore.listAttempts();
}
