import { describe, expect, it, vi } from "vitest";
import {
  createPurchaseWelcomeEmailMessage,
  sendPurchaseWelcomeEmail,
} from "./purchaseWelcomeEmail";
import type { PurchaseEvent } from "./stripeWebhook";

const individualPurchase: PurchaseEvent = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 19900,
  currency: "usd",
  accessMonths: 12,
};

const practicePurchase: PurchaseEvent = {
  ...individualPurchase,
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_test_practice",
  offerId: "practice-five-seat-pack",
  purchaserEmail: "manager@example.com",
  amountTotal: 79900,
  seatCount: 5,
};

describe("createPurchaseWelcomeEmailMessage", () => {
  it("builds a founding learner welcome email with safe next steps", () => {
    const message = createPurchaseWelcomeEmailMessage({
      purchase: individualPurchase,
      from: "OptiTech Academy <noreply@example.com>",
      publicAppUrl: "https://academy.example.com",
    });

    expect(message).toMatchObject({
      from: "OptiTech Academy <noreply@example.com>",
      to: "learner@example.com",
      subject: "Welcome to OptiTech Academy",
    });
    expect(message.text).toContain("Start learning here");
    expect(message.text).toContain("https://academy.example.com/learn");
    expect(message.text).toContain("request a passwordless sign-in link");
    expect(message.text).toContain("https://academy.example.com/buyer-guide");
    expect(message.text).toContain("foundational education");
    expect(message.text).toContain("Support reference");
    expect(message.text).toContain("Checkout session: cs_test_123");
    expect(message.text).toContain("Stripe event: evt_123");
    expect(message.text).toContain("Do not send patient information");
  });

  it("builds a practice-pack welcome email with seat setup next steps", () => {
    const message = createPurchaseWelcomeEmailMessage({
      purchase: practicePurchase,
      from: "OptiTech Academy <noreply@example.com>",
      publicAppUrl: "https://academy.example.com",
    });

    expect(message).toMatchObject({
      to: "manager@example.com",
      subject: "Your OptiTech Academy practice seats are ready",
    });
    expect(message.text).toContain("Practice seat setup starts here");
    expect(message.text).toContain(
      "https://academy.example.com/practice-seat-admin"
    );
    expect(message.text).toContain("choose the learner emails");
    expect(message.text).toContain("one learner email per seat");
    expect(message.text).toContain("Checkout session: cs_test_practice");
    expect(message.text).toContain("Stripe event: evt_practice");
    expect(message.text).toContain("local protocols");
    expect(message.text).toContain("Do not send patient information");
  });
});

describe("sendPurchaseWelcomeEmail", () => {
  it("posts the welcome email to the configured transactional email endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "email_123" }),
    });

    await expect(
      sendPurchaseWelcomeEmail({
        purchase: individualPurchase,
        from: "OptiTech Academy <noreply@example.com>",
        publicAppUrl: "https://academy.example.com",
        apiUrl: "https://api.resend.com/emails",
        apiKey: "email-api-key",
        fetcher,
      })
    ).resolves.toEqual({
      sent: true,
      providerMessageId: "email_123",
    });
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer email-api-key",
          "Content-Type": "application/json",
        },
      })
    );
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({
      to: "learner@example.com",
      subject: "Welcome to OptiTech Academy",
    });
  });
});
