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
      "A signed Stripe webhook receiver can report missing setup variables, verify checkout.session.completed events, record purchases, provision temporary individual enrollments idempotently, provision temporary practice seat packs from Stripe metadata, and core practice-seat assignment logic can enforce purchased seat capacity, but records are not connected to a live database yet.",
    nextAction:
      "Run the commerce schema against managed PostgreSQL, replace temporary stores with database repositories, add a manager/admin seat-assignment workflow, and unlock paid access from durable server-side records.",
  },
  {
    id: "learner-access-control",
    title: "Learner accounts and access control",
    status: "blocked",
    evidence:
      "A server-side entitlement rule can derive access from verified purchases, the webhook can create temporary individual enrollments and practice seat packs, core practice-seat assignment logic can create learner enrollments without exceeding paid seats, a PostgreSQL-ready passwordless auth schema exists, magic-link request/token helpers exist, a safe passwordless sign-in request route stores hashed magic-link records server-side and sends through a configured transactional email endpoint, a callback route consumes one-time links into HTTP-only session cookies, a session access endpoint checks active server-side enrollments, Module 1 lesson bodies are served through a protected lesson endpoint, and runtime readiness checks auth environment setup, but there is no durable PostgreSQL-backed enrollment or practice seat assignment repository yet.",
    nextAction:
      "Run auth and commerce schemas against managed PostgreSQL, add durable enrollment and practice seat assignment repositories, and expand server-checked authorization to future paid modules before selling durable access.",
  },
  {
    id: "assessment-security",
    title: "Assessment security",
    status: "in-progress",
    evidence:
      "Module 1 has a protected server-side knowledge-check endpoint that returns questions without answer keys, a protected submit endpoint that scores answers server-side, a server-side attempt store that tracks quiz progress, and a PostgreSQL-ready assessment schema, but attempts are not connected to a live database and older client quiz data plus future module assessments still need migration before high-stakes completion logic.",
    nextAction:
      "Run the assessment schema against managed PostgreSQL, replace the in-memory attempt store with a database repository, migrate remaining quiz data out of browser bundles, and connect completion rules to server-scored assessments before high-stakes completion logic.",
  },
  {
    id: "browser-and-accessibility-qa",
    title: "Browser, mobile, and accessibility QA",
    status: "in-progress",
    evidence:
      "TypeScript checks pass locally, but Vitest/build/browser verification are blocked by the current Windows sandbox spawn permissions.",
    nextAction:
      "Run full tests, production build, desktop/mobile browser QA, keyboard checks, labels, contrast, and no-overflow checks once tool permissions are available.",
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
