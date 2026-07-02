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
} from "../assessments/assessmentAttemptStore";
import { getProtectedModuleOneLessons } from "../course/protectedLessons";
import { getSessionStore } from "./auth";
import { getEnrollmentStore } from "./stripeWebhook";

const assessmentAttemptStore = createInMemoryAssessmentAttemptStore();

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return "";

  return (
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
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

  router.get("/learn/module-one/lessons", (req: Request, res: Response) => {
    const access = getAccess(req);
    const response = getProtectedModuleOneLessons(access);

    res.status(response.status).json(response.payload);
  });

  router.get("/learn/module-one/quiz", (req: Request, res: Response) => {
    const access = getAccess(req);

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

  router.post("/learn/module-one/quiz/submit", (req: Request, res: Response) => {
    const access = getAccess(req);

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
      assessmentAttemptStore.findAttemptsByLearnerAndQuiz(
        access.email,
        score.quizId
      );
    const attempt = createAssessmentAttemptRecord({
      score,
      attemptNumber: previousAttempts.length + 1,
    });

    assessmentAttemptStore.recordAttempt(attempt);

    res.json({
      ...score,
      attempt,
      progress: assessmentAttemptStore.getLearnerQuizProgress(
        access.email,
        score.quizId
      ),
    });
  });
}

export function listAssessmentAttempts() {
  return assessmentAttemptStore.listAttempts();
}
