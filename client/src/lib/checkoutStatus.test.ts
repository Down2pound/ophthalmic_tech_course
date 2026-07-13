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

  it("recognizes successful practice pack Stripe returns", () => {
    expect(
      getCheckoutStatus("?checkout=success&offer=practice-five-seat-pack")
    ).toEqual({
      tone: "success",
      title: "Practice pack payment received",
      message:
        "Stripe confirmed the practice pack payment. Your seat pack is being prepared for learner assignment and onboarding setup.",
      nextSteps: [
        "Check the billing email for the Stripe receipt.",
        "Gather the learner emails that should receive seats.",
        "Use the protected practice setup process to assign seats when ready.",
        "Do not send patient information, passwords, or private staff details in setup notes.",
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

  it("recognizes canceled practice pack Stripe returns", () => {
    expect(
      getCheckoutStatus("?checkout=cancelled&offer=practice-five-seat-pack")
    ).toEqual({
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: [
        "Return to the practice pack options when you are ready to buy seats.",
      ],
    });
  });

  it("returns null when there is no checkout result", () => {
    expect(getCheckoutStatus("")).toBeNull();
  });
});
