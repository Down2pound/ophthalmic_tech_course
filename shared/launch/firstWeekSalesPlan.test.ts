import { describe, expect, it } from "vitest";
import {
  firstWeekSalesPlan,
  renderFirstWeekSalesPlan,
} from "./firstWeekSalesPlan";

describe("firstWeekSalesPlan", () => {
  it("covers exactly one practical first-sales week", () => {
    expect(firstWeekSalesPlan.map(day => day.day)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(firstWeekSalesPlan.every(day => day.actions.length > 0)).toBe(true);
    expect(firstWeekSalesPlan.every(day => day.proofToSave.length > 0)).toBe(
      true
    );
  });

  it("keeps paid checkout links gated until launch proof exists", () => {
    const plan = renderFirstWeekSalesPlan();

    expect(plan).toContain("/api/launch/readiness");
    expect(plan).toContain("One internal live purchase");
    expect(plan).toContain(
      "send the course overview, free preview, buyer guide, or practice inquiry path instead"
    );
    expect(plan).toContain("Do not promise");
    expect(plan).toContain("certification");
    expect(plan).toContain("replacement of hands-on supervision");
    expect(plan).not.toContain("sk_test_");
    expect(plan).not.toContain("whsec_");
  });
});
