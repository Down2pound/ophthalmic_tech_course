export interface CheckoutStatus {
  tone: "success" | "notice";
  title: string;
  message: string;
}

export function getCheckoutStatus(search: string): CheckoutStatus | null {
  const params = new URLSearchParams(search);
  const status = params.get("checkout");

  if (status === "success") {
    return {
      tone: "success",
      title: "Payment received",
      message:
        "Your founding learner access is ready. You can start with Module 1 now.",
    };
  }

  if (status === "cancelled") {
    return {
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
    };
  }

  return null;
}
