import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession } from "./checkoutClient";

describe("createCheckoutSession", () => {
  it("returns the hosted checkout url on success", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        url: "https://checkout.stripe.com/c/pay/cs_test_123",
      }),
    });

    await expect(
      createCheckoutSession({ email: "learner@example.com", fetcher })
    ).resolves.toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });

    expect(fetcher).toHaveBeenCalledWith("/api/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "learner@example.com" }),
    });
  });

  it("sends an offer id when buying a practice pack", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        url: "https://checkout.stripe.com/c/pay/cs_test_practice",
      }),
    });

    await createCheckoutSession({
      email: "manager@example.com",
      offerId: "practice-five-seat-pack",
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith("/api/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "manager@example.com",
        offerId: "practice-five-seat-pack",
      }),
    });
  });

  it("surfaces server errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Checkout unavailable" }),
    });

    await expect(createCheckoutSession({ fetcher })).rejects.toThrow(
      "Checkout unavailable"
    );
  });
});
