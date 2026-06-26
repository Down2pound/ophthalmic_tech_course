import { describe, expect, it } from "vitest";
import { requestPasswordlessSignIn } from "./passwordlessSignIn";

describe("requestPasswordlessSignIn", () => {
  it("creates a magic-link email payload and stores only the token hash", () => {
    const request = requestPasswordlessSignIn({
      email: " Learner@Example.com ",
      appBaseUrl: "https://optitech.example.com/",
      now: () => "2026-06-26T12:00:00.000Z",
      createToken: () => ({
        rawToken: "raw-token-value",
        tokenHash: "stored-token-hash",
      }),
      createId: () => "magic_link_123",
    });

    expect(request).toEqual({
      email: "learner@example.com",
      rawToken: "raw-token-value",
      magicLinkRecord: {
        id: "magic_link_123",
        email: "learner@example.com",
        tokenHash: "stored-token-hash",
        purpose: "sign-in",
        createdAt: "2026-06-26T12:00:00.000Z",
        expiresAt: "2026-06-26T12:15:00.000Z",
      },
      emailPayload: {
        to: "learner@example.com",
        subject: "Your OptiTech Academy sign-in link",
        signInUrl:
          "https://optitech.example.com/auth/callback?token=raw-token-value",
      },
    });
    expect(JSON.stringify(request.magicLinkRecord)).not.toContain(
      "raw-token-value"
    );
  });

  it("rejects blank email addresses", () => {
    expect(() =>
      requestPasswordlessSignIn({
        email: " ",
        appBaseUrl: "https://optitech.example.com",
      })
    ).toThrow("Email is required.");
  });
});
