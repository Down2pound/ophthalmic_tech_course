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

function createTextResponse(options: { ok?: boolean; status?: number } = {}) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    async text() {
      return "<!doctype html><title>OptiTech Academy</title>";
    },
  } as Response;
}

describe("runDeploymentSmokeTest", () => {
  it("checks deployed health, public pages, and paid launch readiness", async () => {
    const requestedUrls: string[] = [];
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);
      requestedUrls.push(requestedUrl);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
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
      }

      return createTextResponse();
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
      publicPagesOk: true,
      publicPages: [
        { path: "/", ok: true, status: 200 },
        { path: "/checkout", ok: true, status: 200 },
        { path: "/practice-packs", ok: true, status: 200 },
        { path: "/policies", ok: true, status: 200 },
        { path: "/curriculum", ok: true, status: 200 },
        { path: "/onboarding", ok: true, status: 200 },
      ],
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
      "https://example.com/",
      "https://example.com/checkout",
      "https://example.com/practice-packs",
      "https://example.com/policies",
      "https://example.com/curriculum",
      "https://example.com/onboarding",
    ]);
  });

  it("reports public buyer page failures", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: false,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/checkout")) {
        return createTextResponse({ ok: false, status: 500 });
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.publicPagesOk).toBe(false);
    expect(report.publicPages).toContainEqual({
      path: "/checkout",
      ok: false,
      status: 500,
    });
  });

  it("renders a safe markdown smoke report", () => {
    const report = renderDeploymentSmokeReport({
      baseUrl: "https://academy.spindeleye.com",
      healthOk: true,
      publicPagesOk: true,
      publicPages: [
        { path: "/", ok: true, status: 200 },
        { path: "/checkout", ok: true, status: 200 },
      ],
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
    expect(report).toContain("- Public buyer pages: ok");
    expect(report).toContain("/checkout: ok (HTTP 200)");
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
