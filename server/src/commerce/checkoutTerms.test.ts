import { describe, expect, it } from "vitest";
import { hasAcceptedCheckoutTerms } from "./checkoutTerms";

describe("hasAcceptedCheckoutTerms", () => {
  it("accepts only an explicit true value", () => {
    expect(hasAcceptedCheckoutTerms(true)).toBe(true);
    expect(hasAcceptedCheckoutTerms(false)).toBe(false);
    expect(hasAcceptedCheckoutTerms(undefined)).toBe(false);
    expect(hasAcceptedCheckoutTerms("true")).toBe(false);
  });
});
