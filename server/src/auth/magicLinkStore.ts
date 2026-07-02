import type { MagicLinkRecord } from "./passwordlessSignIn";

export interface MagicLinkStore {
  storeMagicLink(
    magicLink: MagicLinkRecord
  ): { created: boolean; magicLink: MagicLinkRecord };
  listMagicLinks(): MagicLinkRecord[];
  findMagicLinksByEmail(email: string): MagicLinkRecord[];
  findMagicLinkByTokenHash(tokenHash: string): MagicLinkRecord | undefined;
  markMagicLinkConsumed(
    id: string,
    consumedAt: string
  ): MagicLinkRecord | undefined;
}

export function createStoredMagicLinkRecord(
  magicLink: MagicLinkRecord
): MagicLinkRecord {
  return {
    ...magicLink,
    email: magicLink.email.trim().toLowerCase(),
  };
}

export function createInMemoryMagicLinkStore(): MagicLinkStore {
  const magicLinksById = new Map<string, MagicLinkRecord>();

  return {
    storeMagicLink(magicLink) {
      const existing = magicLinksById.get(magicLink.id);

      if (existing) {
        return { created: false, magicLink: existing };
      }

      const storedMagicLink = createStoredMagicLinkRecord(magicLink);
      magicLinksById.set(storedMagicLink.id, storedMagicLink);

      return { created: true, magicLink: storedMagicLink };
    },
    listMagicLinks() {
      return Array.from(magicLinksById.values());
    },
    findMagicLinksByEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return Array.from(magicLinksById.values()).filter(
        (magicLink) => magicLink.email === normalizedEmail
      );
    },
    findMagicLinkByTokenHash(tokenHash) {
      return Array.from(magicLinksById.values()).find(
        (magicLink) => magicLink.tokenHash === tokenHash
      );
    },
    markMagicLinkConsumed(id, consumedAt) {
      const magicLink = magicLinksById.get(id);

      if (!magicLink) {
        return undefined;
      }

      const consumedMagicLink = {
        ...magicLink,
        consumedAt,
      };
      magicLinksById.set(id, consumedMagicLink);

      return consumedMagicLink;
    },
  };
}
