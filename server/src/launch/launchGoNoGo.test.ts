import { describe, expect, it } from "vitest";
import type { DeploymentSmokeTestReport } from "./deploymentSmokeTest";
import {
  getLaunchGoNoGoDecision,
  renderLaunchGoNoGoReport,
} from "./launchGoNoGo";

function makeReport(
  overrides: Partial<DeploymentSmokeTestReport> = {}
): DeploymentSmokeTestReport {
  return {
    baseUrl: "https://example.com",
    healthOk: true,
    publicPagesOk: true,
    checkoutAvailabilityOk: true,
    securityHeadersOk: true,
    securityHeaders: [],
    robotsTxtOk: true,
    robotsTxt: {
      ok: true,
      status: 200,
      requiredRules: [],
    },
    publicPages: [],
    practiceInquiry: {
      tested: false,
      ok: false,
      skippedReason:
        "Set LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true to submit a safe test inquiry.",
    },
    learnerInterest: {
      tested: false,
      ok: false,
      skippedReason:
        "Set LAUNCH_SMOKE_TEST_LEARNER_INTEREST=true to submit a safe test learner interest.",
    },
    readyForPaidLaunch: false,
    generatedAt: "2026-07-17T20:00:00.000Z",
    blockers: ["Stripe webhook is not configured."],
    warnings: [],
    launchActions: [],
    ...overrides,
  };
}

describe("getLaunchGoNoGoDecision", () => {
  it("allows public preview sharing but blocks paid checkout when launch readiness is incomplete", () => {
    const decision = getLaunchGoNoGoDecision(makeReport());

    expect(decision.publicPreviewSharing).toBe("go");
    expect(decision.practiceInquiryCollection).toBe("caution");
    expect(decision.paidCheckoutSharing).toBe("no-go");
  });

  it("blocks all sharing when the basic deployment is unhealthy", () => {
    const decision = getLaunchGoNoGoDecision(
      makeReport({ publicPagesOk: false })
    );

    expect(decision.publicPreviewSharing).toBe("no-go");
    expect(decision.paidCheckoutSharing).toBe("no-go");
  });

  it("allows paid checkout only when deployment and paid readiness are both green", () => {
    const decision = getLaunchGoNoGoDecision(
      makeReport({
        readyForPaidLaunch: true,
        blockers: [],
        practiceInquiry: {
          tested: true,
          ok: true,
          status: 201,
          inquiryId: "practice_inquiry_test",
          notificationSent: true,
        },
        learnerInterest: {
          tested: true,
          ok: true,
          status: 201,
          interestId: "learner_interest_test",
          notificationSent: true,
        },
      })
    );

    expect(decision.publicPreviewSharing).toBe("go");
    expect(decision.learnerInterestCollection).toBe("go");
    expect(decision.practiceInquiryCollection).toBe("go");
    expect(decision.paidCheckoutSharing).toBe("go");
  });
});

describe("renderLaunchGoNoGoReport", () => {
  it("prints buyer-safe decisions without exposing secret-looking values", () => {
    const report = renderLaunchGoNoGoReport(makeReport());

    expect(report).toContain("Public preview links: GO");
    expect(report).toContain("Learner interest collection: CAUTION");
    expect(report).toContain("Paid checkout links: NO-GO");
    expect(report).toContain("Shareable Link Buckets");
    expect(report).toContain(
      "First buyer page: shareable - https://example.com/first-sale"
    );
    expect(report).toContain(
      "Individual enrollment and interest list: review-only - https://example.com/checkout"
    );
    expect(report).toContain(
      "Preview: shareable - https://example.com/preview"
    );
    expect(report).toContain(
      "Practice packs: review-only - https://example.com/practice-packs"
    );
    expect(report).toContain(
      "Individual checkout: do not share - https://example.com/checkout"
    );
    expect(report).toContain(
      "Paid links are listed for convenience, but they should not be sent to buyers"
    );
    expect(report).toContain("Stripe webhook is not configured.");
    expect(report).toContain("free preview");
    expect(report).not.toContain("sk_test_");
    expect(report).not.toContain("whsec_");
  });
});
