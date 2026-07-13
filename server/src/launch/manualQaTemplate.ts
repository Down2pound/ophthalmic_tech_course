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
