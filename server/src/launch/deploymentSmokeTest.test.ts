import { describe, expect, it } from "vitest";
import {
  renderDeploymentSmokeReport,
  runDeploymentSmokeTest,
} from "./deploymentSmokeTest";

function createResponse(
  payload: unknown,
  options: { ok?: boolean; status?: number } = {}
) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    async json() {
      return payload;
    },
  } as Response;
}

describe("runDeploymentSmokeTest", () => {
  it("checks deployed health and paid launch readiness", async () => {
    const requestedUrls: string[] = [];
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);
      requestedUrls.push(requestedUrl);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      return createResponse({
        readyForPaidLaunch: false,
        staticSummary: {
          blockers: ["Clinical content review"],
        },
        warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
        launchActions: [
          {
            id: "production-database",
            title: "Create and initialize hosted PostgreSQL",
            status: "app-command",
            whyItMatters: "Durable records are required.",
            action: "Run pnpm db:setup.",
            evidenceNeeded: "Database setup succeeds.",
          },
        ],
      });
    };

    await expect(
      runDeploymentSmokeTest({
        baseUrl: " https://example.com/ ",
        fetcher: fetcher as typeof fetch,
        now: () => "2026-07-13T12:00:00.000Z",
      })
    ).resolves.toEqual({
      baseUrl: "https://example.com",
      healthOk: true,
      readyForPaidLaunch: false,
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: ["Clinical content review"],
      warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
      launchActions: [
        {
          id: "production-database",
          title: "Create and initialize hosted PostgreSQL",
          status: "app-command",
          whyItMatters: "Durable records are required.",
          action: "Run pnpm db:setup.",
          evidenceNeeded: "Database setup succeeds.",
        },
      ],
    });
    expect(requestedUrls).toEqual([
      "https://example.com/api/health",
      "https://example.com/api/launch/readiness",
    ]);
  });

  it("renders a safe markdown smoke report", () => {
    const report = renderDeploymentSmokeReport({
      baseUrl: "https://academy.spindeleye.com",
      healthOk: true,
      readyForPaidLaunch: false,
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: ["Clinical content review"],
      warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
      launchActions: [
        {
          id: "production-database",
          title: "Create and initialize hosted PostgreSQL",
          status: "app-command",
          whyItMatters: "Durable records are required.",
          action: "Run pnpm db:setup.",
          evidenceNeeded: "Database setup succeeds.",
        },
      ],
    });

    expect(report).toContain("OptiTech Academy Deployment Smoke Test");
    expect(report).toContain("Deployment URL: https://academy.spindeleye.com");
    expect(report).toContain("- Health endpoint: ok");
    expect(report).toContain("- Paid launch readiness: not ready");
    expect(report).toContain("Create and initialize hosted PostgreSQL");
    expect(report).not.toContain("sk_test_");
    expect(report).not.toContain("whsec_123");
  });

  it("fails clearly when a deployed endpoint is unavailable", async () => {
    await expect(
      runDeploymentSmokeTest({
        baseUrl: "https://example.com",
        fetcher: (async () =>
          createResponse({}, { ok: false, status: 503 })) as typeof fetch,
      })
    ).rejects.toThrow("https://example.com/api/health returned HTTP 503.");
  });
});
