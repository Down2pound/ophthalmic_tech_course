import { describe, expect, it } from "vitest";
import {
  getCommerceEnvironmentStatus,
  getMissingEnvironmentVariables,
} from "./environment";

describe("getMissingEnvironmentVariables", () => {
  it("reports required variables that are missing or blank", () => {
    expect(
      getMissingEnvironmentVariables(
        {
          STRIPE_SECRET_KEY: " ",
          PUBLIC_APP_URL: "http://localhost:3000",
        },
        ["STRIPE_SECRET_KEY", "PUBLIC_APP_URL", "STRIPE_WEBHOOK_SECRET"]
      )
    ).toEqual(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"]);
  });
});

describe("getCommerceEnvironmentStatus", () => {
  it("marks checkout and webhooks as configured when required values exist", () => {
    expect(
      getCommerceEnvironmentStatus({
        STRIPE_SECRET_KEY: "sk_test_123",
        PUBLIC_APP_URL: "http://localhost:3000",
        STRIPE_WEBHOOK_SECRET: "whsec_123",
      })
    ).toEqual({
      checkoutConfigured: true,
      webhookConfigured: true,
      missingCheckoutVariables: [],
      missingWebhookVariables: [],
    });
  });

  it("shows which commerce setup values are still missing", () => {
    expect(getCommerceEnvironmentStatus({})).toEqual({
      checkoutConfigured: false,
      webhookConfigured: false,
      missingCheckoutVariables: ["STRIPE_SECRET_KEY", "PUBLIC_APP_URL"],
      missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
    });
  });
});
