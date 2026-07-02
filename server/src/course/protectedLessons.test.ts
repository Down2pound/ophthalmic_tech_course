import { describe, expect, it } from "vitest";
import { getProtectedModuleOneLessons } from "./protectedLessons";

describe("getProtectedModuleOneLessons", () => {
  it("returns module one lessons for an authorized learner", () => {
    const response = getProtectedModuleOneLessons({
      authenticated: true,
      hasAccess: true,
      email: "learner@example.com",
      offerId: "founding-learner",
      accessStartedAt: "2026-07-01T12:00:00.000Z",
      accessExpiresAt: "2027-07-01T12:00:00.000Z",
    });

    expect(response.status).toBe(200);
    expect(response.payload).toMatchObject({
      module: {
        id: "entering-ophthalmic-care",
      },
      access: {
        email: "learner@example.com",
        offerId: "founding-learner",
      },
    });
    expect(response.payload.lessons).toHaveLength(3);
    expect(response.payload.lessons[0].body.length).toBeGreaterThan(0);
  });

  it("does not return paid lesson bodies when the learner lacks access", () => {
    const response = getProtectedModuleOneLessons({
      authenticated: true,
      hasAccess: false,
      email: "learner@example.com",
      reason: "No active enrollment found.",
    });

    expect(response).toEqual({
      status: 403,
      payload: {
        error: "No active enrollment found.",
      },
    });
    expect(JSON.stringify(response.payload)).not.toContain(
      "Ophthalmic technicians help"
    );
  });
});
