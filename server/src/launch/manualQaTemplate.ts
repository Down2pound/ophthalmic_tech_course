import type { LaunchActionItem } from "../../../shared/launch/launchActionPlan";
import { getRemainingLaunchActions } from "../../../shared/launch/launchActionPlan";

export interface ManualQaTemplateInput {
  generatedAt?: string;
  launchActions?: LaunchActionItem[];
}

function renderChecklistItem(label: string): string {
  return `- [ ] ${label}`;
}

function renderEvidenceSection(action: LaunchActionItem): string[] {
  return [
    `## ${action.title}`,
    "",
    `Why it matters: ${action.whyItMatters}`,
    "",
    `Required action: ${action.action}`,
    "",
    `Evidence needed: ${action.evidenceNeeded}`,
    "",
    renderChecklistItem("Completed"),
    renderChecklistItem("Passed without blocking issue"),
    renderChecklistItem("Evidence saved without secrets"),
    "",
    "Tester:",
    "",
    "Date:",
    "",
    "Environment URL:",
    "",
    "Result:",
    "",
    "Notes:",
    "",
  ];
}

function renderPaidLaunchEvidencePrompts(): string[] {
  return [
    "## Paid Launch Evidence Details",
    "",
    "Record IDs and screenshots only when they do not expose secrets, card numbers, cookies, patient information, or private learner data.",
    "",
    "### Stripe Individual Learner Test",
    "",
    "Stripe checkout session ID:",
    "",
    "Stripe event ID:",
    "",
    "Webhook delivery status:",
    "",
    "Learner email used:",
    "",
    "Enrollment/access result:",
    "",
    "Individual checkout success return URL:",
    "",
    "Individual checkout cancel return URL:",
    "",
    renderChecklistItem(
      "Individual success return showed the learner payment received message"
    ),
    renderChecklistItem(
      "Individual cancel return showed no payment was taken"
    ),
    "",
    "### Passwordless Email Delivery",
    "",
    "Email provider used:",
    "",
    "Sender address verified:",
    "",
    "Test learner inbox:",
    "",
    "Delivery result:",
    "",
    renderChecklistItem(
      "Sign-in email arrived without exposing raw token in support notes"
    ),
    renderChecklistItem(
      "Sign-in link opened the deployed app and created a session"
    ),
    renderChecklistItem(
      "Learner could request a fresh sign-in link from the Learn page access panel"
    ),
    renderChecklistItem("Failed or expired sign-in link showed a safe error"),
    "",
    "### Stripe Practice Pack Test",
    "",
    "Stripe checkout session ID:",
    "",
    "Stripe event ID:",
    "",
    "Webhook delivery status:",
    "",
    "Practice manager email used:",
    "",
    "Seat pack size purchased:",
    "",
    "Seat assignment result:",
    "",
    "Practice checkout success return URL:",
    "",
    "Practice checkout cancel return URL:",
    "",
    renderChecklistItem(
      "Practice success return showed practice pack payment received next steps"
    ),
    renderChecklistItem(
      "Practice cancel return kept the buyer on the practice pack options"
    ),
    renderChecklistItem(
      "Practice success next steps asked for learner emails without requesting private patient or staff details"
    ),
    "",
    "### Custom Practice Inquiry Test",
    "",
    "Inquiry email address:",
    "",
    "Inquiry subject:",
    "",
    "Practice size or rollout note:",
    "",
    renderChecklistItem("Larger-practice inquiry path is visible on `/practice-packs`"),
    renderChecklistItem(
      "Inquiry message does not include patient information or secrets"
    ),
    renderChecklistItem(
      "Custom inquiry is treated as a conversation, not an automatic purchase agreement"
    ),
    "",
    "### Webhook Failure Handling",
    "",
    renderChecklistItem(
      "Invalid webhook signature was rejected in test mode or by automated test evidence"
    ),
    renderChecklistItem(
      "Completed checkout event with missing purchase data does not get marked as successfully fulfilled"
    ),
    "",
    "Notes:",
    "",
    "### Search And Sharing",
    "",
    "Public domain:",
    "",
    "Sitemap URL or generated sitemap path:",
    "",
    "Shared-link preview checked for title/description:",
    "",
    "### Final Paid Enrollment Switch",
    "",
    renderChecklistItem(
      "ENABLE_PAID_ENROLLMENT stayed false until all gates passed"
    ),
    renderChecklistItem(
      "Final readiness check passed after the switch was enabled"
    ),
    renderChecklistItem(
      "One low-risk live-mode internal purchase was verified"
    ),
    "",
  ];
}

export function renderManualQaTemplate({
  generatedAt = new Date().toISOString(),
  launchActions = getRemainingLaunchActions(),
}: ManualQaTemplateInput = {}): string {
  const manualQaActions = launchActions.filter(
    action => action.status === "manual-qa"
  );

  return [
    "# OptiTech Academy Manual Launch QA Evidence",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Use this file to record the human launch checks that cannot be proven by automated tests alone.",
    "",
    "Do not paste card numbers, Stripe secret keys, webhook secrets, raw magic-link tokens, session cookies, database passwords, or generated admin/session secrets into this file.",
    "",
    "## Release Candidate",
    "",
    "Deployment URL:",
    "",
    "Commit SHA:",
    "",
    "Tester:",
    "",
    "QA date:",
    "",
    "## Preflight",
    "",
    renderChecklistItem("Clinical review signoff is saved with launch records"),
    renderChecklistItem(
      "Production database setup completed with `pnpm db:setup`"
    ),
    renderChecklistItem("Production host environment variables are configured"),
    renderChecklistItem("`/api/health` returns ok"),
    renderChecklistItem(
      "`/api/launch/readiness` shows the expected launch status"
    ),
    "",
    ...manualQaActions.flatMap(renderEvidenceSection),
    ...renderPaidLaunchEvidencePrompts(),
    "## Final Decision",
    "",
    renderChecklistItem("No blocking checkout issue"),
    renderChecklistItem("No blocking learner access issue"),
    renderChecklistItem("No blocking practice pack issue"),
    renderChecklistItem(
      "No blocking browser, mobile, keyboard, label, contrast, or overflow issue"
    ),
    "",
    "Decision:",
    "",
    "Approver:",
    "",
  ].join("\n");
}
