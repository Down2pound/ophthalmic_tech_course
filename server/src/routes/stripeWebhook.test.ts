import { describe, expect, it } from "vitest";
import type {
  PurchaseEvent,
  StripeCheckoutCompletedEvent,
} from "../commerce/stripeWebhook";
import { isUnfulfillableCheckoutCompletedEvent } from "./stripeWebhook";

const purchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 19900,
  currency: "usd",
  accessMonths: 12,
};

describe("isUnfulfillableCheckoutCompletedEvent", () => {
  it("flags completed checkout events that cannot provision access", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_missing_email",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_missing_email",
          customer_email: null,
          metadata: {
            offer_id: "founding-learner",
            access_months: "12",
          },
          amount_total: 19900,
          currency: "usd",
        },
      },
    };

    expect(isUnfulfillableCheckoutCompletedEvent(stripeEvent, null)).toBe(true);
  });

  it("does not flag valid completed checkout events", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_valid",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_valid",
          customer_email: "learner@example.com",
          metadata: {
            offer_id: "founding-learner",
            access_months: "12",
          },
          amount_total: 19900,
          currency: "usd",
        },
      },
    };

    expect(
      isUnfulfillableCheckoutCompletedEvent(stripeEvent, purchaseEvent)
    ).toBe(false);
  });

  it("does not flag unrelated Stripe events", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_payment_intent",
      type: "payment_intent.succeeded",
      data: { object: {} },
    };

    expect(isUnfulfillableCheckoutCompletedEvent(stripeEvent, null)).toBe(
      false
    );
  });
});
