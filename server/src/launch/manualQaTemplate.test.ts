import { describe, expect, it } from "vitest";
import { renderManualQaTemplate } from "./manualQaTemplate";

describe("renderManualQaTemplate", () => {
  it("renders a safe manual launch QA evidence template", () => {
    const template = renderManualQaTemplate({
      generatedAt: "2026-07-13T12:00:00.000Z",
    });

    expect(template).toContain("OptiTech Academy Manual Launch QA Evidence");
    expect(template).toContain("Test Stripe checkout and webhook fulfillment");
    expect(template).toContain("Test the paid learner flow end to end");
    expect(template).toContain("Run browser and accessibility QA");
    expect(template).toContain("Paid Launch Evidence Details");
    expect(template).toContain("Stripe checkout session ID:");
    expect(template).toContain("Webhook delivery status:");
    expect(template).toContain("Sitemap URL or generated sitemap path:");
    expect(template).toContain("ENABLE_PAID_ENROLLMENT stayed false");
    expect(template).toContain("Do not paste card numbers");
    expect(template).toContain("Deployment URL:");
    expect(template).toContain("Commit SHA:");
    expect(template).not.toContain("sk_test_");
    expect(template).not.toContain("whsec_");
  });
});
