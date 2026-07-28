# OptiTech Academy First Render Deploy Evidence

Use this card when opening Render for the first hosted deploy.

Simple translation: this is the receipt that says the code was checked before
you put the store online. It also tells you what to check after Render gives
you the public website link.

Do not paste `.env`, Stripe secret keys, webhook secrets, email API keys,
database passwords, raw sign-in links, session cookies, card numbers, patient
information, protected health information, or private learner details into this
file.

## Preflight Proof

- Branch: `codex/optitech-product-spec`
- Commit checked: `9b3a89e`
- Preflight date: `2026-07-28`
- Command: `pnpm launch:preflight`
- TypeScript check: passed
- Test suite: `99` files passed, `377` tests passed
- Secret scan: passed, no likely live secrets found
- Offer audit: passed, `35/35`
- Deployment audit: passed, `23/23`
- Production build: passed
- Launch evidence bundle: regenerated

## Render Deploy Link

Use the branch-specific deploy link so Render opens the correct copy:

```text
https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FDown2pound%2Fophthalmic_tech_course%2Ftree%2Fcodex%2Foptitech-product-spec
```

## First Deploy Safety Settings

Keep these values closed for the first hosted deploy:

```text
ENABLE_PAID_ENROLLMENT=false
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
```

Beginner translation: put the website online first, but keep the cash register
locked until clinical review, Stripe, email, database, and live-purchase proof
are finished.

## After Render Gives You A URL

Write the public URL here:

```text
PUBLIC_APP_URL=
```

Then check these pages in the browser:

```text
https://your-real-domain.example/api/health
https://your-real-domain.example/api/launch/readiness
https://your-real-domain.example/api/checkout/availability
https://your-real-domain.example/first-sale
https://your-real-domain.example/preview
https://your-real-domain.example/practice-packs
```

## First Smoke Test

Run this while paid enrollment is still closed. It also saves a Markdown smoke
report in `launch-evidence/first-render-smoke-report.md`:

```powershell
$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
$env:LAUNCH_SMOKE_REPORT_PATH="launch-evidence/first-render-smoke-report.md"
pnpm launch:smoke
```

Expected result: the deployed site and public buyer pages load, but paid launch
readiness can still say `not ready`.

After it passes, save `launch-evidence/first-render-smoke-report.md` with the
rest of the launch evidence backup.

## Before Taking Real Money

Do not set `ENABLE_PAID_ENROLLMENT=true` until all of these are true:

- Module 1 clinical review is approved and recorded.
- Render PostgreSQL is connected and `pnpm db:setup` has run.
- Stripe live checkout and webhook are configured.
- Passwordless email is configured and tested.
- Practice-seat and alert admin tokens are set.
- `/api/launch/readiness` reports `readyForPaidLaunch: true`.
- Final smoke test passes without `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.
- One low-risk internal live purchase works end to end.
