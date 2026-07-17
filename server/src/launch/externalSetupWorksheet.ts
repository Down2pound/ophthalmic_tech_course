export interface ExternalSetupStep {
  id: string;
  title: string;
  accountOrTool: string;
  whyItMatters: string;
  valuesToSetInRender: string[];
  proofToSave: string[];
  safeCommand: string;
}

export const externalSetupSteps: ExternalSetupStep[] = [
  {
    id: "github-source",
    title: "Push the latest source to GitHub",
    accountOrTool: "GitHub",
    whyItMatters:
      "Render deploys from GitHub, so the newest course store code has to be backed up there before hosting.",
    valuesToSetInRender: [],
    proofToSave: [
      "GitHub branch contains the post-07/16 work.",
      "GitHub shows the commit you plan to deploy.",
    ],
    safeCommand: "pnpm launch:post-0716-handoff",
  },
  {
    id: "render-hosting",
    title: "Create the Render web service and database",
    accountOrTool: "Render",
    whyItMatters:
      "This puts the app online and gives it a managed PostgreSQL database for purchases, sign-ins, progress, and practice seats.",
    valuesToSetInRender: [
      "PUBLIC_APP_URL",
      "DATABASE_URL",
      "DATABASE_SSL",
      "ENABLE_PAID_ENROLLMENT",
    ],
    proofToSave: [
      "Render deploy succeeded.",
      "/api/health responds from the live URL.",
      "pnpm db:setup ran against the hosted database.",
    ],
    safeCommand: "pnpm launch:render-setup",
  },
  {
    id: "stripe-cash-register",
    title: "Connect Stripe checkout and webhook",
    accountOrTool: "Stripe",
    whyItMatters:
      "Stripe is the cash register. Checkout collects payment, and the webhook tells the app who should receive access.",
    valuesToSetInRender: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    proofToSave: [
      "Webhook endpoint is set to /api/stripe/webhook.",
      "Webhook listens for checkout.session.completed.",
      "A Stripe test checkout creates access in the app.",
    ],
    safeCommand: "pnpm launch:stripe-products",
  },
  {
    id: "passwordless-email",
    title: "Connect passwordless sign-in email",
    accountOrTool: "Resend or another transactional email provider",
    whyItMatters:
      "Buyers need email to receive sign-in links and purchase welcome messages.",
    valuesToSetInRender: [
      "TRANSACTIONAL_EMAIL_API_URL",
      "TRANSACTIONAL_EMAIL_API_KEY",
      "SIGN_IN_FROM_EMAIL",
      "AUTH_SESSION_SECRET",
    ],
    proofToSave: [
      "Sender domain or sender email is verified.",
      "A test sign-in email arrives.",
      "The sign-in link opens the deployed app.",
    ],
    safeCommand: "pnpm launch:email-setup",
  },
  {
    id: "admin-protection",
    title: "Protect admin-only launch tools",
    accountOrTool: "Render environment variables",
    whyItMatters:
      "Practice seat assignment and alert administration need private tokens before the app is public.",
    valuesToSetInRender: ["PRACTICE_SEAT_ADMIN_TOKEN", "ALERT_ADMIN_TOKEN"],
    proofToSave: [
      "Private tokens are generated and stored only in Render.",
      "Practice Seat Manager requires the private token.",
      "Alert admin tools require the private token.",
    ],
    safeCommand: "pnpm launch:secrets",
  },
  {
    id: "clinical-review",
    title: "Record Module 1 clinical review signoff",
    accountOrTool: "Clinical reviewer plus Render environment variables",
    whyItMatters:
      "Paid clinical education should not open until the reviewed content version is documented.",
    valuesToSetInRender: [
      "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      "MODULE_ONE_CLINICAL_REVIEW_DATE",
      "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
    ],
    proofToSave: [
      "Reviewer name and role.",
      "Review date.",
      "Approved content version.",
      "Corrections resolved before approval.",
    ],
    safeCommand: "pnpm launch:clinical-review",
  },
  {
    id: "live-purchase-proof",
    title: "Run one controlled live purchase",
    accountOrTool: "Stripe, Render, and the deployed app",
    whyItMatters:
      "The first real buyer should prove payment, webhook access, sign-in, and learning flow before broad outreach.",
    valuesToSetInRender: ["ENABLE_PAID_ENROLLMENT"],
    proofToSave: [
      "Live checkout completed with a low-risk internal buyer.",
      "Webhook created durable access.",
      "Passwordless sign-in worked.",
      "Learner could open protected course content.",
    ],
    safeCommand: "pnpm launch:live-purchase-test",
  },
];

function renderChecklist(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- [ ] ${item}`);
}

export function renderExternalSetupWorksheet(): string {
  return [
    "# OptiTech Academy External Setup Worksheet",
    "",
    "Use this on the home PC when you are setting up the outside accounts that make the app a real online store.",
    "",
    "Simple translation: the code is the course. These outside accounts are the building, cash register, email mailbox, and proof folder.",
    "",
    "Do not paste real Stripe keys, webhook secrets, email API keys, database passwords, generated admin tokens, session cookies, raw sign-in links, patient information, protected health information, private learner details, or private employer details into this worksheet.",
    "",
    "## Setup Steps",
    "",
    ...externalSetupSteps.flatMap(step => [
      `### ${step.title}`,
      "",
      `Account or tool: ${step.accountOrTool}`,
      "",
      step.whyItMatters,
      "",
      "Render values involved:",
      "",
      ...renderChecklist(
        step.valuesToSetInRender.map(value => `\`${value}\``),
        "No Render value required for this step."
      ),
      "",
      "Proof to save:",
      "",
      ...renderChecklist(step.proofToSave, "No separate proof required."),
      "",
      "Helpful command:",
      "",
      "```bash",
      step.safeCommand,
      "```",
      "",
    ]),
    "## Final Selling Rule",
    "",
    "Do not set `ENABLE_PAID_ENROLLMENT=true` until clinical review, Render hosting, hosted database setup, Stripe live checkout, Stripe webhook, passwordless email, admin tokens, deployment smoke test, and one controlled live purchase are proven.",
    "",
    "After deployment, use:",
    "",
    "```powershell",
    '$env:LAUNCH_BASE_URL=\"https://your-real-domain.example\"',
    "pnpm launch:go-no-go",
    "```",
    "",
  ].join("\n");
}
