export type LaunchGateStatus = "ready" | "in-progress" | "blocked";

export interface LaunchReadinessItem {
  id: string;
  title: string;
  status: LaunchGateStatus;
  evidence: string;
  nextAction: string;
}

export interface LaunchReadinessSummary {
  ready: boolean;
  readyCount: number;
  inProgressCount: number;
  blockedCount: number;
  blockers: string[];
}

export const launchReadinessChecklist: LaunchReadinessItem[] = [
  {
    id: "truthful-public-offer",
    title: "Truthful public offer and policy visibility",
    status: "ready",
    evidence:
      "Individual offer, practice packs, policies, certificate language, educational limitations, and post-payment next steps are visible without overstating durable access.",
    nextAction:
      "Keep reviewing public copy whenever pricing, content scope, or certificate language changes.",
  },
  {
    id: "clinical-review",
    title: "Clinical content review",
    status: "blocked",
    evidence:
      "Module 1 content includes source metadata, but review still says clinical review required before production sale.",
    nextAction:
      "Assign a clinical reviewer, record review date, and resolve any clinical or scope corrections before paid launch.",
  },
  {
    id: "stripe-checkout",
    title: "Stripe Checkout session creation",
    status: "in-progress",
    evidence:
      "Server route creates Stripe Checkout Sessions, reports missing setup variables when checkout is not configured, and has a safe .env.example template for local Stripe setup.",
    nextAction:
      "Add real Stripe test/production secrets outside Git, test card flow, webhook delivery, and success/cancel redirects in a deployed environment.",
  },
  {
    id: "stripe-webhooks",
    title: "Verified Stripe webhook fulfillment",
    status: "blocked",
    evidence:
      "A signed Stripe webhook receiver can report missing setup variables, verify checkout.session.completed events, record purchases, provision individual enrollments idempotently, provision practice seat packs from Stripe metadata, and a protected practice-seat manager page can list packs, list assignments, and enforce purchased seat capacity through protected admin endpoints. PostgreSQL repositories now exist, are selected when DATABASE_URL is configured, and a db:setup command applies the required commerce, auth, and assessment schemas, but the schema setup still needs to be run against a managed database and verified in deployment.",
    nextAction:
      "Run pnpm db:setup against managed PostgreSQL, configure DATABASE_URL in production, test Stripe webhook fulfillment against durable records, and unlock paid access from durable server-side records.",
  },
  {
    id: "learner-access-control",
    title: "Learner accounts and access control",
    status: "blocked",
    evidence:
      "A server-side entitlement rule can derive access from verified purchases, the webhook can create individual enrollments and practice seat packs, a protected practice-seat manager page can list packs and create learner enrollments without exceeding paid seats, PostgreSQL commerce repositories exist for durable purchases and enrollments, PostgreSQL auth repositories exist for durable magic links and sessions when DATABASE_URL is configured, magic-link request/token helpers exist, a safe passwordless sign-in request route stores hashed magic-link records server-side and sends through a configured transactional email endpoint, a callback route consumes one-time links into HTTP-only session cookies, a session access endpoint checks active server-side enrollments, Module 1 lesson bodies are served through a protected lesson endpoint, Module 1 assessment attempts use PostgreSQL when DATABASE_URL is configured, a db:setup command applies the required schemas, and runtime readiness checks auth environment setup, but schemas still need to be run and verified in deployment before full production sale.",
    nextAction:
      "Run pnpm db:setup against managed PostgreSQL, configure DATABASE_URL in production, test the full purchase-to-sign-in-to-quiz flow in deployment, and expand server-checked authorization to future paid modules before selling durable access.",
  },
  {
    id: "assessment-security",
    title: "Assessment security",
    status: "in-progress",
    evidence:
      "Module 1 has a protected server-side knowledge-check endpoint that returns questions without answer keys, a protected submit endpoint that scores answers server-side, a server-side attempt store that tracks quiz progress, a PostgreSQL assessment repository for durable attempts when DATABASE_URL is configured, a PostgreSQL-ready assessment schema, and a db:setup command, but the schema still needs to be run in production and older client quiz data plus future module assessments still need migration before high-stakes completion logic.",
    nextAction:
      "Run pnpm db:setup against managed PostgreSQL, configure DATABASE_URL in production, migrate remaining quiz data out of browser bundles, and connect completion rules to server-scored assessments before high-stakes completion logic.",
  },
  {
    id: "browser-and-accessibility-qa",
    title: "Browser, mobile, and accessibility QA",
    status: "in-progress",
    evidence:
      "TypeScript checks, the full Vitest suite, and the production build pass locally with elevated Windows test/build permissions, but desktop/mobile browser QA, keyboard checks, labels, contrast, and no-overflow checks still need to be completed before paid launch.",
    nextAction:
      "Run desktop/mobile browser QA, keyboard checks, labels, contrast, and no-overflow checks against the deployed app before paid launch.",
  },
];

export function getLaunchReadinessSummary(
  items: LaunchReadinessItem[]
): LaunchReadinessSummary {
  const readyCount = items.filter(item => item.status === "ready").length;
  const inProgressCount = items.filter(
    item => item.status === "in-progress"
  ).length;
  const blockedItems = items.filter(item => item.status === "blocked");

  return {
    ready: blockedItems.length === 0 && inProgressCount === 0,
    readyCount,
    inProgressCount,
    blockedCount: blockedItems.length,
    blockers: blockedItems.map(item => item.title),
  };
}
