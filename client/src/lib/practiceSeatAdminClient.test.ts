import { describe, expect, it, vi } from "vitest";
import {
  assignPracticeSeat,
  fetchPracticeSeatPacks,
} from "./practiceSeatAdminClient";

describe("fetchPracticeSeatPacks", () => {
  it("loads protected seat packs with the admin token header", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ seatPacks: [], assignments: [] }),
    });

    await expect(
      fetchPracticeSeatPacks({ adminToken: "admin-token", fetcher })
    ).resolves.toEqual({ seatPacks: [], assignments: [] });
    expect(fetcher).toHaveBeenCalledWith("/api/practice-seat-packs", {
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": "admin-token",
      },
    });
  });

  it("surfaces list errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Practice seat assignment is protected." }),
    });

    await expect(
      fetchPracticeSeatPacks({ adminToken: "bad-token", fetcher })
    ).rejects.toThrow("Practice seat assignment is protected.");
  });
});

describe("assignPracticeSeat", () => {
  it("posts learner email to a protected seat pack assignment endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        assignment: { learnerEmail: "tech@example.com" },
        enrollmentProvisioned: true,
        seatPack: { seatPackId: "seatpack_cs_123" },
      }),
    });

    await assignPracticeSeat({
      adminToken: "admin-token",
      seatPackId: "seatpack_cs_123",
      learnerEmail: "tech@example.com",
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/practice-seat-packs/seatpack_cs_123/assignments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": "admin-token",
        },
        body: JSON.stringify({ learnerEmail: "tech@example.com" }),
      }
    );
  });
});
