import { describe, expect, it } from "vitest";
import {
  foundingLearnerOffer,
  practicePackOffers,
} from "../../../shared/commerce/offers";
import {
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "./stripeCheckout";

describe("buildStripeCheckoutParams", () => {
  it("uses the canonical founding learner offer", () => {
    const params = buildStripeCheckoutParams({
      successUrl: "https://example.com/checkout/success",
      cancelUrl: "https://example.com/checkout",
    });

    expect(params.get("mode")).toBe("payment");
    expect(params.get("client_reference_id")).toBe(foundingLearnerOffer.id);
    expect(params.get("metadata[offer_id]")).toBe(foundingLearnerOffer.id);
    expect(params.get("metadata[access_months]")).toBe("12");
    expect(params.get("line_items[0][quantity]")).toBe("1");
    expect(params.get("line_items[0][price_data][currency]")).toBe("usd");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("19900");
    expect(params.get("line_items[0][price_data][product_data][name]")).toBe(
      foundingLearnerOffer.name
    );
  });

  it("adds customer email only when supplied", () => {
    const withoutEmail = buildStripeCheckoutParams({
      successUrl: "https://example.com/checkout/success",
      cancelUrl: "https://example.com/checkout",
    });
    const withEmail = buildStripeCheckoutParams(
      {
        successUrl: "https://example.com/checkout/success",
        cancelUrl: "https://example.com/checkout",
      },
      "learner@example.com"
    );

    expect(withoutEmail.has("customer_email")).toBe(false);
    expect(withEmail.get("customer_email")).toBe("learner@example.com");
  });

  it("can build checkout params for a practice pack offer", () => {
    const practiceOffer = practicePackOffers[0];
    const params = buildStripeCheckoutParams(
      {
        successUrl: "https://example.com/checkout/success",
        cancelUrl: "https://example.com/practice-packs",
      },
      undefined,
      practiceOffer.id
    );

    expect(params.get("client_reference_id")).toBe(practiceOffer.id);
    expect(params.get("metadata[offer_id]")).toBe(practiceOffer.id);
    expect(params.get("metadata[access_months]")).toBe("12");
    expect(params.get("metadata[seat_count]")).toBe("5");
    expect(params.get("line_items[0][quantity]")).toBe("1");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("79900");
    expect(params.get("line_items[0][price_data][product_data][name]")).toBe(
      practiceOffer.name
    );
  });

  it("rejects unknown checkout offers", () => {
    expect(() =>
      buildStripeCheckoutParams(
        {
          successUrl: "https://example.com/checkout/success",
          cancelUrl: "https://example.com/checkout",
        },
        undefined,
        "not-a-real-offer"
      )
    ).toThrow("Unknown checkout offer.");
  });
});

describe("getCheckoutBaseUrl", () => {
  it("removes a trailing slash from the configured origin", () => {
    expect(getCheckoutBaseUrl("https://example.com/")).toBe(
      "https://example.com"
    );
  });
});
