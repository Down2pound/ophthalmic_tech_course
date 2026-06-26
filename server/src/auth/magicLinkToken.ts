import {
  createHash,
  randomBytes as nodeRandomBytes,
  timingSafeEqual,
} from "node:crypto";

export interface MagicLinkToken {
  rawToken: string;
  tokenHash: string;
}

export interface MagicLinkTokenOptions {
  randomBytes?: (size: number) => Buffer;
}

function toBase64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function hashMagicLinkToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function createMagicLinkToken({
  randomBytes = nodeRandomBytes,
}: MagicLinkTokenOptions = {}): MagicLinkToken {
  const rawToken = toBase64Url(randomBytes(32));

  return {
    rawToken,
    tokenHash: hashMagicLinkToken(rawToken),
  };
}

export function verifyMagicLinkToken(
  rawToken: string,
  storedTokenHash: string
): boolean {
  const candidateHash = hashMagicLinkToken(rawToken);

  if (
    candidateHash.length !== storedTokenHash.length ||
    !/^[a-f0-9]+$/i.test(storedTokenHash)
  ) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(candidateHash, "hex"),
    Buffer.from(storedTokenHash, "hex")
  );
}
