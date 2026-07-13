import { describe, expect, it } from "vitest";
import {
  getAuthEnvironmentStatus,
  getCommerceEnvironmentStatus,
  getDatabaseEnvironmentStatus,
  getMissingEnvironmentVariables,
  getPracticeSeatEnvironmentStatus,
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
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_123",
      })
    ).toEqual({
      checkoutConfigured: true,
      paidEnrollmentEnabled: true,
      webhookConfigured: true,
      missingCheckoutVariables: [],
      missingWebhookVariables: [],
    });
  });

  it("shows which commerce setup values are still missing", () => {
    expect(getCommerceEnvironmentStatus({})).toEqual({
      checkoutConfigured: false,
      paidEnrollmentEnabled: false,
      webhookConfigured: false,
      missingCheckoutVariables: [
        "STRIPE_SECRET_KEY",
        "PUBLIC_APP_URL",
        "ENABLE_PAID_ENROLLMENT",
      ],
      missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
    });
  });

  it("keeps checkout configured but paid enrollment disabled when the launch switch is false", () => {
    expect(
      getCommerceEnvironmentStatus({
        STRIPE_SECRET_KEY: "sk_test_123",
        PUBLIC_APP_URL: "http://localhost:3000",
        ENABLE_PAID_ENROLLMENT: "false",
        STRIPE_WEBHOOK_SECRET: "whsec_123",
      })
    ).toEqual({
      checkoutConfigured: true,
      paidEnrollmentEnabled: false,
      webhookConfigured: true,
      missingCheckoutVariables: [],
      missingWebhookVariables: [],
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

describe("getPracticeSeatEnvironmentStatus", () => {
  it("marks practice seat assignment as configured when the admin token exists", () => {
    expect(
      getPracticeSeatEnvironmentStatus({
        PRACTICE_SEAT_ADMIN_TOKEN: "practice-seat-secret",
      })
    ).toEqual({
      practiceSeatAdminConfigured: true,
      missingPracticeSeatAdminVariables: [],
    });
  });

  it("shows when the practice seat admin token is missing", () => {
    expect(getPracticeSeatEnvironmentStatus({})).toEqual({
      practiceSeatAdminConfigured: false,
      missingPracticeSeatAdminVariables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
    });
  });
});

describe("getDatabaseEnvironmentStatus", () => {
  it("marks database storage as configured when DATABASE_URL exists", () => {
    expect(
      getDatabaseEnvironmentStatus({
        DATABASE_URL: "postgres://example",
      })
    ).toEqual({
      databaseConfigured: true,
      missingDatabaseVariables: [],
    });
  });

  it("shows when durable database storage is missing", () => {
    expect(getDatabaseEnvironmentStatus({})).toEqual({
      databaseConfigured: false,
      missingDatabaseVariables: ["DATABASE_URL"],
    });
  });
});
