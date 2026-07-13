import { describe, expect, it, vi } from "vitest";
import {
  createMagicLinkEmailMessage,
  sendMagicLinkEmail,
} from "./magicLinkEmail";

const emailPayload = {
  to: "learner@example.com",
  subject: "Your OptiTech Academy sign-in link",
  signInUrl:
    "https://optitech.example.com/api/auth/callback?token=private-token",
};

describe("createMagicLinkEmailMessage", () => {
  it("builds learner-facing text and html email content", () => {
    expect(
      createMagicLinkEmailMessage({
        payload: emailPayload,
        from: "OptiTech Academy <noreply@example.com>",
      })
    ).toEqual({
      from: "OptiTech Academy <noreply@example.com>",
      to: "learner@example.com",
      subject: "Your OptiTech Academy sign-in link",
      text:
        "Use this secure link to sign in to OptiTech Academy: https://optitech.example.com/api/auth/callback?token=private-token\n\nThis link expires soon and can only be used once.",
      html:
        '<p>Use this secure link to sign in to OptiTech Academy:</p><p><a href="https://optitech.example.com/api/auth/callback?token=private-token">Sign in to OptiTech Academy</a></p><p>This link expires soon and can only be used once.</p>',
    });
  });
});

describe("sendMagicLinkEmail", () => {
  it("posts the sign-in email to the configured transactional email endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "email_123" }),
    });

    await expect(
      sendMagicLinkEmail({
        payload: emailPayload,
        from: "OptiTech Academy <noreply@example.com>",
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
      subject: "Your OptiTech Academy sign-in link",
    });
  });

  it("surfaces provider failures without exposing the sign-in url", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Provider rejected request" }),
    });

    await expect(
      sendMagicLinkEmail({
        payload: emailPayload,
        from: "OptiTech Academy <noreply@example.com>",
        apiUrl: "https://api.resend.com/emails",
        apiKey: "email-api-key",
        fetcher,
      })
    ).rejects.toThrow("Sign-in email could not be sent.");
  });
});
