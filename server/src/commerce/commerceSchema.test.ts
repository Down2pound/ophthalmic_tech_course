import { describe, expect, it } from "vitest";
import {
  commerceSchemaSql,
  commerceSchemaTables,
  getCommerceSchemaChecklist,
} from "./commerceSchema";

describe("commerceSchemaSql", () => {
  it("defines durable purchase and enrollment tables", () => {
    expect(commerceSchemaTables).toEqual([
      "commerce_purchases",
      "commerce_enrollments",
    ]);
    expect(commerceSchemaSql).toContain("CREATE TABLE IF NOT EXISTS commerce_purchases");
    expect(commerceSchemaSql).toContain("CREATE TABLE IF NOT EXISTS commerce_enrollments");
  });

  it("protects Stripe fulfillment from duplicate events and sessions", () => {
    expect(commerceSchemaSql).toContain("stripe_event_id TEXT NOT NULL UNIQUE");
    expect(commerceSchemaSql).toContain("checkout_session_id TEXT NOT NULL UNIQUE");
    expect(commerceSchemaSql).toContain("purchase_id TEXT NOT NULL REFERENCES commerce_purchases");
  });
});

describe("getCommerceSchemaChecklist", () => {
  it("summarizes the production database gates still required", () => {
    expect(getCommerceSchemaChecklist()).toEqual([
      "Run the commerce schema against managed PostgreSQL.",
      "Replace temporary in-memory purchase and enrollment stores with database repositories.",
      "Wrap purchase recording and enrollment provisioning in one transaction.",
      "Keep Stripe webhook idempotency enforced by unique event and checkout session fields.",
    ]);
  });
});
