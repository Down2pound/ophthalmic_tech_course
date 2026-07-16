import { describe, expect, it, vi } from "vitest";
import { submitLearnerInterest } from "./learnerInterestClient";

const interest = {
  learnerName: "Future Tech",
  email: "Learner@Example.COM",
  background: "medical-assistant",
  goal: "I want to move into ophthalmology.",
};

describe("submitLearnerInterest", () => {
  it("posts a normalized learner interest lead to the server", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        interest: {
          interestId: "learner_interest_123",
          email: "learner@example.com",
        },
        notification: {
          attempted: true,
          sent: true,
        },
      }),
    });

    await expect(submitLearnerInterest({ interest, fetcher })).resolves.toEqual(
      {
        interestId: "learner_interest_123",
        notificationSent: true,
      }
    );
    expect(fetcher).toHaveBeenCalledWith("/api/learner-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...interest,
        email: "learner@example.com",
      }),
    });
  });

  it("validates required learner interest fields before posting", async () => {
    const fetcher = vi.fn();

    await expect(
      submitLearnerInterest({
        interest: {
          ...interest,
          email: "not-an-email",
        },
        fetcher,
      })
    ).rejects.toThrow("Enter a valid email.");

    expect(fetcher).not.toHaveBeenCalled();
  });
});
