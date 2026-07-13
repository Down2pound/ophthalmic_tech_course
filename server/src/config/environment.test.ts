import { describe, expect, it } from "vitest";
import {
  getAuthEnvironmentStatus,
  getClinicalReviewEnvironmentStatus,
  getCommerceEnvironmentStatus,
  getDatabaseEnvironmentStatus,
  getMissingEnvironmentVariables,
  getPracticeSeatEnvironmentStatus,
  getStripeSecretKeyMode,
  isResendEmailConfiguration,
  isPlaceholderEnvironmentValue,
  isTransactionalEmailApiKeyUnsafe,
  isUnsafeLaunchEnvironmentValue,
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
    ).toEqual(["STRIPE_SECRET_KEY", "PUBLIC_APP_URL", "STRIPE_WEBHOOK_SECRET"]);
  });

  it("reports placeholder values as missing", () => {
    expect(
      getMissingEnvironmentVariables(
        {
          STRIPE_SECRET_KEY: "sk_test_replace_with_your_secret_key",
          PUBLIC_APP_URL: "http://localhost:3000",
          TRANSACTIONAL_EMAIL_API_URL:
            "https://email-provider.example.com/send",
          AUTH_SESSION_SECRET: "replace_with_a_long_random_session_secret",
          SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@example.com>",
        },
        [
          "STRIPE_SECRET_KEY",
          "PUBLIC_APP_URL",
          "TRANSACTIONAL_EMAIL_API_URL",
          "AUTH_SESSION_SECRET",
          "SIGN_IN_FROM_EMAIL",
        ]
      )
    ).toEqual([
      "STRIPE_SECRET_KEY",
      "PUBLIC_APP_URL",
      "TRANSACTIONAL_EMAIL_API_URL",
      "AUTH_SESSION_SECRET",
      "SIGN_IN_FROM_EMAIL",
    ]);
  });
});

describe("isPlaceholderEnvironmentValue", () => {
  it("detects common copied example values", () => {
    expect(
      isPlaceholderEnvironmentValue(
        "DATABASE_URL",
        "replace_with_managed_postgres_connection_string"
      )
    ).toBe(true);
    expect(
      isPlaceholderEnvironmentValue(
        "TRANSACTIONAL_EMAIL_API_URL",
        "https://email-provider.example.com/send"
      )
    ).toBe(true);
    expect(
      isPlaceholderEnvironmentValue("PUBLIC_APP_URL", "http://localhost:3000")
    ).toBe(true);
  });

  it("allows realistic production-looking values", () => {
    expect(
      isPlaceholderEnvironmentValue(
        "PUBLIC_APP_URL",
        "https://academy.spindeleye.com"
      )
    ).toBe(false);
    expect(
      isPlaceholderEnvironmentValue(
        "DATABASE_URL",
        "postgres://optitech_user:secret@db.internal:5432/optitech"
      )
    ).toBe(false);
  });
});

describe("isUnsafeLaunchEnvironmentValue", () => {
  it("rejects weak or malformed launch-critical values", () => {
    expect(isUnsafeLaunchEnvironmentValue("STRIPE_SECRET_KEY", "sk_tiny")).toBe(
      true
    );
    expect(
      isUnsafeLaunchEnvironmentValue("STRIPE_WEBHOOK_SECRET", "sk_123")
    ).toBe(true);
    expect(
      isUnsafeLaunchEnvironmentValue("PUBLIC_APP_URL", "http://academy.test")
    ).toBe(true);
    expect(isUnsafeLaunchEnvironmentValue("AUTH_SESSION_SECRET", "short")).toBe(
      true
    );
    expect(
      isUnsafeLaunchEnvironmentValue(
        "DATABASE_URL",
        "mysql://optitech:credential@db.internal/optitech"
      )
    ).toBe(true);
    expect(
      isUnsafeLaunchEnvironmentValue(
        "TRANSACTIONAL_EMAIL_API_KEY",
        "generic-email-key-123456",
        {
          TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
        }
      )
    ).toBe(true);
  });

  it("allows realistic launch-critical values", () => {
    expect(
      isUnsafeLaunchEnvironmentValue(
        "STRIPE_SECRET_KEY",
        "sk_test_1234567890abcdef"
      )
    ).toBe(false);
    expect(
      isUnsafeLaunchEnvironmentValue(
        "STRIPE_SECRET_KEY",
        "sk_live_1234567890abcdef"
      )
    ).toBe(false);
    expect(
      isUnsafeLaunchEnvironmentValue(
        "STRIPE_WEBHOOK_SECRET",
        "whsec_1234567890abcdef"
      )
    ).toBe(false);
    expect(
      isUnsafeLaunchEnvironmentValue(
        "AUTH_SESSION_SECRET",
        "session-secret-value-with-at-least-32-chars"
      )
    ).toBe(false);
    expect(
      isUnsafeLaunchEnvironmentValue(
        "TRANSACTIONAL_EMAIL_API_KEY",
        "re_test_key_123456",
        {
          TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
        }
      )
    ).toBe(false);
  });
});

describe("isResendEmailConfiguration", () => {
  it("detects the direct Resend email endpoint", () => {
    expect(
      isResendEmailConfiguration({
        TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
      })
    ).toBe(true);
    expect(
      isResendEmailConfiguration({
        TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails/",
      })
    ).toBe(true);
    expect(
      isResendEmailConfiguration({
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
      })
    ).toBe(false);
  });
});

describe("isTransactionalEmailApiKeyUnsafe", () => {
  it("requires Resend keys when the Resend endpoint is configured", () => {
    const resendEnv = {
      TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
    };

    expect(
      isTransactionalEmailApiKeyUnsafe("generic-email-key-123456", resendEnv)
    ).toBe(true);
    expect(
      isTransactionalEmailApiKeyUnsafe("re_test_key_123456", resendEnv)
    ).toBe(false);
  });

  it("allows generic provider keys for non-Resend endpoints", () => {
    expect(
      isTransactionalEmailApiKeyUnsafe("generic-email-key-123456", {
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
      })
    ).toBe(false);
  });
});

describe("getStripeSecretKeyMode", () => {
  it("identifies missing, test, live, and unknown Stripe secret keys", () => {
    expect(getStripeSecretKeyMode({})).toBe("missing");
    expect(
      getStripeSecretKeyMode({
        STRIPE_SECRET_KEY: "sk_test_1234567890abcdef",
      })
    ).toBe("test");
    expect(
      getStripeSecretKeyMode({
        STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
      })
    ).toBe("live");
    expect(
      getStripeSecretKeyMode({
        STRIPE_SECRET_KEY: "sk_something_else_1234567890abcdef",
      })
    ).toBe("unknown");
  });
});

describe("getCommerceEnvironmentStatus", () => {
  it("marks checkout and webhooks as configured when required values exist", () => {
    expect(
      getCommerceEnvironmentStatus({
        STRIPE_SECRET_KEY: "sk_live_1234567890abcdef",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
        ENABLE_PAID_ENROLLMENT: "true",
        STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdef",
      })
    ).toEqual({
      checkoutConfigured: true,
      paidEnrollmentEnabled: true,
      webhookConfigured: true,
      stripeSecretKeyMode: "live",
      missingCheckoutVariables: [],
      missingWebhookVariables: [],
    });
  });

  it("shows which commerce setup values are still missing", () => {
    expect(getCommerceEnvironmentStatus({})).toEqual({
      checkoutConfigured: false,
      paidEnrollmentEnabled: false,
      webhookConfigured: false,
      stripeSecretKeyMode: "missing",
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
        STRIPE_SECRET_KEY: "sk_test_1234567890abcdef",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
        ENABLE_PAID_ENROLLMENT: "false",
        STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdef",
      })
    ).toEqual({
      checkoutConfigured: true,
      paidEnrollmentEnabled: false,
      webhookConfigured: true,
      stripeSecretKeyMode: "test",
      missingCheckoutVariables: [],
      missingWebhookVariables: [],
    });
  });
});

describe("getAuthEnvironmentStatus", () => {
  it("marks passwordless sign-in as configured when required values exist", () => {
    expect(
      getAuthEnvironmentStatus({
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://email.spindeleye.com/send",
        TRANSACTIONAL_EMAIL_API_KEY: "email-api-key-123456",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
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
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
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

  it("reports the email API key as missing when Resend is configured with a non-Resend key", () => {
    expect(
      getAuthEnvironmentStatus({
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
        TRANSACTIONAL_EMAIL_API_KEY: "generic-email-key-123456",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
      })
    ).toEqual({
      passwordlessConfigured: false,
      missingPasswordlessVariables: ["TRANSACTIONAL_EMAIL_API_KEY"],
    });
  });

  it("accepts a Resend API key shape for the Resend email endpoint", () => {
    expect(
      getAuthEnvironmentStatus({
        AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
        TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
        TRANSACTIONAL_EMAIL_API_KEY: "re_test_key_123456",
        SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
        PUBLIC_APP_URL: "https://academy.spindeleye.com",
      })
    ).toEqual({
      passwordlessConfigured: true,
      missingPasswordlessVariables: [],
    });
  });
});

describe("getPracticeSeatEnvironmentStatus", () => {
  it("marks practice seat assignment as configured when the admin token exists", () => {
    expect(
      getPracticeSeatEnvironmentStatus({
        PRACTICE_SEAT_ADMIN_TOKEN:
          "practice-seat-secret-with-at-least-32-chars",
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
        DATABASE_URL:
          "postgres://optitech_user:secret@db.internal:5432/optitech",
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

describe("getClinicalReviewEnvironmentStatus", () => {
  it("marks Module 1 clinical review approved when required signoff values exist", () => {
    expect(
      getClinicalReviewEnvironmentStatus({
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "true",
      })
    ).toEqual({
      moduleOneReviewConfigured: true,
      moduleOneReviewApproved: true,
      missingModuleOneReviewVariables: [],
      reviewerName: "Dr. Reviewer",
      reviewerRole: "Ophthalmologist",
      reviewDate: "2026-07-13",
      approvedVersion: "module-one-v1",
    });
  });

  it("keeps Module 1 clinical review blocked when the approval switch is false", () => {
    expect(
      getClinicalReviewEnvironmentStatus({
        MODULE_ONE_CLINICAL_REVIEWER_NAME: "Dr. Reviewer",
        MODULE_ONE_CLINICAL_REVIEWER_ROLE: "Ophthalmologist",
        MODULE_ONE_CLINICAL_REVIEW_DATE: "2026-07-13",
        MODULE_ONE_CLINICAL_APPROVED_VERSION: "module-one-v1",
        MODULE_ONE_CLINICAL_REVIEW_APPROVED: "false",
      })
    ).toMatchObject({
      moduleOneReviewConfigured: true,
      moduleOneReviewApproved: false,
      missingModuleOneReviewVariables: [],
    });
  });

  it("shows which Module 1 clinical review signoff values are missing", () => {
    expect(getClinicalReviewEnvironmentStatus({})).toMatchObject({
      moduleOneReviewConfigured: false,
      moduleOneReviewApproved: false,
      missingModuleOneReviewVariables: [
        "MODULE_ONE_CLINICAL_REVIEWER_NAME",
        "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
        "MODULE_ONE_CLINICAL_REVIEW_DATE",
        "MODULE_ONE_CLINICAL_APPROVED_VERSION",
        "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
      ],
    });
  });
});
