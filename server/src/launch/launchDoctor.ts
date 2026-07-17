import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import { getRuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

export interface LaunchDoctorInput {
  readinessReport?: RuntimeLaunchReadinessReport;
}

function statusLabel(ready: boolean): string {
  return ready ? "PASS" : "NEEDS WORK";
}

function renderList(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function renderMissingVariables(label: string, missingVariables: string[]) {
  return [
    `### ${label}`,
    "",
    ...renderList(missingVariables, "No missing variables."),
    "",
  ];
}

export function renderLaunchDoctorReport({
  readinessReport = getRuntimeLaunchReadinessReport(),
}: LaunchDoctorInput = {}): string {
  const readiness = readinessReport;
  const nextSetupSteps = readiness.nextSetupSteps ?? [];
  const setupSections = [
    {
      label: "Stripe checkout",
      ready: readiness.commerce.checkoutConfigured,
      missing: readiness.commerce.missingCheckoutVariables,
    },
    {
      label: "Stripe webhook",
      ready: readiness.commerce.webhookConfigured,
      missing: readiness.commerce.missingWebhookVariables,
    },
    {
      label: "Passwordless sign-in",
      ready: readiness.auth.passwordlessConfigured,
      missing: readiness.auth.missingPasswordlessVariables,
    },
    {
      label: "Practice seat admin",
      ready: readiness.practiceSeatAdmin.practiceSeatAdminConfigured,
      missing: readiness.practiceSeatAdmin.missingPracticeSeatAdminVariables,
    },
    {
      label: "Alert admin",
      ready: readiness.alertAdmin.alertAdminConfigured,
      missing: readiness.alertAdmin.missingAlertAdminVariables,
    },
    {
      label: "Database connection",
      ready: readiness.database.databaseConfigured,
      missing: readiness.database.missingDatabaseVariables,
    },
    {
      label: "Module 1 clinical signoff",
      ready: readiness.clinicalReview.moduleOneReviewApproved,
      missing: readiness.clinicalReview.missingModuleOneReviewVariables,
    },
  ];

  return [
    "# OptiTech Academy Launch Doctor",
    "",
    `Generated at: ${readiness.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Paid launch ready: ${readiness.readyForPaidLaunch ? "yes" : "no"}`,
    `- Individual learner sales: ${readiness.salesChannels.individualLearner.ready ? "ready" : "blocked"}`,
    `- Practice pack sales: ${readiness.salesChannels.practicePacks.ready ? "ready" : "blocked"}`,
    `- Static launch checklist: ${statusLabel(readiness.staticSummary.ready)}`,
    `- Paid enrollment switch: ${readiness.commerce.paidEnrollmentEnabled ? "on" : "off"}`,
    `- Database schema verified: ${readiness.databaseReadiness.schemaVerified ? "yes" : "no"}`,
    "",
    "## Runtime Setup",
    "",
    ...setupSections.map(
      section => `- ${section.label}: ${statusLabel(section.ready)}`
    ),
    "",
    "## Missing Environment Variables",
    "",
    ...setupSections.flatMap(section =>
      renderMissingVariables(section.label, section.missing)
    ),
    "## Buyer Channel Readiness",
    "",
    "### Individual Learners",
    "",
    ...renderList(
      readiness.salesChannels.individualLearner.blockers,
      "Ready to sell individual learner access."
    ),
    "",
    "### Practice Packs",
    "",
    ...renderList(
      readiness.salesChannels.practicePacks.blockers,
      "Ready to sell practice pack access."
    ),
    "",
    "## Database Schema",
    "",
    `- Required tables: ${readiness.databaseReadiness.requiredTables.length}`,
    `- Checked tables: ${readiness.databaseReadiness.checkedTableCount}`,
    `- Schema check failed: ${readiness.databaseReadiness.checkFailed ? "yes" : "no"}`,
    "",
    ...renderList(
      readiness.databaseReadiness.missingTables,
      "No missing launch tables."
    ),
    "",
    "## Active Warnings",
    "",
    ...renderList(readiness.warnings, "No active warnings."),
    "",
    "## Recommended Next Setup Steps",
    "",
    ...nextSetupSteps
      .flatMap(step => [
        `- ${step.title}: ${step.detail}`,
        step.command ? `  Command or setting: \`${step.command}\`` : "",
      ])
      .filter(Boolean),
    ...(nextSetupSteps.length === 0
      ? ["- No runtime setup steps reported."]
      : []),
    "",
    "## Next Actions",
    "",
    ...readiness.launchActions.map(
      action =>
        `- ${action.title}: ${action.action} Evidence needed: ${action.evidenceNeeded}`
    ),
    "",
  ].join("\n");
}
