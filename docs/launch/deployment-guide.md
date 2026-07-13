# OptiTech Academy Deployment Guide

This is the beginner-friendly path for putting the app online. Think of the app
like a small store:

- The website is the storefront.
- Stripe is the cash register.
- PostgreSQL is the notebook that remembers who paid.
- Transactional email sends sign-in links.
- The launch checks are the door lock that keeps checkout closed until the
  store is actually ready.

## What You Need Before Going Live

1. A Node hosting account that can run `pnpm build` and `node dist/index.js`, or
   a container host that can build the included `Dockerfile`.
2. A managed PostgreSQL database.
3. A Stripe account with test mode working first.
4. A transactional email provider for passwordless sign-in links.
5. A real public domain or temporary public host URL using `https`.
6. A qualified clinical reviewer signoff for Module 1.

Do not turn on real paid checkout until every item above is working.

Use `docs/launch/clinical-review-guide.md` for the Module 1 review and signoff
recipe.

If you want the simplest hosted path, use Render with the included
`render.yaml` Blueprint and follow `docs/launch/render-deployment-guide.md`.
That Blueprint runs `pnpm db:setup` as a pre-deploy command so the launch
database tables are created before the service starts.

## Host Settings

Use these commands in the hosting dashboard:

```bash
pnpm install --frozen-lockfile
pnpm build
node dist/index.js
```

The service should expose the port from the host through `PORT`. The server
already reads `process.env.PORT`, so most Node hosts can supply the port
automatically.

The repository also includes a `Procfile`:

```text
web: node dist/index.js
```

Some Node hosts read that file automatically. It means, "start one web process
by running the built server."

If the host uses Docker, use the included `Dockerfile`. For the final production
image, pass the real public domain so the sitemap is generated correctly:

```bash
docker build --build-arg PUBLIC_APP_URL=https://your-domain.example --tag optitech-academy .
```

## Environment Variables To Add In The Host

Add these in the host dashboard, not in Git and not in Google Drive:

```text
PUBLIC_APP_URL=https://your-domain.example
ENABLE_PAID_ENROLLMENT=false
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=
DATABASE_SSL=true
AUTH_SESSION_SECRET=
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
PRACTICE_SEAT_ADMIN_TOKEN=
ALERT_ADMIN_TOKEN=
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
```

Generate strong values for the private session and admin secrets locally:

```bash
pnpm launch:secrets
```

Use a separate strong value for `ALERT_ADMIN_TOKEN` if the alert-button admin
tool is deployed with the public app. Without that value, the alert admin API
stays locked.

Keep `ENABLE_PAID_ENROLLMENT=false` while setting everything up. That is the
safety switch. It prevents the app from accepting payment too early.

## Database Setup

Use `docs/launch/database-setup-guide.md` as the detailed managed PostgreSQL
recipe.

After the managed PostgreSQL database exists and `DATABASE_URL` is set, run:

```bash
pnpm db:setup
```

Then open:

```text
https://your-domain.example/api/launch/readiness
```

The database gate is ready only when the report says the launch schema is
verified.

## Browser Safety Headers

The server adds basic browser safety headers to every response. After deploy,
confirm the live site response includes:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin`

The response should not include `X-Powered-By`.

## Public Endpoint Rate Limits

The app applies simple abuse protection to public form-style endpoints:

- Passwordless sign-in start: 5 requests per 15 minutes per client.
- Checkout session start: 10 requests per 15 minutes per client.
- Practice inquiry form: 5 requests per hour per client.

If one of these endpoints returns `429 Too Many Requests`, wait for the
`Retry-After` time before testing again.

The server trusts one hosting proxy hop so these limits use the client IP
reported by common managed hosts.

## Stripe Setup

Use `docs/launch/stripe-setup-guide.md` as the detailed Stripe recipe.

1. Start in Stripe test mode.
2. Add the server secret key as `STRIPE_SECRET_KEY`.
3. Create a webhook endpoint for:

```text
https://your-domain.example/api/stripe/webhook
```

4. Listen for `checkout.session.completed`.
5. Add the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Run test purchases for the individual learner and both practice packs.

If payment succeeds but access does not appear, check Stripe webhook delivery
before retrying. The app intentionally refuses webhook fulfillment until the
database is ready.

## Email Setup

Use `docs/launch/email-setup-guide.md` as the detailed passwordless email
recipe.

Set up a transactional email provider and add:

```text
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
```

Then test passwordless sign-in from the live site. A learner should request a
link, receive an email, click the link, and land on `/learn`.

## Final Live Checklist

Before changing `ENABLE_PAID_ENROLLMENT` to `true`, verify:

- `pnpm launch:preflight` passes locally or in CI.
- `pnpm db:setup` has run against the production database.
- `/api/health` returns `ok: true`.
- `/api/launch/readiness` has no missing launch-critical setup.
- Stripe test checkout creates durable access in PostgreSQL.
- Passwordless sign-in works on the deployed app.
- A learner can open Module 1 and submit the protected quiz.
- A practice pack can assign learner seats without exceeding capacity.
- Module 1 clinical review is approved and saved in environment variables.
- `LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke` confirms the deployed
  site loads before paid enrollment is turned on.
- `pnpm launch:smoke` passes against the deployed site after every paid launch
  gate is complete.

Only then set:

```text
ENABLE_PAID_ENROLLMENT=true
```

Redeploy or restart the app after changing that value, then run the smoke test
again.

## After The First Real Sale

Use the generated `launch-evidence/first-sale-support-runbook.md` if a buyer
needs help. It gives a safe checklist for payment, access, sign-in, practice
seat, and refund questions without saving secrets or private clinical details.
