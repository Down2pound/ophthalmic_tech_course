import { describe, expect, it } from "vitest";
import { scanTextForLaunchSecrets } from "./secretPatternScan";

describe("scanTextForLaunchSecrets", () => {
  it("reports likely launch secrets without echoing their values", () => {
    const stripeSecret = ["sk", "live", "1234567890abcdef1234567890"].join("_");
    const stripeWebhookSecret = ["whsec", "1234567890abcdef123456"].join("_");
    const resendApiKey = ["re", "1234567890abcdef123456"].join("_");
    const findings = scanTextForLaunchSecrets({
      filePath: "docs/example.md",
      text: [
        `STRIPE_SECRET_KEY=${stripeSecret}`,
        `STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}`,
        `RESEND_API_KEY=${resendApiKey}`,
      ].join("\n"),
    });

    expect(findings).toEqual([
      {
        filePath: "docs/example.md",
        lineNumber: 1,
        patternName: "Stripe secret key",
      },
      {
        filePath: "docs/example.md",
        lineNumber: 2,
        patternName: "Stripe webhook secret",
      },
      {
        filePath: "docs/example.md",
        lineNumber: 3,
        patternName: "Resend API key",
      },
    ]);
    expect(JSON.stringify(findings)).not.toContain(stripeSecret);
    expect(JSON.stringify(findings)).not.toContain(stripeWebhookSecret);
    expect(JSON.stringify(findings)).not.toContain(resendApiKey);
  });

  it("ignores placeholder examples that cannot unlock live services", () => {
    expect(
      scanTextForLaunchSecrets({
        filePath: ".env.example",
        text: [
          "STRIPE_SECRET_KEY=sk_live_replace_with_real_value",
          "STRIPE_WEBHOOK_SECRET=whsec_replace_with_real_value",
          "TRANSACTIONAL_EMAIL_API_KEY=re_replace_with_real_value",
        ].join("\n"),
      })
    ).toEqual([]);
  });
});
