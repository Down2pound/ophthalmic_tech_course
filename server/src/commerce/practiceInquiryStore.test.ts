import { describe, expect, it, vi } from "vitest";
import {
  createInMemoryPracticeInquiryStore,
  createPracticeInquiryNotificationMessage,
  preparePracticeInquiryRecord,
  sendPracticeInquiryNotification,
} from "./practiceInquiryStore";

const inquiryInput = {
  practiceName: " Example Eye Care ",
  contactName: " Dr. Manager ",
  contactEmail: " Manager@Example.COM ",
  estimatedLearnerCount: 18,
  targetTimeline: "Next hiring class",
  message:
    "We want help planning onboarding for new ophthalmic assistants. No patient information included.",
};

describe("preparePracticeInquiryRecord", () => {
  it("normalizes and validates practice inquiry lead details", () => {
    expect(
      preparePracticeInquiryRecord({
        inquiry: inquiryInput,
        createdAt: "2026-07-13T12:00:00.000Z",
      })
    ).toMatchObject({
      inquiryId: "practice_inquiry_20260713120000_manager_example_com",
      practiceName: "Example Eye Care",
      contactName: "Dr. Manager",
      contactEmail: "manager@example.com",
      estimatedLearnerCount: 18,
      targetTimeline: "Next hiring class",
      status: "new",
      createdAt: "2026-07-13T12:00:00.000Z",
    });
  });

  it("rejects incomplete or invalid inquiry details", () => {
    expect(() =>
      preparePracticeInquiryRecord({
        inquiry: {
          ...inquiryInput,
          contactEmail: "not-an-email",
        },
      })
    ).toThrow("A valid contact email is required.");
    expect(() =>
      preparePracticeInquiryRecord({
        inquiry: {
          ...inquiryInput,
          practiceName: " ",
        },
      })
    ).toThrow("Practice name is required.");
  });
});

describe("createInMemoryPracticeInquiryStore", () => {
  it("records and lists practice inquiries newest first", async () => {
    const store = createInMemoryPracticeInquiryStore();
    const first = preparePracticeInquiryRecord({
      inquiry: inquiryInput,
      createdAt: "2026-07-13T12:00:00.000Z",
    });
    const second = preparePracticeInquiryRecord({
      inquiry: {
        ...inquiryInput,
        contactEmail: "second@example.com",
      },
      createdAt: "2026-07-14T12:00:00.000Z",
    });

    await store.recordPracticeInquiry(first);
    await store.recordPracticeInquiry(second);

    expect(await store.listPracticeInquiries()).toEqual([second, first]);
  });
});

describe("createPracticeInquiryNotificationMessage", () => {
  it("builds a safe internal lead notification", () => {
    const inquiry = preparePracticeInquiryRecord({
      inquiry: inquiryInput,
      createdAt: "2026-07-13T12:00:00.000Z",
    });

    expect(
      createPracticeInquiryNotificationMessage({
        inquiry,
        from: "OptiTech Academy <noreply@example.com>",
        to: "jeff@example.com",
      })
    ).toMatchObject({
      from: "OptiTech Academy <noreply@example.com>",
      to: "jeff@example.com",
      subject: "OptiTech practice inquiry: Example Eye Care",
    });
  });
});

describe("sendPracticeInquiryNotification", () => {
  it("posts the notification through the configured transactional email endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "email_123" }),
    });
    const inquiry = preparePracticeInquiryRecord({
      inquiry: inquiryInput,
      createdAt: "2026-07-13T12:00:00.000Z",
    });

    await expect(
      sendPracticeInquiryNotification({
        inquiry,
        from: "OptiTech Academy <noreply@example.com>",
        to: "jeff@example.com",
        apiUrl: "https://api.resend.com/emails",
        apiKey: "email-api-key",
        fetcher,
      })
    ).resolves.toEqual({
      sent: true,
      providerMessageId: "email_123",
    });
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({
      to: "jeff@example.com",
      subject: "OptiTech practice inquiry: Example Eye Care",
    });
  });
});
