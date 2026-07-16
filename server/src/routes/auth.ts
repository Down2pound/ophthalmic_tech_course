import type { Request, Response, Router } from "express";
import { COOKIE_NAME } from "../../../shared/const";
import { consumeMagicLink } from "../auth/consumeMagicLink";
import { sendMagicLinkEmail } from "../auth/magicLinkEmail";
import {
  createInMemoryMagicLinkStore,
  type MagicLinkStore,
} from "../auth/magicLinkStore";
import { preparePasswordlessSignInResponse } from "../auth/passwordlessSignInResponse";
import {
  createPostgresAuthSessionStore,
  createPostgresMagicLinkStore,
} from "../auth/postgresAuthStore";
import { authorizeLearnerSession } from "../auth/sessionAccess";
import {
  createInMemoryAuthSessionStore,
  type AuthSessionStore,
} from "../auth/sessionStore";
import {
  revokeAccess,
  type AccessRevocationTarget,
} from "../commerce/accessRevocation";
import { lookupBuyerSupportProfile } from "../commerce/buyerSupportLookup";
import { assignPracticeSeatToLearner } from "../commerce/practiceSeatAssignment";
import { getCheckoutBaseUrl } from "../commerce/stripeCheckout";
import {
  getAuthEnvironmentStatus,
  getPracticeSeatEnvironmentStatus,
} from "../config/environment";
import { createRateLimitMiddleware } from "../config/rateLimit";
import { getPostgresPool } from "../db/postgres";
import {
  getEnrollmentStore,
  getPracticeSeatPackStore,
  getPurchaseStore,
} from "./stripeWebhook";
import { preparePracticeInquiryLeadRecord } from "../commerce/practiceInquiryStore";
import { getLearnerInterestStore, getPracticeInquiryStore } from "./checkout";

interface PasswordlessStartRequestBody {
  email?: string;
}

const passwordlessStartRateLimit = createRateLimitMiddleware({
  label: "passwordless-start",
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

interface PracticeSeatAssignmentRequestBody {
  learnerEmail?: string;
}

interface AccessRevocationRequestBody {
  targetType?: string;
  enrollmentId?: string;
  assignmentId?: string;
  seatPackId?: string;
}

type PracticeSeatAdminAuthorization =
  | { authorized: true }
  | { authorized: false; status: number; payload: Record<string, unknown> };

function getAccessRevocationTarget(
  body: AccessRevocationRequestBody
): AccessRevocationTarget | null {
  if (body.targetType === "enrollment" && body.enrollmentId) {
    return { type: "enrollment", enrollmentId: body.enrollmentId };
  }

  if (body.targetType === "practice-seat-assignment" && body.assignmentId) {
    return {
      type: "practice-seat-assignment",
      assignmentId: body.assignmentId,
    };
  }

  if (body.targetType === "practice-seat-pack" && body.seatPackId) {
    return {
      type: "practice-seat-pack",
      seatPackId: body.seatPackId,
    };
  }

  return null;
}

function createAuthStores(): {
  magicLinkStore: MagicLinkStore;
  sessionStore: AuthSessionStore;
} {
  const postgresPool = getPostgresPool();

  if (postgresPool) {
    return {
      magicLinkStore: createPostgresMagicLinkStore(postgresPool),
      sessionStore: createPostgresAuthSessionStore(postgresPool),
    };
  }

  return {
    magicLinkStore: createInMemoryMagicLinkStore(),
    sessionStore: createInMemoryAuthSessionStore(),
  };
}

const { magicLinkStore, sessionStore } = createAuthStores();

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

export function listPreparedMagicLinks() {
  return magicLinkStore.listMagicLinks();
}

export function listPreparedSessions() {
  return sessionStore.listSessions();
}

export function getSessionStore() {
  return sessionStore;
}

function authorizePracticeSeatAdminRequest(
  req: Request
): PracticeSeatAdminAuthorization {
  const environmentStatus = getPracticeSeatEnvironmentStatus();
  const configuredToken = process.env.PRACTICE_SEAT_ADMIN_TOKEN?.trim();

  if (!environmentStatus.practiceSeatAdminConfigured || !configuredToken) {
    return {
      authorized: false,
      status: 503,
      payload: {
        error: "Practice seat assignment is not configured yet.",
        missing: environmentStatus.missingPracticeSeatAdminVariables,
      },
    };
  }

  if (req.get("x-admin-token") !== configuredToken) {
    return {
      authorized: false,
      status: 403,
      payload: { error: "Practice seat assignment is protected." },
    };
  }

  return { authorized: true };
}

export function setupAuthRoutes(router: Router) {
  router.post(
    "/auth/passwordless/start",
    passwordlessStartRateLimit,
    async (req: Request, res: Response) => {
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

        await magicLinkStore.storeMagicLink(
          prepared.signInRequest.magicLinkRecord
        );
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
        const status =
          message === "Sign-in email could not be sent." ? 502 : 400;

        res.status(status).json({ error: message });
      }
    }
  );

  router.get("/auth/callback", async (req: Request, res: Response) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const result = await consumeMagicLink({
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

  router.get("/auth/session", async (req: Request, res: Response) => {
    const sessionToken = getCookieValue(req.get("cookie"), COOKIE_NAME);
    const access = await authorizeLearnerSession({
      rawSessionToken: sessionToken,
      sessionStore,
      enrollmentStore: getEnrollmentStore(),
    });

    res.json(access);
  });

  router.post(
    "/practice-seat-packs/:seatPackId/assignments",
    async (req: Request, res: Response) => {
      const authorization = authorizePracticeSeatAdminRequest(req);

      if (!authorization.authorized) {
        res.status(authorization.status).json(authorization.payload);
        return;
      }

      const { learnerEmail } = (req.body ??
        {}) as PracticeSeatAssignmentRequestBody;
      const result = await assignPracticeSeatToLearner({
        seatPackId: req.params.seatPackId,
        learnerEmail: learnerEmail ?? "",
        practiceSeatPackStore: getPracticeSeatPackStore(),
        enrollmentStore: getEnrollmentStore(),
      });

      if (!result.assigned) {
        const status = result.reason.includes("not found")
          ? 404
          : result.reason.includes("no seats remaining")
            ? 409
            : 400;

        res.status(status).json({ error: result.reason });
        return;
      }

      res.status(result.enrollmentProvisioned ? 201 : 200).json({
        assignment: result.assignment,
        enrollment: result.enrollment,
        enrollmentProvisioned: result.enrollmentProvisioned,
        seatPack: result.seatPack,
      });
    }
  );

  router.get("/practice-seat-packs", async (req: Request, res: Response) => {
    const authorization = authorizePracticeSeatAdminRequest(req);

    if (!authorization.authorized) {
      res.status(authorization.status).json(authorization.payload);
      return;
    }

    const practiceSeatPackStore = getPracticeSeatPackStore();

    res.json({
      seatPacks: await practiceSeatPackStore.listPracticeSeatPacks(),
      assignments: await practiceSeatPackStore.listPracticeSeatAssignments(),
    });
  });

  router.get("/support/buyer-lookup", async (req: Request, res: Response) => {
    const authorization = authorizePracticeSeatAdminRequest(req);

    if (!authorization.authorized) {
      res.status(authorization.status).json(authorization.payload);
      return;
    }

    const email = typeof req.query.email === "string" ? req.query.email : "";

    try {
      const profile = await lookupBuyerSupportProfile({
        email,
        stores: {
          purchaseStore: getPurchaseStore(),
          enrollmentStore: getEnrollmentStore(),
          practiceSeatPackStore: getPracticeSeatPackStore(),
        },
      });

      res.json(profile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Buyer support lookup failed.";

      res.status(400).json({ error: message });
    }
  });

  router.post(
    "/support/access-revocations",
    async (req: Request, res: Response) => {
      const authorization = authorizePracticeSeatAdminRequest(req);

      if (!authorization.authorized) {
        res.status(authorization.status).json(authorization.payload);
        return;
      }

      const target = getAccessRevocationTarget(
        (req.body ?? {}) as AccessRevocationRequestBody
      );

      if (!target) {
        res.status(400).json({
          error:
            "Choose one revocation target: enrollment, practice-seat-assignment, or practice-seat-pack.",
        });
        return;
      }

      const result = await revokeAccess({
        target,
        stores: {
          enrollmentStore: getEnrollmentStore(),
          practiceSeatPackStore: getPracticeSeatPackStore(),
        },
      });

      res.status(result.revoked ? 200 : 404).json(result);
    }
  );

  router.get(
    "/support/practice-inquiries",
    async (req: Request, res: Response) => {
      const authorization = authorizePracticeSeatAdminRequest(req);

      if (!authorization.authorized) {
        res.status(authorization.status).json(authorization.payload);
        return;
      }

      res.json({
        inquiries: (
          await getPracticeInquiryStore().listPracticeInquiries()
        ).map(preparePracticeInquiryLeadRecord),
        learnerInterests:
          await getLearnerInterestStore().listLearnerInterests(),
      });
    }
  );
}
