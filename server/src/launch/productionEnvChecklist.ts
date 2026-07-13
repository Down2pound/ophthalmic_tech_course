export interface ProductionEnvironmentChecklistItem {
  variableName: string;
  source: string;
  validationRule: string;
  launchNote: string;
}

export interface ProductionEnvironmentChecklistInput {
  generatedAt?: string;
}

export const productionEnvironmentChecklist: ProductionEnvironmentChecklistItem[] =
  [
    {
      variableName: "PUBLIC_APP_URL",
      source: "Production host domain after deployment.",
      validationRule: "Must be the deployed https URL, not localhost.",
      launchNote: "Used for Stripe redirects and passwordless sign-in links.",
    },
    {
      variableName: "STRIPE_SECRET_KEY",
      source: "Stripe dashboard server-side API key.",
      validationRule: "Must start with sk_ and stay server-only.",
      launchNote: "Creates Stripe Checkout sessions.",
    },
    {
      variableName: "STRIPE_WEBHOOK_SECRET",
      source: "Stripe webhook endpoint signing secret.",
      validationRule: "Must start with whsec_ and stay server-only.",
      launchNote: "Verifies checkout.session.completed events.",
    },
    {
      variableName: "DATABASE_URL",
      source: "Managed PostgreSQL provider.",
      validationRule: "Must be a postgres or postgresql connection URL.",
      launchNote: "Stores purchases, access, sign-ins, progress, and quizzes.",
    },
    {
      variableName: "DATABASE_SSL",
      source: "Managed PostgreSQL provider requirement.",
      validationRule: "Usually true for hosted databases.",
      launchNote: "Enables SSL for production database connections.",
    },
    {
      variableName: "AUTH_SESSION_SECRET",
      source: "Generated with pnpm launch:secrets.",
      validationRule: "At least 32 characters and never committed.",
      launchNote: "Protects passwordless sign-in sessions.",
    },
    {
      variableName: "TRANSACTIONAL_EMAIL_API_URL",
      source: "Transactional email provider. Resend: https://api.resend.com/emails.",
      validationRule: "Must be an https API endpoint.",
      launchNote: "Sends passwordless sign-in links.",
    },
    {
      variableName: "TRANSACTIONAL_EMAIL_API_KEY",
      source: "Transactional email provider.",
      validationRule:
        "At least 16 characters and server-only. Resend keys should start with re_.",
      launchNote: "Authorizes passwordless email delivery.",
    },
    {
      variableName: "SIGN_IN_FROM_EMAIL",
      source: "Verified sender email at the email provider.",
      validationRule: "Must include an email address with @.",
      launchNote: "Shown as the sender for sign-in links.",
    },
    {
      variableName: "PRACTICE_SEAT_ADMIN_TOKEN",
      source: "Generated with pnpm launch:secrets.",
      validationRule: "At least 32 characters and never committed.",
      launchNote: "Protects temporary practice seat assignment tools.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      source: "Clinical review signoff record.",
      validationRule: "Required after Module 1 review is approved.",
      launchNote: "Documents who approved Module 1 for paid launch.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      source: "Clinical review signoff record.",
      validationRule: "Required after Module 1 review is approved.",
      launchNote: "Documents reviewer role or credentials.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEW_DATE",
      source: "Clinical review signoff record.",
      validationRule: "Use the review approval date.",
      launchNote: "Documents when Module 1 was approved.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      source: "Clinical review signoff record.",
      validationRule: "Use the approved module/content version.",
      launchNote: "Documents which content version was reviewed.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
      source: "Clinical review signoff record.",
      validationRule: "Keep false until corrections are resolved; then true.",
      launchNote: "Unlocks the clinical review launch gate.",
    },
    {
      variableName: "ENABLE_PAID_ENROLLMENT",
      source: "Final launch decision.",
      validationRule: "Keep false until every launch gate passes.",
      launchNote: "Turns paid checkout on only after readiness is proven.",
    },
    {
      variableName: "VITE_ANALYTICS_ENDPOINT",
      source: "Optional analytics provider.",
      validationRule: "Leave blank to disable analytics.",
      launchNote: "Only needed if you want browser analytics at launch.",
    },
    {
      variableName: "VITE_ANALYTICS_WEBSITE_ID",
      source: "Optional analytics provider.",
      validationRule: "Leave blank to disable analytics.",
      launchNote: "Pairs with VITE_ANALYTICS_ENDPOINT when analytics is used.",
    },
    {
      variableName: "LAUNCH_SITEMAP_PATH",
      source: "Local launch command setting.",
      validationRule: "Optional; defaults to dist/public/sitemap.xml.",
      launchNote:
        "Used by pnpm launch:sitemap when saving a generated sitemap file.",
    },
  ];

export function renderProductionEnvChecklist({
  generatedAt = new Date().toISOString(),
}: ProductionEnvironmentChecklistInput = {}): string {
  return [
    "# OptiTech Academy Production Environment Checklist",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Use this as a fill-in checklist for your hosting dashboard. Leave actual values out of this file.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, database passwords, email API keys, generated session secrets, or admin tokens into this checklist.",
    "",
    "| Set? | Variable | Source | Validation | Launch note |",
    "| --- | --- | --- | --- | --- |",
    ...productionEnvironmentChecklist.map(
      item =>
        `| [ ] | \`${item.variableName}\` | ${item.source} | ${item.validationRule} | ${item.launchNote} |`
    ),
    "",
    "After setting values in the host dashboard, run `pnpm launch:doctor` or open `/api/launch/readiness` to confirm the app sees them.",
    "",
  ].join("\n");
}
