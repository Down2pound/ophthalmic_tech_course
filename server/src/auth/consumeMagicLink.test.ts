import { describe, expect, it } from "vitest";
import { hashMagicLinkToken } from "./magicLinkToken";
import { createInMemoryMagicLinkStore } from "./magicLinkStore";
import { consumeMagicLink } from "./consumeMagicLink";
import { createInMemoryAuthSessionStore } from "./sessionStore";

describe("consumeMagicLink", () => {
  it("turns a valid unused magic link into a stored session", async () => {
    const magicLinkStore = createInMemoryMagicLinkStore();
    const sessionStore = createInMemoryAuthSessionStore();
    const rawToken = "valid-raw-token";

    await magicLinkStore.storeMagicLink({
      id: "magic_link_123",
      email: "learner@example.com",
      tokenHash: hashMagicLinkToken(rawToken),
      purpose: "sign-in",
      createdAt: "2026-07-02T12:00:00.000Z",
      expiresAt: "2026-07-02T12:15:00.000Z",
    });

    const result = await consumeMagicLink({
      rawToken,
      magicLinkStore,
      sessionStore,
      now: () => "2026-07-02T12:05:00.000Z",
      createSessionRawToken: () => "private-session-token",
      createSessionId: () => "session_123",
    });

    expect(result).toMatchObject({
      ok: true,
      email: "learner@example.com",
      cookie: {
        name: "app_session_id",
        value: "private-session-token",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    });
    expect(await sessionStore.listSessions()).toHaveLength(1);
    expect(JSON.stringify(await sessionStore.listSessions())).not.toContain(
      "private-session-token"
    );
    expect(
      await magicLinkStore.findMagicLinkByTokenHash(
        hashMagicLinkToken(rawToken)
      )
    ).toMatchObject({ consumedAt: "2026-07-02T12:05:00.000Z" });
  });

  it("rejects expired and already consumed magic links", async () => {
    const magicLinkStore = createInMemoryMagicLinkStore();
    const sessionStore = createInMemoryAuthSessionStore();
    const rawToken = "expired-raw-token";

    await magicLinkStore.storeMagicLink({
      id: "magic_link_expired",
      email: "learner@example.com",
      tokenHash: hashMagicLinkToken(rawToken),
      purpose: "sign-in",
      createdAt: "2026-07-02T12:00:00.000Z",
      expiresAt: "2026-07-02T12:15:00.000Z",
    });

    expect(
      await consumeMagicLink({
        rawToken,
        magicLinkStore,
        sessionStore,
        now: () => "2026-07-02T12:16:00.000Z",
      })
    ).toEqual({
      ok: false,
      status: 401,
      error: "Sign-in link is invalid or expired.",
    });

    expect(await sessionStore.listSessions()).toHaveLength(0);
  });
});
