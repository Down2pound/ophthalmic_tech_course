import { describe, expect, it } from "vitest";
import { getCheckoutStatus } from "./checkoutStatus";

describe("getCheckoutStatus", () => {
  it("recognizes successful Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=success")).toEqual({
      tone: "success",
      title: "Payment received",
      message:
        "Stripe confirmed your payment. You can begin Module 1 now while we finish connecting your durable learner access.",
      nextSteps: [
        "Check your email for the Stripe receipt.",
        "Start Module 1 and save your local progress on this device.",
        "Do not share patient information in course forms or support requests.",
      ],
    });
  });

  it("recognizes canceled Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=cancelled")).toEqual({
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: ["Return to checkout when you are ready to enroll."],
    });
  });

  it("returns null when there is no checkout result", () => {
    expect(getCheckoutStatus("")).toBeNull();
  });
});
