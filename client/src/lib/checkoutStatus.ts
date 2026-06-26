export interface CheckoutStatus {
  tone: "success" | "notice";
  title: string;
  message: string;
  nextSteps: string[];
}

export function getCheckoutStatus(search: string): CheckoutStatus | null {
  const params = new URLSearchParams(search);
  const status = params.get("checkout");

  if (status === "success") {
    return {
      tone: "success",
      title: "Payment received",
      message:
        "Stripe confirmed your payment. You can begin Module 1 now while we finish connecting your durable learner access.",
      nextSteps: [
        "Check your email for the Stripe receipt.",
        "Start Module 1 and save your local progress on this device.",
        "Do not share patient information in course forms or support requests.",
      ],
    };
  }

  if (status === "cancelled") {
    return {
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: ["Return to checkout when you are ready to enroll."],
    };
  }

  return null;
}
