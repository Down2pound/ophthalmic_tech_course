# OptiTech Academy Launch Control Checklist

Use this as the first page to open on `jeffmini` before trying to put the app
online. The other launch guides still matter, but this page tells you what order
to do things in.

Simple translation: this is the cockpit checklist. Do one row, prove it worked,
then move to the next row.

## Current Backup Sources

- GitHub repo: `https://github.com/Down2pound/ophthalmic_tech_course`
- Working branch: `codex/optitech-product-spec`
- Draft PR: `https://github.com/Down2pound/ophthalmic_tech_course/pull/10`
- Google Drive backup folder: `Course backup1`
- Drive folder URL:
  `https://drive.google.com/drive/folders/1pA_fNKEMLKnCmhn6tkM7VLrEj7fgX97T`

Use GitHub first. If GitHub is blocked, use the newest matching ZIP and bundle
pair from Google Drive:

```text
optitech-academy-source-YYYY-MM-DD-COMMIT.zip
optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle
```

The exact latest known backup names and Drive links are in:

```text
docs/launch/current-backup-manifest.md
```

## Money-Ready Gates

| Gate | What Done Looks Like | First Command Or Guide |
| --- | --- | --- |
| Code restored | Latest branch opens on `jeffmini` | `pnpm launch:jeffmini` |
| Local app proof | TypeScript, tests, secret scan, build, and bundle pass | `pnpm launch:preflight` |
| Clinical signoff | Module 1 reviewer approves the packet and env fields are filled | `pnpm launch:clinical-review` |
| Hosting | Public HTTPS site is deployed and health endpoint works | `pnpm launch:render-setup` |
| Database | Managed PostgreSQL exists and tables are verified | `pnpm launch:database-setup` then `pnpm db:setup` |
| Email | Passwordless sign-in email sends successfully | `pnpm launch:email-setup` |
| Offer audit | Public prices, checkout prices, and Stripe setup notes agree | `pnpm launch:offer-audit` |
| Stripe | Live products, checkout, and webhook are configured | `pnpm launch:stripe-products` |
| Admin safety | Practice seat and alert admin tokens are set | `pnpm launch:admin-tokens` |
| Owner traffic light | Preview, practice inquiry, and paid checkout sharing decisions are clear | `pnpm launch:owner-go-no-go` |
| Smoke test | Live site passes deployment checks | `pnpm launch:smoke` |
| First live purchase | One low-risk internal buyer pays and receives access | `pnpm launch:live-purchase-test` |

Do not turn on broad paid enrollment until every row is proven.

## Home PC Command Order

Run from the project folder:

```bash
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm launch:offer-audit
pnpm build
pnpm launch:bundle
pnpm launch:blockers
```

If all of that passes, run:

```bash
pnpm launch:preflight
```

On this work computer, where Vite/Vitest/tsx commands may be blocked, run:

```bash
pnpm launch:work-safe-preflight
```

## Outside Account Setup Order

These steps happen in outside websites like Render, Stripe, your email provider,
and GitHub. Do not paste secret values into GitHub, Google Drive, Codex, or
plain notes.

1. Run `pnpm launch:env-template`.
2. Run `pnpm launch:secrets` and put the generated values only in the host
   dashboard.
3. Run `pnpm launch:render-setup` and deploy with `ENABLE_PAID_ENROLLMENT=false`.
4. Run `pnpm launch:database-setup`, set `DATABASE_URL`, then run `pnpm db:setup`.
5. Run `pnpm launch:email-setup` and test passwordless sign-in.
6. Run `pnpm launch:stripe-products` and configure the webhook.
7. Run `pnpm launch:clinical-review` and record approved reviewer fields only
   after signoff is complete.

## First Deployed Checks

Replace the example domain with the real site URL.

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:sitemap
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:owner-go-no-go
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:go-no-go
```

This is allowed to show paid launch is not ready while setup is still being
finished. That means the website can be online for private review before it can
take real money.

## Final Paid Launch Checks

Only after all gates are complete:

```bash
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
pnpm launch:live-purchase-test
```

Then complete one internal live purchase before sharing checkout links broadly.

## First Buyer Work

After the live site is proven:

```bash
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:first-sales
pnpm launch:first-week-sales
pnpm launch:first-10-customers
pnpm launch:sales-tracker
```

Start with 10 warm conversations. Sell carefully, learn from feedback, and keep
the promise honest: foundational ophthalmic education plus onboarding support,
not certification or hands-on competency proof.

## Stop Rule

If the same command fails with the same error 3 times on the work computer, stop
there and move to `jeffmini`.

Write down:

- The command that failed.
- The exact error.
- What already passed.
- The next home-PC command.

Known work-computer blocks include `spawn EPERM`, missing `git`, and
`git: 'remote-https' is not a git command`.

## Never Save These In Backups

Do not save `.env`, Stripe secret keys, webhook secrets, database passwords,
email API keys, generated admin/session tokens, raw sign-in links, session
cookies, card numbers, patient information, or private learner details to
GitHub or Google Drive.
