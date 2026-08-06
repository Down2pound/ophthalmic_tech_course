# OptiTech Academy Online Start Guide

Use this on `jeffmini` when you are ready to move from saved code to a real
hosted course site.

Simple translation: this is the first-hour checklist. It gets the course online
with payments still locked until the safety checks pass.

## 1. Start From The Latest Saved Copy

Use GitHub first:

```bash
git clone https://github.com/Down2pound/ophthalmic_tech_course.git
cd ophthalmic_tech_course
git checkout codex/optitech-product-spec
pnpm install
pnpm launch:preflight
```

If GitHub is blocked, use the newest matching ZIP and bundle pair from the
Google Drive backup folder:

```text
https://drive.google.com/drive/folders/1pA_fNKEMLKnCmhn6tkM7VLrEj7fgX97T
```

The ZIP and bundle should have the same date and short commit hash.

## 2. Keep Checkout Closed For The First Deploy

Set these first in the host dashboard:

```text
ENABLE_PAID_ENROLLMENT=false
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
```

Beginner translation: put the store online with the cash register turned off
first. Then test the building, the doors, and the signs before taking money.

## 3. Print The Setup Pack

Run these commands on the home PC:

```bash
pnpm launch:blockers
pnpm launch:env-template
pnpm launch:dashboard-proof
pnpm launch:first-render-deploy
pnpm launch:render-setup
pnpm launch:database-setup
pnpm launch:email-setup
pnpm launch:stripe-products
pnpm launch:admin-tokens
pnpm launch:clinical-review
```

Fill real private values only inside the production host dashboard or a trusted
password manager.

## 4. Deploy The Closed Store

1. Open Render or your chosen host.
2. Use the branch-specific Render deploy link:
   `https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FDown2pound%2Fophthalmic_tech_course%2Ftree%2Fcodex%2Foptitech-product-spec`
3. Review the Blueprint or web service from the GitHub repo.
4. Let the host read `render.yaml`.
5. Add the required environment values from `pnpm launch:env-template`.
6. After values are set, run `pnpm launch:dashboard-proof` from a trusted
   shell that has the same values loaded. It checks shapes without printing
   secrets.
7. Deploy with paid enrollment still closed.
8. Set `PUBLIC_APP_URL` to the real `https` URL after the first deploy.

## 5. Check The Live Site Before Money

Replace the example domain with the real domain:

```powershell
$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:smoke

$env:LAUNCH_LIVE_URL_REPORT_PATH="launch-evidence/live-url-command-card.md"
pnpm launch:live-url

$env:PUBLIC_APP_URL="https://your-real-domain.example"
pnpm launch:sitemap
pnpm launch:source-audit
pnpm launch:dashboard-proof
pnpm launch:first-sales
pnpm launch:owner-go-no-go
pnpm launch:first-buyer
pnpm launch:fulfillment
```

Also open these URLs in a browser:

```text
https://your-real-domain.example/api/health
https://your-real-domain.example/api/launch/readiness
https://your-real-domain.example/api/checkout/availability
https://your-real-domain.example/first-sale
https://your-real-domain.example/checkout
https://your-real-domain.example/practice-packs
```

## 6. Open Paid Enrollment Only After Proof

Do not set `ENABLE_PAID_ENROLLMENT=true` until:

- Module 1 clinical review is approved and recorded.
- PostgreSQL is connected and `pnpm db:setup` has run in production.
- Stripe checkout and webhook work in test mode.
- Passwordless email sends sign-in links.
- Practice-seat and alert admin tokens are set.
- Browser and mobile smoke checks pass.
- One low-risk internal live-mode purchase works end to end.

Final commands before public sales:

```powershell
Remove-Item Env:\LAUNCH_SMOKE_ALLOW_NOT_READY -ErrorAction SilentlyContinue
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:smoke
pnpm launch:dashboard-proof -- --paid
pnpm launch:live-purchase-test
pnpm launch:fulfillment
pnpm launch:first-10-customers
```

If any final check fails, set `ENABLE_PAID_ENROLLMENT=false` before debugging.

## Safety Rule

Do not paste `.env`, Stripe keys, webhook secrets, email API keys, database
passwords, generated session secrets, raw sign-in links, session cookies, card
numbers, patient information, protected health information, or private learner
details into GitHub, Google Drive, Codex, screenshots, or notes.
