import { describe, expect, it } from "vitest";
import {
  createInMemoryLearnerInterestStore,
  createLearnerInterestNotificationMessage,
  prepareLearnerInterestRecord,
} from "./learnerInterestStore";

const interestInput = {
  learnerName: " Future Tech ",
  email: " Learner@Example.COM ",
  background: "medical-assistant",
  goal: "I want to move into ophthalmology and understand clinic basics.",
};

describe("prepareLearnerInterestRecord", () => {
  it("normalizes learner interest leads for founding access follow-up", () => {
    expect(
      prepareLearnerInterestRecord({
        interest: interestInput,
        createdAt: "2026-07-16T12:30:00.000Z",
      })
    ).toMatchObject({
      interestId: "learner_interest_20260716123000_learner_example_com",
      learnerName: "Future Tech",
      email: "learner@example.com",
      background: "medical-assistant",
      goal: "I want to move into ophthalmology and understand clinic basics.",
      status: "new",
      createdAt: "2026-07-16T12:30:00.000Z",
    });
  });

  it("rejects invalid learner interest details", () => {
    expect(() =>
      prepareLearnerInterestRecord({
        interest: {
          ...interestInput,
          email: "not-an-email",
        },
      })
    ).toThrow("A valid learner email is required.");
    expect(() =>
      prepareLearnerInterestRecord({
        interest: {
          ...interestInput,
          goal: " ",
        },
      })
    ).toThrow("A short learning goal is required.");
  });
});

describe("createInMemoryLearnerInterestStore", () => {
  it("records and lists learner interests newest first", async () => {
    const store = createInMemoryLearnerInterestStore();
    const first = prepareLearnerInterestRecord({
      interest: interestInput,
      createdAt: "2026-07-16T12:30:00.000Z",
    });
    const second = prepareLearnerInterestRecord({
      interest: {
        ...interestInput,
        email: "second@example.com",
      },
      createdAt: "2026-07-16T13:30:00.000Z",
    });

    await store.recordLearnerInterest(first);
    await store.recordLearnerInterest(second);

    expect(await store.listLearnerInterests()).toEqual([second, first]);
  });
});

describe("createLearnerInterestNotificationMessage", () => {
  it("builds a safe internal learner lead notification", () => {
    const interest = prepareLearnerInterestRecord({
      interest: interestInput,
      createdAt: "2026-07-16T12:30:00.000Z",
    });

    expect(
      createLearnerInterestNotificationMessage({
        interest,
        from: "OptiTech Academy <noreply@example.com>",
        to: "jeff@example.com",
      })
    ).toMatchObject({
      from: "OptiTech Academy <noreply@example.com>",
      to: "jeff@example.com",
      subject: "OptiTech learner interest: Future Tech",
      text: expect.stringContaining("Recommended next step"),
    });
  });
});
