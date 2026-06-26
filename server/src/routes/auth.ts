import type { Request, Response, Router } from "express";
import { preparePasswordlessSignInResponse } from "../auth/passwordlessSignInResponse";
import { getCheckoutBaseUrl } from "../commerce/stripeCheckout";

interface PasswordlessStartRequestBody {
  email?: string;
}

export function setupAuthRoutes(router: Router) {
  router.post("/auth/passwordless/start", (req: Request, res: Response) => {
    try {
      const { email } = (req.body ?? {}) as PasswordlessStartRequestBody;
      const prepared = preparePasswordlessSignInResponse({
        email: email ?? "",
        appBaseUrl: getCheckoutBaseUrl(req.get("origin")),
      });

      // Next step: save prepared.signInRequest.magicLinkRecord and send
      // prepared.signInRequest.emailPayload through the email provider.
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
