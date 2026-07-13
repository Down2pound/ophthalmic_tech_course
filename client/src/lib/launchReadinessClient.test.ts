import { describe, expect, it, vi } from "vitest";
import { fetchRuntimeLaunchReadiness } from "./launchReadinessClient";

const runtimeReport = {
  generatedAt: "2026-06-26T12:00:00.000Z",
  readyForPaidLaunch: false,
  staticSummary: {
    ready: false,
    readyCount: 1,
    inProgressCount: 2,
    blockedCount: 4,
    blockers: ["Clinical content review"],
  },
  commerce: {
    checkoutConfigured: true,
    webhookConfigured: false,
    missingCheckoutVariables: [],
    missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
  },
  auth: {
    passwordlessConfigured: false,
    missingPasswordlessVariables: ["TRANSACTIONAL_EMAIL_API_KEY"],
  },
  practiceSeatAdmin: {
    practiceSeatAdminConfigured: false,
    missingPracticeSeatAdminVariables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
  },
  database: {
    databaseConfigured: false,
    missingDatabaseVariables: ["DATABASE_URL"],
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
};

describe("fetchRuntimeLaunchReadiness", () => {
  it("returns the runtime readiness report", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => runtimeReport,
    });

    await expect(fetchRuntimeLaunchReadiness({ fetcher })).resolves.toEqual(
      runtimeReport
    );
    expect(fetcher).toHaveBeenCalledWith("/api/launch/readiness");
  });

  it("surfaces readiness fetch failures", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Readiness unavailable" }),
    });

    await expect(fetchRuntimeLaunchReadiness({ fetcher })).rejects.toThrow(
      "Readiness unavailable"
    );
  });
});
