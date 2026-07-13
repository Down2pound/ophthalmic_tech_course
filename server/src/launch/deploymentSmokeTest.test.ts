import { describe, expect, it } from "vitest";
import {
  getDeploymentSmokeExitCode,
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
        {
          path: "/checkout?checkout=cancelled&offer=founding-learner",
          ok: true,
          status: 200,
        },
        {
          path: "/learn?checkout=success&offer=founding-learner",
          ok: true,
          status: 200,
        },
        { path: "/practice-packs", ok: true, status: 200 },
        {
          path: "/practice-packs?checkout=cancelled&offer=practice-five-seat-pack",
          ok: true,
          status: 200,
        },
        {
          path: "/practice-packs?checkout=success&offer=practice-five-seat-pack",
          ok: true,
          status: 200,
        },
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
      "https://example.com/checkout?checkout=cancelled&offer=founding-learner",
      "https://example.com/learn?checkout=success&offer=founding-learner",
      "https://example.com/practice-packs",
      "https://example.com/practice-packs?checkout=cancelled&offer=practice-five-seat-pack",
      "https://example.com/practice-packs?checkout=success&offer=practice-five-seat-pack",
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

  it("can allow not-ready launch status for pre-launch deployment checks", () => {
    const report = {
      baseUrl: "https://academy.spindeleye.com",
      healthOk: true,
      publicPagesOk: true,
      publicPages: [],
      readyForPaidLaunch: false,
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: [],
      warnings: [],
      launchActions: [],
    };

    expect(getDeploymentSmokeExitCode(report)).toBe(1);
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(0);
  });

  it("still fails pre-launch deployment checks when public pages are broken", () => {
    expect(
      getDeploymentSmokeExitCode(
        {
          baseUrl: "https://academy.spindeleye.com",
          healthOk: true,
          publicPagesOk: false,
          publicPages: [
            {
              path: "/checkout",
              ok: false,
              status: 500,
            },
          ],
          readyForPaidLaunch: false,
          generatedAt: "2026-07-13T12:00:00.000Z",
          blockers: [],
          warnings: [],
          launchActions: [],
        },
        { allowNotReady: true }
      )
    ).toBe(1);
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
