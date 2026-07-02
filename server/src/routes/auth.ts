import type { Request, Response, Router } from "express";
import { COOKIE_NAME } from "../../../shared/const";
import { consumeMagicLink } from "../auth/consumeMagicLink";
import { sendMagicLinkEmail } from "../auth/magicLinkEmail";
import { createInMemoryMagicLinkStore } from "../auth/magicLinkStore";
import { preparePasswordlessSignInResponse } from "../auth/passwordlessSignInResponse";
import { authorizeLearnerSession } from "../auth/sessionAccess";
import { createInMemoryAuthSessionStore } from "../auth/sessionStore";
import { getCheckoutBaseUrl } from "../commerce/stripeCheckout";
import { getAuthEnvironmentStatus } from "../config/environment";
import { getEnrollmentStore } from "./stripeWebhook";

interface PasswordlessStartRequestBody {
  email?: string;
}

const magicLinkStore = createInMemoryMagicLinkStore();
const sessionStore = createInMemoryAuthSessionStore();

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

export function listPreparedMagicLinks() {
  return magicLinkStore.listMagicLinks();
}

export function listPreparedSessions() {
  return sessionStore.listSessions();
}

export function getSessionStore() {
  return sessionStore;
}

export function setupAuthRoutes(router: Router) {
  router.post("/auth/passwordless/start", async (req: Request, res: Response) => {
    const environmentStatus = getAuthEnvironmentStatus();

    if (!environmentStatus.passwordlessConfigured) {
      res.status(503).json({
        error: "Passwordless sign-in email is not configured yet.",
        missing: environmentStatus.missingPasswordlessVariables,
      });
      return;
    }

    try {
      const { email } = (req.body ?? {}) as PasswordlessStartRequestBody;
      const prepared = preparePasswordlessSignInResponse({
        email: email ?? "",
        appBaseUrl: getCheckoutBaseUrl(req.get("origin")),
      });

      magicLinkStore.storeMagicLink(prepared.signInRequest.magicLinkRecord);
      await sendMagicLinkEmail({
        payload: prepared.signInRequest.emailPayload,
        from: process.env.SIGN_IN_FROM_EMAIL ?? "",
        apiUrl: process.env.TRANSACTIONAL_EMAIL_API_URL ?? "",
        apiKey: process.env.TRANSACTIONAL_EMAIL_API_KEY ?? "",
      });
      res.json(prepared.publicResponse);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Sign-in request could not be prepared.";
      const status = message === "Sign-in email could not be sent." ? 502 : 400;

      res.status(status).json({ error: message });
    }
  });

  router.get("/auth/callback", (req: Request, res: Response) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const result = consumeMagicLink({
      rawToken: token,
      magicLinkStore,
      sessionStore,
    });

    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.cookie(result.cookie.name, result.cookie.value, {
      httpOnly: result.cookie.httpOnly,
      maxAge: result.cookie.maxAgeSeconds * 1000,
      sameSite: result.cookie.sameSite,
      secure: result.cookie.secure,
      path: result.cookie.path,
    });
    res.redirect("/learn");
  });

  router.get("/auth/session", (req: Request, res: Response) => {
    const sessionToken = getCookieValue(req.get("cookie"), COOKIE_NAME);
    const access = authorizeLearnerSession({
      rawSessionToken: sessionToken,
      sessionStore,
      enrollmentStore: getEnrollmentStore(),
    });

    res.json(access);
  });
}
