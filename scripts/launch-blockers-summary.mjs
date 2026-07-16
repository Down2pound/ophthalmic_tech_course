#!/usr/bin/env node

const requiredGroups = [
  {
    label: "Clinical review",
    docs: "docs/launch/clinical-review-guide.md",
    variables: [
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      "MODULE_ONE_CLINICAL_REVIEW_DATE",
      "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
    ],
  },
  {
    label: "Stripe checkout and webhook",
    docs: "docs/launch/stripe-setup-guide.md",
    variables: [
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
      "PUBLIC_APP_URL",
      "ENABLE_PAID_ENROLLMENT",
    ],
  },
  {
    label: "Passwordless sign-in email",
    docs: "docs/launch/email-setup-guide.md",
    variables: [
      "AUTH_SESSION_SECRET",
      "TRANSACTIONAL_EMAIL_API_URL",
      "TRANSACTIONAL_EMAIL_API_KEY",
      "SIGN_IN_FROM_EMAIL",
      "PUBLIC_APP_URL",
    ],
  },
  {
    label: "Hosted database",
    docs: "docs/launch/database-setup-guide.md",
    variables: ["DATABASE_URL", "DATABASE_SSL"],
  },
  {
    label: "Practice and alert admin protection",
    docs: "docs/launch/go-live-checklist.md",
    variables: ["PRACTICE_SEAT_ADMIN_TOKEN", "ALERT_ADMIN_TOKEN"],
  },
];

function isBlank(value) {
  return !value || value.trim().length === 0;
}

function isPlaceholder(value) {
  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.includes("replace_with") ||
    normalizedValue.includes("your_") ||
    normalizedValue.includes("example.com") ||
    normalizedValue.includes("_replace_")
  );
}

function missingVariablesForGroup(group) {
  return group.variables.filter(variableName => {
    const value = process.env[variableName];
    return isBlank(value) || isPlaceholder(value);
  });
}

function renderStatus(missingVariables) {
  return missingVariables.length === 0 ? "configured" : "needs work";
}

const groupStatuses = requiredGroups.map(group => ({
  ...group,
  missingVariables: missingVariablesForGroup(group),
}));
const blockerCount = groupStatuses.filter(
  group => group.missingVariables.length > 0
).length;

const lines = [
  "# OptiTech Academy Launch Blockers Summary",
  "",
  "This is a work-computer-safe summary. It uses plain Node and does not print secret values.",
  "",
  `Paid launch likely ready from environment only: ${blockerCount === 0 ? "maybe" : "no"}`,
  "",
  "## Setup Areas",
  "",
];

groupStatuses.forEach(group => {
  lines.push(`### ${group.label}`);
  lines.push("");
  lines.push(`- Status: ${renderStatus(group.missingVariables)}`);
  lines.push(`- Guide: ${group.docs}`);
  lines.push(
    `- Missing or placeholder variables: ${
      group.missingVariables.length === 0
        ? "none detected"
        : group.missingVariables.join(", ")
    }`
  );
  lines.push("");
});

lines.push("## First-Sale Action Order");
lines.push("");
lines.push(
  "Simple path: make the app safe, then make it reachable, then make it able to take money."
);
lines.push("");
lines.push("1. Push or restore the latest branch on a home PC.");
lines.push(
  "2. Run `pnpm install`, `pnpm check`, `pnpm test`, and `pnpm launch:preflight`."
);
lines.push(
  "3. Run `pnpm launch:clinical-review`, then complete Module 1 clinical review before turning on paid enrollment."
);
lines.push("4. Print host settings with `pnpm launch:env-template`.");
lines.push("5. Deploy the app and set `PUBLIC_APP_URL` to the real HTTPS URL.");
lines.push("6. Configure the hosted database, then run `pnpm db:setup`.");
lines.push(
  "7. Configure Stripe checkout, Stripe webhook, passwordless email, and admin tokens."
);
lines.push(
  "8. Run `LAUNCH_BASE_URL=https://your-domain.example pnpm launch:smoke` against production."
);
lines.push("9. Complete one low-risk internal live-mode purchase.");
lines.push("");

lines.push("## Final Go-Live Proof");
lines.push("");
lines.push("- Run `pnpm launch:preflight` from a home PC.");
lines.push("- Deploy to the production host.");
lines.push("- Run `pnpm db:setup` against the production database.");
lines.push("- Run the deployment smoke test against the real production URL.");
lines.push(
  "- Complete one low-risk internal live-mode purchase before public sales."
);
lines.push("");
lines.push("Main checklist: docs/launch/go-live-checklist.md");
lines.push("");

console.log(lines.join("\n"));
