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
    "## Next Actions",
    "",
    ...readiness.launchActions.map(
      action =>
        `- ${action.title}: ${action.action} Evidence needed: ${action.evidenceNeeded}`
    ),
    "",
  ].join("\n");
}
