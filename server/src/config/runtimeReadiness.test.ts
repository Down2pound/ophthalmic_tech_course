import { describe, expect, it } from "vitest";
import { getRuntimeLaunchReadinessReport } from "./runtimeReadiness";

describe("getRuntimeLaunchReadinessReport", () => {
  it("combines launch blockers with runtime commerce setup", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        STRIPE_WEBHOOK_SECRET: "",
      },
      now: () => "2026-06-26T12:00:00.000Z",
    });

    expect(report).toMatchObject({
      generatedAt: "2026-06-26T12:00:00.000Z",
      readyForPaidLaunch: false,
      commerce: {
        checkoutConfigured: true,
        webhookConfigured: false,
        missingCheckoutVariables: [],
        missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
      },
    });
    expect(report.staticSummary.blockedCount).toBeGreaterThan(0);
    expect(report.warnings).toContain(
      "Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."
    );
  });

  it("never includes actual secret values in warnings or missing variable lists", () => {
    const report = getRuntimeLaunchReadinessReport({
      env: {
        STRIPE_SECRET_KEY: "sk_test_secret_value",
        PUBLIC_APP_URL: "http://localhost:3000",
        STRIPE_WEBHOOK_SECRET: "whsec_secret_value",
      },
    });

    const serializedReport = JSON.stringify(report);

    expect(serializedReport).not.toContain("sk_test_secret_value");
    expect(serializedReport).not.toContain("whsec_secret_value");
  });
});
