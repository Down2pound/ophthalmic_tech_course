# OptiTech Academy Home PC Command Cheat Sheet

Use this as the short version of the home PC runbook. Run the commands from the
project folder after cloning or opening the repo.

Beginner translation: this is the recipe card. The longer runbook explains why
each step matters.

## 1. Get The Latest Code

```bash
git clone https://github.com/Down2pound/ophthalmic_tech_course.git
cd ophthalmic_tech_course
```

If the repo is already on the home PC:

```bash
git pull
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
pnpm build
pnpm launch:bundle
```

After those pass once, this one command runs the same main checks:

```bash
pnpm launch:preflight
```

## 4. Check Production Setup Files

```bash
pnpm launch:secrets
pnpm launch:doctor
```

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

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:sitemap
```

This early smoke test is allowed to pass while paid launch readiness is still
`false`. That is useful before Stripe live mode, email, database, and clinical
signoff are all finished. It still checks that the live pages load, browser
safety headers are present, and `/robots.txt` blocks private/admin-style paths.

## 7. Run The Final Go-Live Smoke Test

Use this only after all launch gates are complete and paid enrollment should be
ready:

```bash
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
```

This final version does not use `LAUNCH_SMOKE_ALLOW_NOT_READY=true`, so it
should fail if the app is not actually ready for paid buyers.

## If The Work Computer Blocks You

If you see `spawn EPERM`, permission errors, or admin/security popups, the code
may be fine. It usually means the computer blocked a helper program from opening.
Move to the home PC and start again from step 1.

Do not copy `.env` files, live Stripe secret keys, email API keys, database
passwords, session cookies, raw sign-in links, or private learner data.
