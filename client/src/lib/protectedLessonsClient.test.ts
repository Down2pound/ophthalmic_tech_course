import { describe, expect, it, vi } from "vitest";
import { fetchProtectedModuleOneLessons } from "./protectedLessonsClient";

describe("fetchProtectedModuleOneLessons", () => {
  it("fetches paid lesson content with cookies included", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        module: { id: "entering-ophthalmic-care", title: "Entering Care" },
        lessons: [{ id: "lesson-1", body: ["Paid lesson text"] }],
        access: {
          authenticated: true,
          hasAccess: true,
          email: "learner@example.com",
          offerId: "founding-learner",
          accessStartedAt: "2026-07-01T12:00:00.000Z",
          accessExpiresAt: "2027-07-01T12:00:00.000Z",
        },
      }),
    });

    await expect(fetchProtectedModuleOneLessons({ fetcher })).resolves.toEqual({
      module: { id: "entering-ophthalmic-care", title: "Entering Care" },
      lessons: [{ id: "lesson-1", body: ["Paid lesson text"] }],
      access: {
        authenticated: true,
        hasAccess: true,
        email: "learner@example.com",
        offerId: "founding-learner",
        accessStartedAt: "2026-07-01T12:00:00.000Z",
        accessExpiresAt: "2027-07-01T12:00:00.000Z",
      },
    });
    expect(fetcher).toHaveBeenCalledWith("/api/learn/module-one/lessons", {
      credentials: "include",
    });
  });

  it("surfaces access errors without returning lesson content", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "No active enrollment found." }),
    });

    await expect(fetchProtectedModuleOneLessons({ fetcher })).rejects.toThrow(
      "No active enrollment found."
    );
  });
});
