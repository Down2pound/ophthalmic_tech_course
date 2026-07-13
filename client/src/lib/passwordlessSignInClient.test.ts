import { describe, expect, it, vi } from "vitest";
import { requestPasswordlessSignInLink } from "./passwordlessSignInClient";

describe("requestPasswordlessSignInLink", () => {
  it("requests a sign-in link for a normalized checkout email", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        message:
          "If that email can access OptiTech Academy, a sign-in link will be sent.",
      }),
    });

    await expect(
      requestPasswordlessSignInLink({
        email: " Learner@Example.COM ",
        fetcher,
      })
    ).resolves.toEqual({
      message:
        "If that email can access OptiTech Academy, a sign-in link will be sent.",
    });

    expect(fetcher).toHaveBeenCalledWith("/api/auth/passwordless/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "learner@example.com" }),
    });
  });

  it("requires a valid email before contacting the server", async () => {
    const fetcher = vi.fn();

    await expect(
      requestPasswordlessSignInLink({ email: "learner", fetcher })
    ).rejects.toThrow("Enter the same email used for checkout.");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("surfaces API errors without exposing sign-in tokens", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Passwordless sign-in email is not configured yet.",
      }),
    });

    await expect(
      requestPasswordlessSignInLink({
        email: "learner@example.com",
        fetcher,
      })
    ).rejects.toThrow("Passwordless sign-in email is not configured yet.");
  });
});
