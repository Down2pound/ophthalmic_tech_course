import type { Request, Response, Router } from "express";
import { COOKIE_NAME } from "../../../shared/const";
import { authorizeLearnerSession } from "../auth/sessionAccess";
import { getProtectedModuleOneLessons } from "../course/protectedLessons";
import { getSessionStore } from "./auth";
import { getEnrollmentStore } from "./stripeWebhook";

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
  router.get("/learn/module-one/lessons", (req: Request, res: Response) => {
    const sessionToken = getCookieValue(req.get("cookie"), COOKIE_NAME);
    const access = authorizeLearnerSession({
      rawSessionToken: sessionToken,
      sessionStore: getSessionStore(),
      enrollmentStore: getEnrollmentStore(),
    });
    const response = getProtectedModuleOneLessons(access);

    res.status(response.status).json(response.payload);
  });
}
