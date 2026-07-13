export const commerceSchemaTables = [
  "commerce_purchases",
  "commerce_enrollments",
  "commerce_practice_seat_packs",
  "commerce_practice_seat_assignments",
  "commerce_practice_inquiries",
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
  seat_count INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_enrollments (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES commerce_purchases(id),
  checkout_session_id TEXT NOT NULL,
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

CREATE UNIQUE INDEX IF NOT EXISTS commerce_enrollments_source_learner_idx
  ON commerce_enrollments (checkout_session_id, learner_email);

CREATE TABLE IF NOT EXISTS commerce_practice_seat_packs (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES commerce_purchases(id),
  checkout_session_id TEXT NOT NULL UNIQUE,
  offer_id TEXT NOT NULL,
  purchaser_email TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  assigned_seats INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  access_started_at TIMESTAMPTZ NOT NULL,
  access_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (total_seats > 0),
  CHECK (assigned_seats >= 0),
  CHECK (assigned_seats <= total_seats)
);

CREATE INDEX IF NOT EXISTS commerce_practice_seat_packs_purchaser_email_idx
  ON commerce_practice_seat_packs (purchaser_email);

CREATE TABLE IF NOT EXISTS commerce_practice_seat_assignments (
  id TEXT PRIMARY KEY,
  seat_pack_id TEXT NOT NULL REFERENCES commerce_practice_seat_packs(id),
  learner_email TEXT NOT NULL,
  status TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seat_pack_id, learner_email)
);

CREATE INDEX IF NOT EXISTS commerce_practice_seat_assignments_learner_email_idx
  ON commerce_practice_seat_assignments (learner_email);

CREATE TABLE IF NOT EXISTS commerce_practice_inquiries (
  id TEXT PRIMARY KEY,
  practice_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  estimated_learner_count INTEGER,
  target_timeline TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS commerce_practice_inquiries_contact_email_idx
  ON commerce_practice_inquiries (contact_email);
`;

export function getCommerceSchemaChecklist(): string[] {
  return [
    "Run pnpm db:setup against managed PostgreSQL.",
    "Configure DATABASE_URL so commerce records use PostgreSQL repositories.",
    "Wrap purchase recording and enrollment provisioning in one transaction.",
    "Keep Stripe webhook idempotency enforced by unique event and checkout session fields.",
    "Provision practice seat packs from checkout metadata before inviting individual learners.",
    "Assign practice seats to learner emails without exceeding purchased seat capacity.",
    "Store practice inquiries durably so larger team leads do not depend on mailto links.",
  ];
}
