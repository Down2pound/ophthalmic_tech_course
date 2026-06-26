export const commerceSchemaTables = [
  "commerce_purchases",
  "commerce_enrollments",
] as const;

export const commerceSchemaSql = `
CREATE TABLE IF NOT EXISTS commerce_purchases (
  id TEXT PRIMARY KEY,
  stripe_event_id TEXT NOT NULL UNIQUE,
  checkout_session_id TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT NOT NULL,
  access_months INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_enrollments (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES commerce_purchases(id),
  checkout_session_id TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  learner_email TEXT NOT NULL,
  status TEXT NOT NULL,
  access_started_at TIMESTAMPTZ NOT NULL,
  access_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commerce_purchases_purchaser_email_idx
  ON commerce_purchases (purchaser_email);

CREATE INDEX IF NOT EXISTS commerce_enrollments_learner_email_idx
  ON commerce_enrollments (learner_email);
`;

export function getCommerceSchemaChecklist(): string[] {
  return [
    "Run the commerce schema against managed PostgreSQL.",
    "Replace temporary in-memory purchase and enrollment stores with database repositories.",
    "Wrap purchase recording and enrollment provisioning in one transaction.",
    "Keep Stripe webhook idempotency enforced by unique event and checkout session fields.",
  ];
}
