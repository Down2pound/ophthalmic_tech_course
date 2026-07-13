import { describe, expect, it } from "vitest";
import {
  buyerConfidenceAnswers,
  getSalesPathItemCount,
  individualLearnerSalesPath,
  individualLearnerStartSteps,
  practiceBuyerSalesPath,
  purchaseAssurances,
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

  it("gives individual learners a clear first-session path after purchase", () => {
    expect(individualLearnerStartSteps.map(step => step.title)).toEqual([
      "Use the same email at checkout",
      "Request your sign-in link",
      "Start Module 1",
      "Keep hands-on skills supervised",
    ]);

    const combined = individualLearnerStartSteps
      .map(step => `${step.title} ${step.description}`)
      .join(" ");

    expect(combined).toMatch(/Stripe confirms payment/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/supervisor/i);
    expect(combined).not.toMatch(/guarantee/i);
  });

  it("answers common buyer objections without overpromising", () => {
    expect(buyerConfidenceAnswers).toHaveLength(5);

    const combined = buyerConfidenceAnswers
      .map(answer => `${answer.question} ${answer.answer}`)
      .join(" ");

    expect(combined).toMatch(/certification course/i);
    expect(combined).toMatch(/career changers/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/practice-seat tool/i);
    expect(combined).toMatch(/future modules/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified technician/i);
    expect(combined).not.toMatch(/proves competency/i);
  });

  it("gives buyers purchase assurances without risky claims", () => {
    expect(purchaseAssurances.map(item => item.title)).toEqual([
      "Stripe handles payment",
      "Access follows the buyer email",
      "Support path is visible",
      "Expectations stay honest",
    ]);

    const combined = purchaseAssurances
      .map(item => `${item.title} ${item.description}`)
      .join(" ");

    expect(combined).toMatch(/does not store card details/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/refund review/i);
    expect(combined).toMatch(/does not promise certification/i);
    expect(combined).not.toMatch(/guarantee/i);
  });
});
