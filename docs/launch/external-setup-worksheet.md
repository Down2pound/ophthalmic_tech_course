# OptiTech Academy External Setup Worksheet

Use this on the home PC when you are setting up the outside accounts that make
the app a real online store.

Simple translation: the code is the course. These outside accounts are the
building, cash register, email mailbox, and proof folder.

Do not paste real Stripe keys, webhook secrets, email API keys, database
passwords, generated admin tokens, session cookies, raw sign-in links, patient
information, protected health information, private learner details, or private
employer details into this worksheet.

## Setup Steps

### Push the latest source to GitHub

Account or tool: GitHub

Render deploys from GitHub, so the newest course store code has to be backed up
there before hosting.

Open first:

- [ ] `https://github.com/Down2pound/ophthalmic_tech_course/tree/codex/optitech-product-spec`
- [ ] `https://github.com/Down2pound/ophthalmic_tech_course/pull/10`

Render values involved:

- No Render value required for this step.

Proof to save:

- [ ] GitHub branch contains the latest launch work.
- [ ] GitHub shows the commit you plan to deploy.

Helpful command:

```bash
pnpm launch:post-0716-handoff
```

### Create the Render web service and database

Account or tool: Render

This puts the app online and gives it a managed PostgreSQL database for
purchases, sign-ins, progress, and practice seats.

Open first:

- [ ] `https://dashboard.render.com/`
- [ ] `docs/launch/render-deployment-guide.md`
- [ ] `docs/launch/online-start-guide.md`

Render values involved:

- [ ] `PUBLIC_APP_URL`
- [ ] `DATABASE_URL`
- [ ] `DATABASE_SSL`
- [ ] `ENABLE_PAID_ENROLLMENT`

Proof to save:

- [ ] Render deploy succeeded.
- [ ] `/api/health` responds from the live URL.
- [ ] `pnpm db:setup` ran against the hosted database.

Helpful command:

```bash
pnpm launch:render-setup
```

### Connect Stripe checkout and webhook

Account or tool: Stripe

Stripe is the cash register. Checkout collects payment, and the webhook tells
the app who should receive access.

Open first:

- [ ] `https://dashboard.stripe.com/test/dashboard`
- [ ] `https://dashboard.stripe.com/test/webhooks`
- [ ] `docs/launch/stripe-setup-guide.md`

Render values involved:

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

Proof to save:

- [ ] Webhook endpoint is set to `/api/stripe/webhook`.
- [ ] Webhook listens for `checkout.session.completed`.
- [ ] A Stripe test checkout creates access in the app.

Helpful command:

```bash
pnpm launch:stripe-products
```

### Connect passwordless sign-in email

Account or tool: Resend or another transactional email provider

Buyers need email to receive sign-in links and purchase welcome messages.

Open first:

- [ ] `https://resend.com/domains`
- [ ] `https://resend.com/api-keys`
- [ ] `docs/launch/email-setup-guide.md`

Render values involved:

- [ ] `TRANSACTIONAL_EMAIL_API_URL`
- [ ] `TRANSACTIONAL_EMAIL_API_KEY`
- [ ] `SIGN_IN_FROM_EMAIL`
- [ ] `AUTH_SESSION_SECRET`

Proof to save:

- [ ] Sender domain or sender email is verified.
- [ ] A test sign-in email arrives.
- [ ] The sign-in link opens the deployed app.

Helpful command:

```bash
pnpm launch:email-setup
```

### Protect admin-only launch tools

Account or tool: Render environment variables

Practice seat assignment and alert administration need private tokens before
the app is public.

Open first:

- [ ] `https://dashboard.render.com/`
- [ ] `docs/launch/production-env-checklist.md`
- [ ] `docs/launch/go-live-checklist.md`

Render values involved:

- [ ] `PRACTICE_SEAT_ADMIN_TOKEN`
- [ ] `ALERT_ADMIN_TOKEN`

Proof to save:

- [ ] Private tokens are generated and stored only in Render.
- [ ] Practice Seat Manager requires the private token.
- [ ] Alert admin tools require the private token.

Helpful command:

```bash
pnpm launch:secrets
```

### Record Module 1 clinical review signoff

Account or tool: Clinical reviewer plus Render environment variables

Paid clinical education should not open until the reviewed content version is
documented.

Open first:

- [ ] `docs/launch/module-1-clinical-review-packet.md`
- [ ] `docs/launch/clinical-review-guide.md`
- [ ] `docs/launch/clinical-review-request-template.md`
- [ ] `docs/launch/bootcamp-content-migration-checklist.md`

Render values involved:

- [ ] `MODULE_ONE_CLINICAL_REVIEWER_NAME`
- [ ] `MODULE_ONE_CLINICAL_REVIEWER_ROLE`
- [ ] `MODULE_ONE_CLINICAL_REVIEW_DATE`
- [ ] `MODULE_ONE_CLINICAL_APPROVED_VERSION`
- [ ] `MODULE_ONE_CLINICAL_REVIEW_APPROVED`

Proof to save:

- [ ] Reviewer name and role.
- [ ] Review date.
- [ ] Approved content version.
- [ ] Corrections resolved before approval.

Helpful command:

```bash
pnpm launch:clinical-review-request
```

### Run one controlled live purchase

Account or tool: Stripe, Render, and the deployed app

The first real buyer should prove payment, webhook access, sign-in, and
learning flow before broad outreach.

Open first:

- [ ] `https://dashboard.stripe.com/payments`
- [ ] `docs/launch/first-buyer-fulfillment-checklist.md`
- [ ] `docs/launch/revenue-and-sales-tracker-template.md`

Render values involved:

- [ ] `ENABLE_PAID_ENROLLMENT`

Proof to save:

- [ ] Live checkout completed with a low-risk internal buyer.
- [ ] Webhook created durable access.
- [ ] Passwordless sign-in worked.
- [ ] Learner could open protected course content.

Helpful command:

```bash
pnpm launch:live-purchase-test
```

## Final Selling Rule

Do not set `ENABLE_PAID_ENROLLMENT=true` until clinical review, Render hosting,
hosted database setup, Stripe live checkout, Stripe webhook, passwordless email,
admin tokens, deployment smoke test, and one controlled live purchase are
proven.

After deployment, use:

```powershell
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:go-no-go
```
