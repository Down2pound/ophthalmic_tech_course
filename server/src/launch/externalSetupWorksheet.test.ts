import { describe, expect, it } from "vitest";
import {
  externalSetupSteps,
  renderExternalSetupWorksheet,
} from "./externalSetupWorksheet";

describe("externalSetupWorksheet", () => {
  it("covers the outside accounts needed for a paid online launch", () => {
    expect(externalSetupSteps.map(step => step.id)).toEqual([
      "github-source",
      "render-hosting",
      "stripe-cash-register",
      "passwordless-email",
      "admin-protection",
      "clinical-review",
      "live-purchase-proof",
    ]);
  });

  it("prints a safe owner worksheet with proof requirements", () => {
    const worksheet = renderExternalSetupWorksheet();

    expect(worksheet).toContain("GitHub");
    expect(worksheet).toContain("Render");
    expect(worksheet).toContain("Stripe");
    expect(worksheet).toContain("Resend");
    expect(worksheet).toContain("Proof to save");
    expect(worksheet).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(worksheet).toContain("pnpm launch:go-no-go");
    expect(worksheet).not.toContain("sk_test_");
    expect(worksheet).not.toContain("sk_live_");
    expect(worksheet).not.toContain("whsec_");
  });
});
