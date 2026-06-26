import { describe, expect, it } from "vitest";
import { preparePasswordlessSignInResponse } from "./passwordlessSignInResponse";

describe("preparePasswordlessSignInResponse", () => {
  it("keeps token details out of the public API response", () => {
    const prepared = preparePasswordlessSignInResponse({
      email: " Learner@Example.com ",
      appBaseUrl: "https://optitech.example.com",
      now: () => "2026-06-26T12:00:00.000Z",
      createToken: () => ({
        rawToken: "private-raw-token",
        tokenHash: "stored-token-hash",
      }),
      createId: () => "magic_link_123",
    });

    expect(prepared.publicResponse).toEqual({
      ok: true,
      message:
        "If that email can access OptiTech Academy, a sign-in link will be sent.",
    });
    expect(JSON.stringify(prepared.publicResponse)).not.toContain(
      "private-raw-token"
    );
    expect(JSON.stringify(prepared.publicResponse)).not.toContain(
      "stored-token-hash"
    );
    expect(JSON.stringify(prepared.publicResponse)).not.toContain(
      "auth/callback"
    );
    expect(prepared.signInRequest.emailPayload.signInUrl).toContain(
      "private-raw-token"
    );
    expect(prepared.signInRequest.magicLinkRecord.tokenHash).toBe(
      "stored-token-hash"
    );
  });
});
