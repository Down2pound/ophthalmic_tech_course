import type { Request, Response, Router } from "express";
import { createInMemoryMagicLinkStore } from "../auth/magicLinkStore";
import { preparePasswordlessSignInResponse } from "../auth/passwordlessSignInResponse";
import { getCheckoutBaseUrl } from "../commerce/stripeCheckout";

interface PasswordlessStartRequestBody {
  email?: string;
}

const magicLinkStore = createInMemoryMagicLinkStore();

export function listPreparedMagicLinks() {
  return magicLinkStore.listMagicLinks();
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
}
