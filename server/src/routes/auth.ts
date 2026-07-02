import type { Request, Response, Router } from "express";
import { consumeMagicLink } from "../auth/consumeMagicLink";
import { createInMemoryMagicLinkStore } from "../auth/magicLinkStore";
import { preparePasswordlessSignInResponse } from "../auth/passwordlessSignInResponse";
import { createInMemoryAuthSessionStore } from "../auth/sessionStore";
import { getCheckoutBaseUrl } from "../commerce/stripeCheckout";

interface PasswordlessStartRequestBody {
  email?: string;
}

const magicLinkStore = createInMemoryMagicLinkStore();
const sessionStore = createInMemoryAuthSessionStore();

export function listPreparedMagicLinks() {
  return magicLinkStore.listMagicLinks();
}

export function listPreparedSessions() {
  return sessionStore.listSessions();
}

export function setupAuthRoutes(router: Router) {
  router.post("/auth/passwordless/start", (req: Request, res: Response) => {
    try {
      const { email } = (req.body ?? {}) as PasswordlessStartRequestBody;
      const prepared = preparePasswordlessSignInResponse({
        email: email ?? "",
        appBaseUrl: getCheckoutBaseUrl(req.get("origin")),
      });

      magicLinkStore.storeMagicLink(prepared.signInRequest.magicLinkRecord);
      // Next step: send prepared.signInRequest.emailPayload through the
      // transactional email provider.
      res.json(prepared.publicResponse);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Sign-in request could not be prepared.",
      });
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
}
