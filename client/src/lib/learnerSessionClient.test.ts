import { describe, expect, it, vi } from "vitest";
import { fetchLearnerSessionAccess } from "./learnerSessionClient";

describe("fetchLearnerSessionAccess", () => {
  it("reads the current learner access status from the server", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        authenticated: true,
        hasAccess: true,
        email: "learner@example.com",
        offerId: "founding-learner",
        accessStartedAt: "2026-07-01T12:00:00.000Z",
        accessExpiresAt: "2027-07-01T12:00:00.000Z",
      }),
    });

    await expect(fetchLearnerSessionAccess({ fetcher })).resolves.toEqual({
      authenticated: true,
      hasAccess: true,
      email: "learner@example.com",
      offerId: "founding-learner",
      accessStartedAt: "2026-07-01T12:00:00.000Z",
      accessExpiresAt: "2027-07-01T12:00:00.000Z",
    });
    expect(fetcher).toHaveBeenCalledWith("/api/auth/session", {
      credentials: "include",
    });
  });

  it("throws a friendly error when the session endpoint fails", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Session unavailable." }),
    });

    await expect(fetchLearnerSessionAccess({ fetcher })).rejects.toThrow(
      "Session unavailable."
    );
  });
});
