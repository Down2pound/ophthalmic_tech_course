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
      "commerce_practice_seat_packs",
    ]);
    expect(commerceSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS commerce_purchases"
    );
    expect(commerceSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS commerce_enrollments"
    );
    expect(commerceSchemaSql).toContain(
      "CREATE TABLE IF NOT EXISTS commerce_practice_seat_packs"
    );
  });

  it("protects Stripe fulfillment from duplicate events and sessions", () => {
    expect(commerceSchemaSql).toContain("stripe_event_id TEXT NOT NULL UNIQUE");
    expect(commerceSchemaSql).toContain(
      "checkout_session_id TEXT NOT NULL UNIQUE"
    );
    expect(commerceSchemaSql).toContain(
      "purchase_id TEXT NOT NULL REFERENCES commerce_purchases"
    );
  });

  it("tracks practice seat pack capacity safely", () => {
    expect(commerceSchemaSql).toContain("seat_count INTEGER");
    expect(commerceSchemaSql).toContain("total_seats INTEGER NOT NULL");
    expect(commerceSchemaSql).toContain(
      "assigned_seats INTEGER NOT NULL DEFAULT 0"
    );
    expect(commerceSchemaSql).toContain(
      "CHECK (assigned_seats <= total_seats)"
    );
  });
});

describe("getCommerceSchemaChecklist", () => {
  it("summarizes the production database gates still required", () => {
    expect(getCommerceSchemaChecklist()).toEqual([
      "Run the commerce schema against managed PostgreSQL.",
      "Replace temporary in-memory purchase and enrollment stores with database repositories.",
      "Wrap purchase recording and enrollment provisioning in one transaction.",
      "Keep Stripe webhook idempotency enforced by unique event and checkout session fields.",
      "Provision practice seat packs from checkout metadata before inviting individual learners.",
    ]);
  });
});
