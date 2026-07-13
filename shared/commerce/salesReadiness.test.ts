import { describe, expect, it } from "vitest";
import {
  getSalesPathItemCount,
  individualLearnerSalesPath,
  practiceBuyerSalesPath,
} from "./salesReadiness";

describe("sales readiness copy", () => {
  it("explains who each paid path is for", () => {
    expect(individualLearnerSalesPath.map(section => section.title)).toEqual([
      "Best fit",
      "What learners can expect",
      "After payment",
    ]);
    expect(practiceBuyerSalesPath.map(section => section.title)).toEqual([
      "Best fit",
      "What practices can expect",
      "After payment",
    ]);
  });

  it("keeps each paid path specific enough for buyer confidence", () => {
    expect(
      getSalesPathItemCount(individualLearnerSalesPath)
    ).toBeGreaterThanOrEqual(9);
    expect(getSalesPathItemCount(practiceBuyerSalesPath)).toBeGreaterThanOrEqual(
      9
    );
    expect(
      individualLearnerSalesPath.flatMap(section => section.items).join(" ")
    ).toContain("passwordless sign-in");
    expect(
      practiceBuyerSalesPath.flatMap(section => section.items).join(" ")
    ).toContain("practice-seat tool");
  });

  it("does not promise certification, employment, or independent competency", () => {
    const combined = [
      ...individualLearnerSalesPath.flatMap(section => section.items),
      ...practiceBuyerSalesPath.flatMap(section => section.items),
    ].join(" ");

    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified/i);
    expect(combined).not.toMatch(/independently verifies/i);
  });
});
