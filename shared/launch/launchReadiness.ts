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
      "Individual offer, practice packs, policies, certificate language, and educational limitations are visible before purchase.",
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
      "Server route creates Stripe Checkout Sessions and fails closed when STRIPE_SECRET_KEY is missing.",
    nextAction:
      "Add production Stripe secrets, test card flow, and confirm success/cancel redirects in a deployed environment.",
  },
  {
    id: "stripe-webhooks",
    title: "Verified Stripe webhook fulfillment",
    status: "blocked",
    evidence:
      "Checkout redirects exist, but payment success does not yet provision durable learner access through a verified webhook.",
    nextAction:
      "Add a Stripe webhook route that verifies signatures and records purchases before unlocking paid access.",
  },
  {
    id: "learner-access-control",
    title: "Learner accounts and access control",
    status: "blocked",
    evidence:
      "Current progress is local-browser storage only; there are no authenticated learner accounts or server-side enrollments.",
    nextAction:
      "Add authentication, enrollment records, and authorization rules before selling durable access.",
  },
  {
    id: "assessment-security",
    title: "Assessment security",
    status: "blocked",
    evidence:
      "Current quizzes are client-side learning interactions; answer keys are not protected by a server-side submission flow.",
    nextAction:
      "Move scored assessment submission and answer validation to the server before high-stakes completion logic.",
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
  const readyCount = items.filter((item) => item.status === "ready").length;
  const inProgressCount = items.filter(
    (item) => item.status === "in-progress"
  ).length;
  const blockedItems = items.filter((item) => item.status === "blocked");

  return {
    ready: blockedItems.length === 0 && inProgressCount === 0,
    readyCount,
    inProgressCount,
    blockedCount: blockedItems.length,
    blockers: blockedItems.map((item) => item.title),
  };
}
