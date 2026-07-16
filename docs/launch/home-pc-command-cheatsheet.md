# OptiTech Academy Home PC Command Cheat Sheet

Use this as the short version of the home PC runbook. Run the commands from the
project folder after cloning or opening the repo.

Beginner translation: this is the recipe card. The longer runbook explains why
each step matters.

## 1. Get The Latest Code

If the latest work was pushed to GitHub, use:

```bash
git clone https://github.com/Down2pound/ophthalmic_tech_course.git
cd ophthalmic_tech_course
```

If the repo is already on the home PC:

```bash
git pull
```

If the latest work is only saved as a Google Drive source-code ZIP, download the
ZIP, extract it to a simple folder like this, then open PowerShell in that
folder:

```text
C:\dev\ophthalmic_tech_course
```

Beginner translation: GitHub is best once everything has been pushed. The Drive
ZIP is the backup copy you can use right away from home.

If you brought home the Git bundle instead, put the newest `.bundle` file in
`C:\dev`, open PowerShell there, and run:

```bash
git clone optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle ophthalmic_tech_course --branch codex/optitech-product-spec
cd ophthalmic_tech_course
git remote set-url origin https://github.com/Down2pound/ophthalmic_tech_course.git
git push -u origin codex/optitech-product-spec
```

## 2. Install The App Helpers

```bash
pnpm install
```

## 3. Run Local Safety Checks

Run each command by itself first, so errors are easier to understand:

```bash
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
pnpm launch:bundle
```

After those pass once, this one command runs the same main checks:

```bash
pnpm launch:preflight
```

`launch:secret-scan` checks the project for likely private keys or passwords
without printing the secret values.

## 4. Check Production Setup Files

```bash
pnpm launch:blockers
pnpm launch:clinical-review
pnpm launch:env-template
pnpm launch:secrets
pnpm launch:doctor
```

`launch:blockers` is the simplest work-safe summary of what still prevents
paid sales.
`launch:clinical-review` prints the Module 1 review checklist and approval
fields.
`launch:env-template` prints the safe host settings block for Render or another
production host.
`launch:secrets` makes a safe checklist of missing production settings.
`launch:doctor` explains what is still blocking paid enrollment.

## 5. Set Up The Production Database

Only run this after `DATABASE_URL` points to the real managed PostgreSQL
database:

```bash
pnpm db:setup
```

## 6. Test The Deployed Site Before Paid Enrollment

Replace the example URL with your real deployed domain:

```powershell
$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:smoke
$env:PUBLIC_APP_URL="https://your-real-domain.example"
pnpm launch:sitemap
pnpm launch:first-sales
```

This early smoke test is allowed to pass while paid launch readiness is still
`false`. That is useful before Stripe live mode, email, database, and clinical
signoff are all finished. It still checks that the live pages load, browser
safety headers are present, and `/robots.txt` blocks private/admin-style paths.
`launch:first-sales` prints the buyer links and short outreach messages using
your real domain.

## 7. Run The Final Go-Live Smoke Test

Use this only after all launch gates are complete and paid enrollment should be
ready:

```powershell
Remove-Item Env:\LAUNCH_SMOKE_ALLOW_NOT_READY -ErrorAction SilentlyContinue
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:smoke
```

This final version does not use `LAUNCH_SMOKE_ALLOW_NOT_READY=true`, so it
should fail if the app is not actually ready for paid buyers.

## If The Work Computer Blocks You

If you see `spawn EPERM`, permission errors, or admin/security popups, the code
may be fine. It usually means the computer blocked a helper program from opening.
Move to the home PC and start again from step 1.

Do not copy `.env` files, live Stripe secret keys, email API keys, database
passwords, session cookies, raw sign-in links, or private learner data.
