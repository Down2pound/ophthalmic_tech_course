import { describe, expect, it } from "vitest";
import { getCheckoutAvailabilityReport } from "./checkoutAvailability";
import type { PaidCheckoutGateStatus } from "./paidCheckoutGate";

const readyGate: PaidCheckoutGateStatus = {
  ready: true,
  warnings: [],
  missingVariables: [],
};

describe("getCheckoutAvailabilityReport", () => {
  it("tells buyers checkout is open when paid launch gates are ready", () => {
    expect(getCheckoutAvailabilityReport(readyGate)).toEqual({
      ready: true,
      title: "Enrollment is open",
      message:
        "Stripe checkout is available for individual learners and practice packs.",
      primaryAction: "continue-to-checkout",
    });
  });

  it("gives buyers a safe interest-list path when checkout is not ready", () => {
    expect(
      getCheckoutAvailabilityReport({
        ready: false,
        warnings: [
          "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
          "Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET.",
        ],
        missingVariables: ["STRIPE_WEBHOOK_SECRET"],
      })
    ).toEqual({
      ready: false,
      title: "Enrollment is not open yet",
      message:
        "The course can collect interest, but payment is paused until the final launch checks are complete.",
      primaryAction: "join-interest-list",
    });
  });
});
