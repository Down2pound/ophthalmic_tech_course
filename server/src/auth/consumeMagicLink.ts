import { randomUUID } from "node:crypto";
import { COOKIE_NAME } from "../../../shared/const";
import { hashMagicLinkToken, verifyMagicLinkToken } from "./magicLinkToken";
import type { MagicLinkStore } from "./magicLinkStore";
import {
  createAuthSession,
  createRawSessionToken,
  type AuthSessionRecord,
  type AuthSessionStore,
} from "./sessionStore";

export interface SessionCookie {
  name: string;
  value: string;
  maxAgeSeconds: number;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
}

export type ConsumeMagicLinkResult =
  | {
      ok: true;
      email: string;
      session: AuthSessionRecord;
      cookie: SessionCookie;
    }
  | {
      ok: false;
      status: 401;
      error: string;
    };

interface ConsumeMagicLinkInput {
  rawToken: string;
  magicLinkStore: MagicLinkStore;
  sessionStore: AuthSessionStore;
  now?: () => string;
  createSessionRawToken?: () => string;
  createSessionId?: () => string;
  secureCookie?: boolean;
}

const INVALID_LINK_RESPONSE: ConsumeMagicLinkResult = {
  ok: false,
  status: 401,
  error: "Sign-in link is invalid or expired.",
};

function createDefaultSessionId(): string {
  return `session_${randomUUID()}`;
}

export function consumeMagicLink({
  rawToken,
  magicLinkStore,
  sessionStore,
  now = () => new Date().toISOString(),
  createSessionRawToken = createRawSessionToken,
  createSessionId = createDefaultSessionId,
  secureCookie = process.env.NODE_ENV === "production",
}: ConsumeMagicLinkInput): ConsumeMagicLinkResult {
  const tokenHash = hashMagicLinkToken(rawToken);
  const magicLink = magicLinkStore.findMagicLinkByTokenHash(tokenHash);
  const consumedAt = now();

  if (
    !magicLink ||
    magicLink.consumedAt ||
    new Date(magicLink.expiresAt).getTime() <= new Date(consumedAt).getTime() ||
    !verifyMagicLinkToken(rawToken, magicLink.tokenHash)
  ) {
    return INVALID_LINK_RESPONSE;
  }

  const rawSessionToken = createSessionRawToken();
  const session = createAuthSession({
    email: magicLink.email,
    rawSessionToken,
    id: createSessionId(),
    createdAt: consumedAt,
  });

  magicLinkStore.markMagicLinkConsumed(magicLink.id, consumedAt);
  sessionStore.storeSession(session);

  return {
    ok: true,
    email: session.email,
    session,
    cookie: {
      name: COOKIE_NAME,
      value: rawSessionToken,
      maxAgeSeconds: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie,
      path: "/",
    },
  };
}
