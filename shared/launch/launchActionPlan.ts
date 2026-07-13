export type LaunchActionStatus = "external" | "app-command" | "manual-qa";

export interface LaunchActionItem {
  id: string;
  title: string;
  status: LaunchActionStatus;
  whyItMatters: string;
  action: string;
  evidenceNeeded: string;
}

export const launchActionPlan: LaunchActionItem[] = [
  {
    id: "clinical-review-signoff",
    title: "Get clinical review signoff",
    status: "external",
    whyItMatters:
      "Paid clinical education should not launch while Module 1 still says clinical review is required.",
    action:
      "Have an appropriate reviewer read Module 1, approve or correct it, then update the review metadata.",
    evidenceNeeded:
      "Reviewer name, review date, and clinically-reviewed status recorded in course metadata.",
  },
  {
    id: "production-database",
    title: "Create and initialize hosted PostgreSQL",
    status: "app-command",
    whyItMatters:
      "Purchases, sign-ins, lesson progress, quiz attempts, practice seats, and certificate eligibility need durable records.",
    action:
      "Create a managed PostgreSQL database, set DATABASE_URL, then run pnpm db:setup.",
    evidenceNeeded:
      "pnpm db:setup completes successfully against the hosted database.",
  },
  {
    id: "production-env",
    title: "Configure production secrets",
    status: "external",
    whyItMatters:
      "Stripe, email sign-in, practice seats, and the database all fail closed until required environment variables exist.",
    action:
      "Set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, PUBLIC_APP_URL, AUTH_SESSION_SECRET, TRANSACTIONAL_EMAIL_API_URL, TRANSACTIONAL_EMAIL_API_KEY, SIGN_IN_FROM_EMAIL, PRACTICE_SEAT_ADMIN_TOKEN, and DATABASE_URL in the host dashboard.",
    evidenceNeeded:
      "GET /api/launch/readiness reports no missing environment variables.",
  },
  {
    id: "stripe-webhook-test",
    title: "Test Stripe checkout and webhook fulfillment",
    status: "manual-qa",
    whyItMatters:
      "The course cannot be sold until a real Stripe checkout creates durable learner access.",
    action:
      "Run Stripe test checkout for an individual learner and a practice pack, then confirm webhook-created records unlock access.",
    evidenceNeeded:
      "A successful test payment creates durable enrollment or practice-seat records and grants the expected learner access.",
  },
  {
    id: "learner-flow-test",
    title: "Test the paid learner flow end to end",
    status: "manual-qa",
    whyItMatters:
      "Learners need to pay, sign in, learn, submit a quiz, and see certificate eligibility without manual fixes.",
    action:
      "Run purchase -> passwordless sign-in -> Module 1 lessons -> quiz submit -> certificate eligibility on the deployed app.",
    evidenceNeeded:
      "The deployment smoke test passes and a learner can complete the full paid flow.",
  },
  {
    id: "browser-accessibility-qa",
    title: "Run browser and accessibility QA",
    status: "manual-qa",
    whyItMatters:
      "A paid course must work on normal devices and be usable with keyboard, readable labels, and no broken mobile layouts.",
    action:
      "Check desktop and mobile layouts, keyboard navigation, form labels, contrast, and text overflow on the deployed app.",
    evidenceNeeded:
      "QA notes show no blocking desktop, mobile, keyboard, label, contrast, or overflow issues.",
  },
];

export function getRemainingLaunchActions(): LaunchActionItem[] {
  return launchActionPlan;
}
