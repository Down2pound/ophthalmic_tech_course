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
