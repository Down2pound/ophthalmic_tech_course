import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createOpaqueToken, hashOpaqueToken, verifyStripeSignature } from "./security";

describe("security helpers", () => {
  it("creates unique opaque tokens and stable hashes", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();
    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThan(30);
    expect(hashOpaqueToken(first)).toBe(hashOpaqueToken(first));
    expect(hashOpaqueToken(first)).not.toBe(hashOpaqueToken(second));
  });

  it("accepts a current valid Stripe signature", () => {
    const body = Buffer.from(JSON.stringify({ id: "evt_test", type: "checkout.session.completed" }));
    const secret = "whsec_test_secret";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body.toString("utf8")}`)
      .digest("hex");

    expect(verifyStripeSignature(body, `t=${timestamp},v1=${signature}`, secret)).toBe(true);
  });

  it("rejects tampered and expired Stripe signatures", () => {
    const body = Buffer.from("original");
    const secret = "whsec_test_secret";
    const oldTimestamp = Math.floor(Date.now() / 1000) - 1_000;
    const oldSignature = createHmac("sha256", secret)
      .update(`${oldTimestamp}.${body.toString("utf8")}`)
      .digest("hex");

    expect(verifyStripeSignature(body, `t=${oldTimestamp},v1=${oldSignature}`, secret)).toBe(false);
    expect(verifyStripeSignature(Buffer.from("tampered"), `t=${Math.floor(Date.now() / 1000)},v1=${oldSignature}`, secret)).toBe(false);
  });
});
