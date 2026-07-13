import { describe, expect, it } from "vitest";
import {
  createInMemoryMagicLinkStore,
  createStoredMagicLinkRecord,
} from "./magicLinkStore";
import type { MagicLinkRecord } from "./passwordlessSignIn";

const magicLinkRecord: MagicLinkRecord = {
  id: "magic_link_123",
  email: " Learner@Example.com ",
  tokenHash: "stored-token-hash",
  purpose: "sign-in",
  createdAt: "2026-06-26T12:00:00.000Z",
  expiresAt: "2026-06-26T12:15:00.000Z",
};

describe("createStoredMagicLinkRecord", () => {
  it("normalizes email before storage", () => {
    expect(createStoredMagicLinkRecord(magicLinkRecord)).toEqual({
      ...magicLinkRecord,
      email: "learner@example.com",
    });
  });
});

describe("createInMemoryMagicLinkStore", () => {
  it("stores one magic link per id", async () => {
    const store = createInMemoryMagicLinkStore();

    expect((await store.storeMagicLink(magicLinkRecord)).created).toBe(true);
    expect(await store.storeMagicLink(magicLinkRecord)).toEqual({
      created: false,
      magicLink: {
        ...magicLinkRecord,
        email: "learner@example.com",
      },
    });
    expect(await store.listMagicLinks()).toHaveLength(1);
  });

  it("finds magic links by normalized email and token hash", async () => {
    const store = createInMemoryMagicLinkStore();

    await store.storeMagicLink(magicLinkRecord);

    expect(
      await store.findMagicLinksByEmail(" learner@example.com ")
    ).toHaveLength(1);
    expect(
      await store.findMagicLinkByTokenHash("stored-token-hash")
    ).toMatchObject({
      id: "magic_link_123",
      email: "learner@example.com",
    });
    expect(
      await store.findMagicLinkByTokenHash("missing-token-hash")
    ).toBeUndefined();
  });
});
