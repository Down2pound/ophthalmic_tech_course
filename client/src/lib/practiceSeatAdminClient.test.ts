import { describe, expect, it, vi } from "vitest";
import {
  assignPracticeSeat,
  fetchPracticeInquiries,
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

describe("fetchPracticeInquiries", () => {
  it("loads protected practice inquiries with the admin token header", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        inquiries: [
          {
            inquiryId: "practice_inquiry_123",
            practiceName: "Example Eye Care",
            contactName: "Dr. Manager",
            contactEmail: "manager@example.com",
            targetTimeline: "Next hiring class",
            message: "Need custom onboarding.",
            status: "new",
            createdAt: "2026-07-13T12:00:00.000Z",
            followUpPlan: {
              priority: "high",
              recommendedOffer: "Custom practice onboarding call",
              nextAction: "Reply within 1 business day.",
              talkingPoints: ["Confirm learner count."],
            },
          },
        ],
        learnerInterests: [
          {
            interestId: "learner_interest_123",
            learnerName: "Future Tech",
            email: "learner@example.com",
            background: "medical-assistant",
            goal: "I want to move into ophthalmology.",
            status: "new",
            createdAt: "2026-07-16T12:30:00.000Z",
          },
        ],
      }),
    });

    await expect(
      fetchPracticeInquiries({ adminToken: "admin-token", fetcher })
    ).resolves.toMatchObject({
      inquiries: [
        {
          practiceName: "Example Eye Care",
          followUpPlan: {
            priority: "high",
            recommendedOffer: "Custom practice onboarding call",
          },
        },
      ],
      learnerInterests: [
        {
          learnerName: "Future Tech",
          email: "learner@example.com",
        },
      ],
    });
    expect(fetcher).toHaveBeenCalledWith("/api/support/practice-inquiries", {
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": "admin-token",
      },
    });
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
