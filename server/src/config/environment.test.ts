import { describe, expect, it } from "vitest";
import {
  getAuthEnvironmentStatus,
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

describe("getAuthEnvironmentStatus", () => {
  it("marks passwordless sign-in as configured when required values exist", () => {
    expect(
      getAuthEnvironmentStatus({
        AUTH_SESSION_SECRET: "session-secret",
        TRANSACTIONAL_EMAIL_API_URL: "https://email-provider.example.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-api-key",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        PUBLIC_APP_URL: "http://localhost:3000",
      })
    ).toEqual({
      passwordlessConfigured: true,
      missingPasswordlessVariables: [],
    });
  });

  it("shows which passwordless sign-in values are still missing", () => {
    expect(
      getAuthEnvironmentStatus({
        AUTH_SESSION_SECRET: "",
        PUBLIC_APP_URL: "http://localhost:3000",
      })
    ).toEqual({
      passwordlessConfigured: false,
      missingPasswordlessVariables: [
        "AUTH_SESSION_SECRET",
        "TRANSACTIONAL_EMAIL_API_URL",
        "TRANSACTIONAL_EMAIL_API_KEY",
        "SIGN_IN_FROM_EMAIL",
      ],
    });
  });
});
