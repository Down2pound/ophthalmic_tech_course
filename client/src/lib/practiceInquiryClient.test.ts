import { describe, expect, it, vi } from "vitest";
import { submitPracticeInquiry } from "./practiceInquiryClient";

const inquiry = {
  practiceName: "Example Eye Care",
  contactName: "Dr. Manager",
  contactEmail: " Manager@Example.COM ",
  estimatedLearnerCount: 18,
  targetTimeline: "Next hiring class",
  message: "We want help planning onboarding for new ophthalmic assistants.",
};

describe("submitPracticeInquiry", () => {
  it("posts a normalized practice inquiry to the server", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        inquiry: {
          inquiryId: "practice_inquiry_123",
          practiceName: "Example Eye Care",
          contactEmail: "manager@example.com",
        },
        notification: {
          attempted: true,
          sent: true,
        },
      }),
    });

    await expect(
      submitPracticeInquiry({ inquiry, fetcher })
    ).resolves.toEqual({
      inquiryId: "practice_inquiry_123",
      notificationSent: true,
    });
    expect(fetcher).toHaveBeenCalledWith(
      "/api/practice-inquiries",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({
      practiceName: "Example Eye Care",
      contactEmail: "manager@example.com",
      estimatedLearnerCount: 18,
    });
  });

  it("requires enough information before contacting the server", async () => {
    const fetcher = vi.fn();

    await expect(
      submitPracticeInquiry({
        inquiry: {
          ...inquiry,
          contactEmail: "not-an-email",
        },
        fetcher,
      })
    ).rejects.toThrow("Enter a valid contact email.");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("surfaces server errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Practice name is required." }),
    });

    await expect(
      submitPracticeInquiry({ inquiry, fetcher })
    ).rejects.toThrow("Practice name is required.");
  });
});
