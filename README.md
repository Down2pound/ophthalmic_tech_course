# OptiTech Academy Ophthalmic Technician Foundations

## Founding Course Overview

OptiTech Academy is a founding-course web app for ophthalmic technician
foundations. It is designed for career changers, medical assistants moving into
eye care, new ophthalmic technicians, and practices that need a consistent first
layer of onboarding before hands-on supervised training.

The current paid-launch path publishes Module 1 first, then uses the Bootcamp
source map to guide future releases as clinical review, accessibility review,
asset migration, and launch gates are completed.

Completion is educational. It is not certification, licensure, employment
verification, or proof of independent hands-on competency.

### Planned 10-Day Bootcamp Source Path

The repository preserves a 10-day Bootcamp source map with videos, PDFs, audio,
images, outcomes, review prompts, and clinic tasks. Those materials are source
content until they pass rights review, clinical review, accessibility review,
and public/practice-only classification.

- **Day 1**: Ophthalmic Fundamentals & Anatomy
- **Day 2**: Patient Assessment & History Taking
- **Day 3**: Diagnostic Equipment - Part 1 (Refraction)
- **Day 4**: Diagnostic Equipment - Part 2 (Imaging)
- **Day 5**: Clinical Procedures & Measurements
- **Day 6**: Anterior Segment Examination
- **Day 7**: Posterior Segment Examination
- **Day 8**: Surgical Assistance & Instrumentation
- **Day 9**: Practice Management & Patient Communication
- **Day 10**: Advanced Topics & Certification Preparation

### Features

- Published Module 1 foundations lessons with protected learner access.
- Planned 10-day Bootcamp source path for future reviewed releases.
- Stripe-hosted checkout for individual learner and practice-pack purchases.
- Practice pack purchase and protected seat-assignment workflow.
- Passwordless sign-in for learners using the checkout email.
- Module progress, protected quiz flow, and certificate eligibility checks.
- Launch readiness gates for Stripe, email, PostgreSQL, clinical review, and paid enrollment.
- Launch handoff bundle for Google Drive, clinical review, QA, support, and first-buyer operations.

**Built with TypeScript, Vite, and modern web technologies.**

---

## Owner Quick Commands

Use these when resuming from the work computer or getting ready for first
revenue.

```bash
pnpm launch:post-0716-handoff
pnpm launch:first-revenue
pnpm launch:bootcamp-intake
pnpm launch:blockers
```

- `launch:post-0716-handoff` explains what changed after the latest completed
  `07/16/2026` backup and what to commit when Git is available.
- `launch:first-revenue` prints the shortest safe path from restored code to
  one controlled paid buyer.
- `launch:bootcamp-intake` prints the new Bootcamp Drive files that need review
  before becoming paid course content.
- `launch:blockers` prints the setup areas still preventing paid launch.

Keep the `07/16/2026` backup label tied to commit `2efefd0` unless a new backup
is intentionally created.

---

## Project Structure

```
├── client/          # Frontend application
├── server/          # Backend API
├── shared/          # Shared utilities and types
├── patches/         # Dependency patches
└── config files     # Build and formatting configuration
```

## Getting Started

See individual README files in `client/`, `server/`, and `shared/` directories for setup instructions.

## Stripe Checkout Setup

The app uses Stripe-hosted Checkout for founding learner and practice-pack
purchases. That means learners and managers enter card details on Stripe's
secure page, not inside this app.

Required environment variables:

```text
STRIPE_SECRET_KEY=sk_test_replace_with_your_secret_key
PUBLIC_APP_URL=http://localhost:3000
ENABLE_PAID_ENROLLMENT=false
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
DATABASE_URL=replace_with_managed_postgres_connection_string
DATABASE_SSL=true
STRIPE_WEBHOOK_SECRET=whsec_replace_with_your_webhook_signing_secret
AUTH_SESSION_SECRET=replace_with_a_long_random_session_secret
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=replace_with_your_email_provider_api_key
SIGN_IN_FROM_EMAIL="OptiTech Academy <noreply@example.com>"
PRACTICE_SEAT_ADMIN_TOKEN=replace_with_a_long_random_admin_token
ALERT_ADMIN_TOKEN=replace_with_a_long_random_alert_admin_token
```

`PUBLIC_APP_URL` should be the real deployed site URL in production. The server
uses it to build the success and cancel return links after Stripe checkout.

Use `.env.example` as the safe template for local setup. Copy it to `.env`, then
paste real local/test values into `.env`. The `.env` file is ignored by Git so
real secrets do not get committed.

Stripe key guide:

- `pk_test_...` is a publishable test key. It is safe to expose to the browser,
  but the current hosted Checkout flow does not require it.
- `sk_test_...` is a secret test key. It must stay server-only in `.env`.
- `whsec_...` is the webhook signing secret. It must stay server-only in `.env`.
- `ENABLE_PAID_ENROLLMENT` is the final paid-launch switch. Keep it `false`
  until clinical review, database setup, Stripe webhook testing, and deployed
  smoke testing are complete. Set it to `true` only when you are ready to accept
  real paid enrollment.
- `MODULE_ONE_CLINICAL_REVIEWER_NAME`,
  `MODULE_ONE_CLINICAL_REVIEWER_ROLE`, `MODULE_ONE_CLINICAL_REVIEW_DATE`,
  `MODULE_ONE_CLINICAL_APPROVED_VERSION`, and
  `MODULE_ONE_CLINICAL_REVIEW_APPROVED` record Module 1 signoff after a
  qualified reviewer approves the clinical review packet. Keep
  `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until corrections are resolved.
- `AUTH_SESSION_SECRET`, `TRANSACTIONAL_EMAIL_API_URL`,
  `TRANSACTIONAL_EMAIL_API_KEY`, and `SIGN_IN_FROM_EMAIL` are server-only values
  for passwordless sign-in email delivery.
- For the simplest production email path, use Resend with
  `TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails`, a Resend API key
  that starts with `re_`, and a verified sender address.
- `PRACTICE_SEAT_ADMIN_TOKEN` is a server-only private token used to protect the
  temporary practice-seat assignment API until a full admin login exists.
- `ALERT_ADMIN_TOKEN` is a server-only private token used to protect the
  temporary alert-button admin API if the alert tool is deployed with the app.
- `DATABASE_URL` points the server at managed PostgreSQL so purchases,
  enrollments, practice seat packs, assignments, sign-in sessions, and quiz
  attempts survive restarts.
- `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` are optional
  browser analytics values. If either is missing, the app does not inject the
  analytics script.
- The launch readiness check treats copied placeholders as missing. Values such
  as `replace_with...`, `...example.com`, and `PUBLIC_APP_URL=http://localhost`
  are fine in examples, but they will not unlock paid checkout.
- Launch-critical values must also look production-ready: public and email API
  URLs must use `https`, `DATABASE_URL` must be PostgreSQL, Stripe server values
  must use the expected `sk_test_` or `sk_live_` and `whsec_` prefixes, and
  private session/admin secrets must be at least 32 characters long.
- Stripe test keys are useful for practice purchases, but final paid readiness
  requires a live `sk_live_...` secret key.

Generate strong local values for the private session/admin secrets with:

```bash
pnpm launch:secrets
```

Paste the generated `AUTH_SESSION_SECRET`, `PRACTICE_SEAT_ADMIN_TOKEN`, and
`ALERT_ADMIN_TOKEN` into the production host dashboard. Do not commit them, save
them in Google Drive, or send them in chat.

Checkout routes:

- Frontend page: `/checkout`
- Practice packs page: `/practice-packs`
- Practice seat manager page: `/practice-seat-admin`
- Policies page: `/policies`
- Server endpoint: `POST /api/checkout/sessions`
- Passwordless sign-in request endpoint: `POST /api/auth/passwordless/start`
- Passwordless callback endpoint: `GET /api/auth/callback?token=...`
- Current learner access endpoint: `GET /api/auth/session`
- Protected lesson endpoint: `GET /api/learn/module-one/lessons`
- Protected lesson progress endpoint: `GET /api/learn/module-one/progress`
- Protected lesson completion endpoint:
  `POST /api/learn/module-one/lessons/:lessonId/complete`
- Protected certificate eligibility endpoint:
  `GET /api/learn/module-one/certificate/eligibility`
- Protected quiz endpoint: `GET /api/learn/module-one/quiz`
- Protected quiz submission endpoint: `POST /api/learn/module-one/quiz/submit`
- Protected practice seat assignment endpoint:
  `POST /api/practice-seat-packs/:seatPackId/assignments`
- Protected practice seat pack list endpoint: `GET /api/practice-seat-packs`
- Protected buyer support lookup endpoint:
  `GET /api/support/buyer-lookup?email=buyer@example.com`
- Protected access revocation endpoint for refunds or support corrections:
  `POST /api/support/access-revocations`
- Custom practice inquiry capture endpoint: `POST /api/practice-inquiries`
- Protected practice inquiry list endpoint:
  `GET /api/support/practice-inquiries`
- Health check endpoint: `GET /api/health`
- Runtime launch check: `GET /api/launch/readiness`
- Public checkout availability check: `GET /api/checkout/availability`
- Clinical review packet export:
  `GET /api/launch/clinical-review-packet.md`
- Success return: `/learn?checkout=success&offer=...`
- Cancel return: `/checkout?checkout=cancelled`

`POST /api/checkout/sessions` accepts an optional `offerId`. If no `offerId`
is sent, it uses the founding learner offer. Practice pack offer IDs are also
accepted and sent to Stripe with seat-count metadata for fulfillment.

When Stripe confirms payment, individual purchases provision one learner
enrollment. Practice pack purchases provision one seat-pack record with the
purchased seat count. Core practice-seat assignment logic can assign learner
emails without exceeding purchased capacity. The webhook fails closed unless
`DATABASE_URL` is configured and the launch database schema is verified, so paid
access is not acknowledged into temporary in-memory storage.

The temporary practice-seat assignment endpoint requires an `x-admin-token`
header matching `PRACTICE_SEAT_ADMIN_TOKEN`. The protected list endpoint uses
the same header and returns current temporary seat packs plus assignments. These
endpoints are used by the protected practice seat manager page and should only
be used by a trusted manager/admin workflow.

The temporary alert-button admin endpoint also requires an `x-admin-token`
header matching `ALERT_ADMIN_TOKEN`. If that token is not configured, the alert
admin API stays locked.

If `STRIPE_SECRET_KEY` is missing, `ENABLE_PAID_ENROLLMENT` is not `true`, the
Stripe webhook is not configured, passwordless sign-in is not configured,
practice-seat administration is not configured, Module 1 clinical signoff is
not approved, or the launch database schema is not verified, checkout fails
closed with a setup message and does not collect payment.

`GET /api/launch/readiness` returns a safe setup report with launch blocker
counts and missing environment variable names. It must never return actual
Stripe key values. It also includes the ordered launch action plan and Module 1
clinical review packet so reviewers can see exactly what still needs signoff.
When the Module 1 clinical signoff environment values are present and
`MODULE_ONE_CLINICAL_REVIEW_APPROVED=true`, the clinical review launch gate is
marked ready in the runtime report. When `DATABASE_URL` is configured, the same
endpoint checks that the required launch database tables exist before paid
launch can be marked ready.

`GET /api/launch/clinical-review-packet.md` downloads a Markdown packet with
Module 1 lesson bodies, scope notes, sources, review questions, and signoff
fields. Use it to collect clinical review before turning on paid enrollment.

`GET /api/health` returns a small safe uptime report for deployment health
checks. It does not return secret values.

`GET /api/checkout/availability` returns a safe buyer-facing status that tells
the checkout and practice-pack pages whether enrollment is open or paused. It
does not expose secret values or internal setup details.

`POST /api/auth/passwordless/start` prepares a magic-link sign-in request and
stores the hashed magic-link record server-side while returning only a generic
safe message. It does not return raw tokens, token hashes, or callback URLs.
It sends the sign-in link through the configured transactional email endpoint.
When `DATABASE_URL` is configured, magic links and sessions are stored in
PostgreSQL.

`GET /api/auth/callback?token=...` consumes a valid one-time magic link, stores
a hashed session server-side, sets an HTTP-only session cookie, and redirects to
`/learn`. Expired, missing, or already used links return a safe invalid-link
message.

`GET /api/auth/session` reads the HTTP-only session cookie, verifies the hashed
server-side session, and reports whether the signed-in learner has an active
enrollment. It does not trust browser-provided email addresses.

`GET /api/learn/module-one/lessons` returns paid Module 1 lesson bodies only
after the session cookie maps to an active server-side enrollment. The learner
dashboard uses this endpoint instead of importing paid lesson bodies directly
into the browser bundle.

`GET /api/learn/module-one/progress` returns durable Module 1 lesson completion
progress for the signed-in learner. `POST
/api/learn/module-one/lessons/:lessonId/complete` records a protected lesson
completion server-side after the same session and enrollment check.

`GET /api/learn/module-one/certificate/eligibility` checks durable lesson
completion and server-scored quiz progress before marking a learner eligible for
the certificate language. The certificate still clearly says it is completion,
not certification, licensure, employment verification, or proof of independent
hands-on competency.

`GET /api/learn/module-one/quiz` returns Module 1 knowledge-check questions
without the answer key. `POST /api/learn/module-one/quiz/submit` scores learner
answers on the server after the same session and enrollment check, records the
attempt server-side, and returns quiz progress.

Run the launch database setup after `DATABASE_URL` points to the managed
PostgreSQL database:

```bash
pnpm db:setup
```

The command creates the commerce, auth, and assessment tables with safe
`CREATE TABLE IF NOT EXISTS` statements. It does not print secret values.

## Deployment

The app can be deployed as one Node/Express service that serves both the React
frontend and the API.

Use `docs/launch/deployment-guide.md` as the beginner-friendly setup path and
`docs/launch/production-launch-package.md` as the shareable launch handoff
checklist before opening paid enrollment.
Use `render.yaml` with `docs/launch/render-deployment-guide.md` for the Render
Blueprint path.
Use `docs/launch/stripe-setup-guide.md` for the Stripe checkout and webhook
setup steps.
Use `docs/launch/email-setup-guide.md` for passwordless sign-in email setup.
Use `docs/launch/database-setup-guide.md` for managed PostgreSQL setup.
Use `docs/launch/clinical-review-guide.md` for Module 1 clinical signoff.
Use `docs/launch/go-live-checklist.md` as the final launch-day sequence.

```bash
pnpm build
```

The production start command is:

```bash
node dist/index.js
```

The included `Procfile` exposes the same start command for Node hosts that read
process files automatically:

```text
web: node dist/index.js
```

For container hosts, use the included `Dockerfile`. The image includes a
container health check against `/api/health`, and `.dockerignore` keeps local
env files, build outputs, dependencies, logs, databases, and generated launch
evidence out of the Docker build context. Configure these environment variables
in the host dashboard, not in Git: `DATABASE_URL`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_APP_URL`,
`AUTH_SESSION_SECRET`, `TRANSACTIONAL_EMAIL_API_URL`,
`TRANSACTIONAL_EMAIL_API_KEY`, `SIGN_IN_FROM_EMAIL`, and
`PRACTICE_SEAT_ADMIN_TOKEN`. If the alert admin tool is deployed, also configure
`ALERT_ADMIN_TOKEN`. Add the `MODULE_ONE_CLINICAL_*` signoff values after the
review packet is approved. Keep `ENABLE_PAID_ENROLLMENT=false` until the live
checklist passes, then set `ENABLE_PAID_ENROLLMENT=true` to open paid checkout.
Do not leave copied `.env.example` placeholders in production; the launch doctor
will count those values as missing.

To include `sitemap.xml` in a production Docker image, pass the final public
domain at build time:

```bash
docker build --build-arg PUBLIC_APP_URL=https://your-deployed-site.example.com --tag optitech-academy .
```

After the managed PostgreSQL database is created and `DATABASE_URL` is set, run:

```bash
pnpm db:setup
```

Then verify:

- `GET /api/health` returns `ok: true`.
- `GET /api/launch/readiness` shows no missing environment variables and
  reports the launch database schema as verified.
- `GET /api/checkout/availability` returns the expected open or paused buyer
  status.
- Stripe test checkout creates a durable enrollment through the webhook.
- A learner can sign in, open Module 1, and submit the protected quiz.

GitHub Actions runs launch CI on pushes and pull requests:

- `pnpm launch:preflight`, which runs type-checking, tests, production build,
  and launch bundle generation.
- `pnpm launch:secrets`
- `pnpm launch:doctor`
- `PUBLIC_APP_URL=https://academy.spindeleye.test pnpm launch:sitemap`
- `docker build`

The workflow uploads the generated `launch-evidence/` folder as a short-lived
artifact, so reviewers can download the launch packet without exposing secrets.

You can also run the deployment smoke test from your local machine after the
app is online but before paid launch is fully ready:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

To save a Markdown smoke-test report with your launch records:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-deployed-site.example.com LAUNCH_SMOKE_REPORT_PATH=launch-evidence/deployment-smoke-report.md pnpm launch:smoke
```

To also submit one safe custom-practice test inquiry and prove lead capture
works after deployment:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

The smoke test checks `/api/health`, `/api/launch/readiness`,
`/api/checkout/availability`, browser safety headers, `/robots.txt`, and the
public buyer pages for home, checkout, individual checkout return states,
practice packs, practice checkout return states, policies, curriculum, and
onboarding.
When `LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true`, it also posts a clearly labeled
safe test inquiry through `/api/practice-inquiries`.
With `LAUNCH_SMOKE_ALLOW_NOT_READY=true`, it can pass while
`readyForPaidLaunch` is still `false`, as long as health, checkout
availability, public pages, safety headers, and robots rules pass.
For the final go-live check, run the command without
`LAUNCH_SMOKE_ALLOW_NOT_READY=true`; then it exits with an error until the live
app reports that paid launch readiness is complete and those public pages
respond successfully. When it fails, it prints the first launch actions to
handle next.

Run the launch doctor before and after production setup:

```bash
pnpm launch:doctor
```

The doctor prints a plain-English paid-launch preflight report using the same
readiness gates as the app. It lists missing variable names and next actions,
but not secret values.

Generate the production sitemap after `PUBLIC_APP_URL` is set to the real
deployed `https` domain:

```bash
PUBLIC_APP_URL=https://your-deployed-site.example.com pnpm launch:sitemap
```

The command writes `dist/public/sitemap.xml` by default. It refuses placeholder,
localhost, or non-https URLs so search engines do not receive a fake sitemap.

Create a local handoff folder for Google Drive with safe launch artifacts:

```bash
pnpm launch:bundle
```

Or run the full local preflight before a launch candidate:

```bash
pnpm launch:preflight
```

The generated `launch-evidence/` folder is ignored by Git and should not
contain `.env`, live secrets, raw tokens, cookies, database passwords, or Stripe
secret keys. It includes the production launch package, clinical review packet,
production environment checklist, launch doctor report, manual launch QA
evidence template, and runtime readiness snapshot.

## Database Contracts

The first production release needs managed PostgreSQL before paid access can be
durable. Current schema contracts live in:

- `server/src/commerce/commerceSchema.ts` for purchases and enrollments.
- `server/src/commerce/postgresCommerceStore.ts` for PostgreSQL-backed
  purchase, enrollment, practice seat pack, and assignment repositories.
- `server/src/commerce/practiceSeatPackStore.ts` for the shared practice pack
  seat tracking and assignment interface, including the local in-memory fallback.
- `server/src/commerce/practiceInquiryStore.ts` for larger-practice lead
  capture, durable inquiry storage, and internal notification emails.
- `server/src/auth/authSchema.ts` for passwordless users, magic-link tokens,
  and sessions.
- `server/src/auth/postgresAuthStore.ts` for PostgreSQL-backed magic-link and
  session repositories.
- `server/src/auth/magicLinkToken.ts` for creating raw email tokens while
  storing only SHA-256 token hashes.
- `server/src/auth/magicLinkEmail.ts` for sending magic-link emails through a
  configured transactional email endpoint.
- `server/src/auth/magicLinkStore.ts` for the current swappable magic-link
  storage interface and local in-memory implementation.
- `server/src/auth/consumeMagicLink.ts` and `server/src/auth/sessionStore.ts`
  for one-time magic-link consumption and hashed session storage.
- `server/src/auth/sessionAccess.ts` for checking a signed-in learner session
  against active server-side enrollments.
- `server/src/course/protectedLessons.ts` for serving paid lesson content only
  after server-side access approval.
- `server/src/certificate/completionEligibility.ts` for server-side certificate
  eligibility using durable lesson and quiz progress.
- `server/src/progress/learningSchema.ts` for durable lesson completion tables.
- `server/src/progress/postgresLessonProgressStore.ts` for PostgreSQL-backed
  lesson completion and module progress repositories.
- `server/src/assessments/moduleOneKnowledgeCheck.ts` for Module 1
  server-side quiz delivery and scoring without exposing answer keys.
- `server/src/assessments/assessmentAttemptStore.ts` for recording server-side
  quiz attempts and learner quiz progress.
- `server/src/assessments/postgresAssessmentAttemptStore.ts` for
  PostgreSQL-backed quiz attempt and question-result repositories.
- `server/src/assessments/assessmentSchema.ts` for the PostgreSQL-ready
  assessment attempt and question-result tables.
- `server/src/db/setupLaunchDatabase.ts` for applying the commerce, auth, and
  assessment schemas with one setup command.
- `server/src/auth/passwordlessSignIn.ts` for building a sign-in request record
  and email payload without storing the raw email token.
- `server/src/routes/auth.ts` for the safe passwordless sign-in request route.

These files are schema contracts plus repository wiring. Run `pnpm db:setup`
against managed PostgreSQL, configure the same `DATABASE_URL` in production,
and verify the deployed purchase-to-sign-in-to-quiz flow before selling durable
learner access.
