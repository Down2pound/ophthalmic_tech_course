import type { EnrollmentStore } from "../commerce/enrollmentStore";
import { hashSessionToken, type AuthSessionStore } from "./sessionStore";

export type LearnerSessionAccess =
  | {
      authenticated: true;
      hasAccess: true;
      email: string;
      offerId: string;
      accessStartedAt: string;
      accessExpiresAt: string;
    }
  | {
      authenticated: true;
      hasAccess: false;
      email: string;
      reason: string;
    }
  | {
      authenticated: false;
      hasAccess: false;
      reason: string;
    };

interface AuthorizeLearnerSessionInput {
  rawSessionToken: string;
  sessionStore: AuthSessionStore;
  enrollmentStore: EnrollmentStore;
  now?: string;
}

export async function authorizeLearnerSession({
  rawSessionToken,
  sessionStore,
  enrollmentStore,
  now = new Date().toISOString(),
}: AuthorizeLearnerSessionInput): Promise<LearnerSessionAccess> {
  if (!rawSessionToken) {
    return {
      authenticated: false,
      hasAccess: false,
      reason: "No active session found.",
    };
  }

  const session = sessionStore.findSessionByHash(
    hashSessionToken(rawSessionToken)
  );

  if (!session) {
    return {
      authenticated: false,
      hasAccess: false,
      reason: "No active session found.",
    };
  }

  if (new Date(session.expiresAt).getTime() <= new Date(now).getTime()) {
    return {
      authenticated: false,
      hasAccess: false,
      reason: "Session has expired.",
    };
  }

  const activeEnrollment = (
    await enrollmentStore.findEnrollmentsByEmail(session.email)
  )
    .filter(enrollment => enrollment.status === "active")
    .filter(
      enrollment =>
        new Date(enrollment.accessExpiresAt).getTime() > new Date(now).getTime()
    )
    .sort(
      (left, right) =>
        new Date(right.accessExpiresAt).getTime() -
        new Date(left.accessExpiresAt).getTime()
    )[0];

  if (!activeEnrollment) {
    return {
      authenticated: true,
      hasAccess: false,
      email: session.email,
      reason: "No active enrollment found.",
    };
  }

  return {
    authenticated: true,
    hasAccess: true,
    email: session.email,
    offerId: activeEnrollment.offerId,
    accessStartedAt: activeEnrollment.accessStartedAt,
    accessExpiresAt: activeEnrollment.accessExpiresAt,
  };
}
