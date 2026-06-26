import { describe, expect, it } from "vitest";
import { getCheckoutStatus } from "./checkoutStatus";

describe("getCheckoutStatus", () => {
  it("recognizes successful Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=success")).toEqual({
      tone: "success",
      title: "Payment received",
      message:
        "Your founding learner access is ready. You can start with Module 1 now.",
    });
  });

  it("recognizes canceled Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=cancelled")).toEqual({
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
    });
  });

  it("returns null when there is no checkout result", () => {
    expect(getCheckoutStatus("")).toBeNull();
  });
});
