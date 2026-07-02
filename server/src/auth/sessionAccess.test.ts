import { describe, expect, it } from "vitest";
import { createInMemoryEnrollmentStore } from "../commerce/enrollmentStore";
import { authorizeLearnerSession } from "./sessionAccess";
import {
  createAuthSession,
  createInMemoryAuthSessionStore,
} from "./sessionStore";

describe("authorizeLearnerSession", () => {
  it("grants access when the session and enrollment are active", () => {
    const sessionStore = createInMemoryAuthSessionStore();
    const enrollmentStore = createInMemoryEnrollmentStore();

    sessionStore.storeSession(
      createAuthSession({
        email: "learner@example.com",
        rawSessionToken: "private-session-token",
        id: "session_123",
        createdAt: "2026-07-02T12:00:00.000Z",
      })
    );
    enrollmentStore.provisionEnrollment({
      enrollmentId: "enrollment_123",
      checkoutSessionId: "cs_123",
      offerId: "founding-learner",
      learnerEmail: "learner@example.com",
      status: "active",
      accessStartedAt: "2026-07-01T12:00:00.000Z",
      accessExpiresAt: "2027-07-01T12:00:00.000Z",
    });

    expect(
      authorizeLearnerSession({
        rawSessionToken: "private-session-token",
        sessionStore,
        enrollmentStore,
        now: "2026-07-02T12:05:00.000Z",
      })
    ).toEqual({
      authenticated: true,
      hasAccess: true,
      email: "learner@example.com",
      offerId: "founding-learner",
      accessStartedAt: "2026-07-01T12:00:00.000Z",
      accessExpiresAt: "2027-07-01T12:00:00.000Z",
    });
  });

  it("denies access for missing, expired, or unenrolled sessions", () => {
    const sessionStore = createInMemoryAuthSessionStore();
    const enrollmentStore = createInMemoryEnrollmentStore();

    sessionStore.storeSession(
      createAuthSession({
        email: "learner@example.com",
        rawSessionToken: "private-session-token",
        id: "session_123",
        createdAt: "2026-07-02T12:00:00.000Z",
        expiresInDays: 1,
      })
    );

    expect(
      authorizeLearnerSession({
        rawSessionToken: "",
        sessionStore,
        enrollmentStore,
        now: "2026-07-02T12:05:00.000Z",
      })
    ).toEqual({
      authenticated: false,
      hasAccess: false,
      reason: "No active session found.",
    });
    expect(
      authorizeLearnerSession({
        rawSessionToken: "private-session-token",
        sessionStore,
        enrollmentStore,
        now: "2026-07-04T12:05:00.000Z",
      })
    ).toEqual({
      authenticated: false,
      hasAccess: false,
      reason: "Session has expired.",
    });
    expect(
      authorizeLearnerSession({
        rawSessionToken: "private-session-token",
        sessionStore,
        enrollmentStore,
        now: "2026-07-02T12:05:00.000Z",
      })
    ).toEqual({
      authenticated: true,
      hasAccess: false,
      email: "learner@example.com",
      reason: "No active enrollment found.",
    });
  });
});
