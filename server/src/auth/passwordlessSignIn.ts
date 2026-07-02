import { randomUUID } from "node:crypto";
import { createMagicLinkToken, type MagicLinkToken } from "./magicLinkToken";

export interface MagicLinkRecord {
  id: string;
  email: string;
  tokenHash: string;
  purpose: "sign-in";
  createdAt: string;
  expiresAt: string;
  consumedAt?: string;
}

export interface MagicLinkEmailPayload {
  to: string;
  subject: string;
  signInUrl: string;
}

export interface PasswordlessSignInRequest {
  email: string;
  rawToken: string;
  magicLinkRecord: MagicLinkRecord;
  emailPayload: MagicLinkEmailPayload;
}

export interface RequestPasswordlessSignInInput {
  email: string;
  appBaseUrl: string;
  now?: () => string;
  createToken?: () => MagicLinkToken;
  createId?: () => string;
  expiresInMinutes?: number;
}

function normalizeEmail(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  return normalizedEmail;
}

function addMinutes(date: Date, minutes: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCMinutes(nextDate.getUTCMinutes() + minutes);
  return nextDate;
}

function normalizeBaseUrl(appBaseUrl: string): string {
  return appBaseUrl.replace(/\/$/, "");
}

function createDefaultId(): string {
  return `magic_link_${randomUUID()}`;
}

export function requestPasswordlessSignIn({
  email,
  appBaseUrl,
  now = () => new Date().toISOString(),
  createToken = createMagicLinkToken,
  createId = createDefaultId,
  expiresInMinutes = 15,
}: RequestPasswordlessSignInInput): PasswordlessSignInRequest {
  const normalizedEmail = normalizeEmail(email);
  const createdAt = new Date(now());
  const expiresAt = addMinutes(createdAt, expiresInMinutes);
  const token = createToken();
  const signInUrl = new URL(`${normalizeBaseUrl(appBaseUrl)}/auth/callback`);
  signInUrl.searchParams.set("token", token.rawToken);

  return {
    email: normalizedEmail,
    rawToken: token.rawToken,
    magicLinkRecord: {
      id: createId(),
      email: normalizedEmail,
      tokenHash: token.tokenHash,
      purpose: "sign-in",
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
    emailPayload: {
      to: normalizedEmail,
      subject: "Your OptiTech Academy sign-in link",
      signInUrl: signInUrl.toString(),
    },
  };
}
