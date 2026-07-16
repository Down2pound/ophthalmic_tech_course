import type { PaidCheckoutGateStatus } from "./paidCheckoutGate";

export type CheckoutAvailabilityPrimaryAction =
  | "continue-to-checkout"
  | "join-interest-list";

export interface CheckoutAvailabilityReport {
  ready: boolean;
  title: string;
  message: string;
  primaryAction: CheckoutAvailabilityPrimaryAction;
}

export function getCheckoutAvailabilityReport(
  checkoutGate: PaidCheckoutGateStatus
): CheckoutAvailabilityReport {
  if (checkoutGate.ready) {
    return {
      ready: true,
      title: "Enrollment is open",
      message:
        "Stripe checkout is available for individual learners and practice packs.",
      primaryAction: "continue-to-checkout",
    };
  }

  return {
    ready: false,
    title: "Enrollment is not open yet",
    message:
      "The course can collect interest, but payment is paused until the final launch checks are complete.",
    primaryAction: "join-interest-list",
  };
}
