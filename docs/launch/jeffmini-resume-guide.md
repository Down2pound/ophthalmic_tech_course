# OptiTech Academy Jeffmini Resume Guide

Use this guide on the home PC named `jeffmini` to continue from the latest
saved launch work.

Simple translation: GitHub is the easiest path. Google Drive is the backup
drawer. Use GitHub first unless it fails.

## Latest Saved Work

- Date saved: `2026-07-17`
- Commit: `b851c92`
- Full commit: `b851c92f3363ddff1cc45f4cf434798df1bc583f`
- Branch: `codex/optitech-product-spec`
- GitHub branch:
  `https://github.com/Down2pound/ophthalmic_tech_course/tree/codex/optitech-product-spec`
- Google Drive backup folder:
  `https://drive.google.com/drive/folders/1pA_fNKEMLKnCmhn6tkM7VLrEj7fgX97T`

Google Drive backup files:

- Source ZIP:
  `optitech-academy-source-2026-07-17-b851c92.zip`
- Git bundle:
  `optitech-academy-branch-2026-07-17-b851c92.bundle`

## Option A: Continue From GitHub

Use this first.

```bash
git clone https://github.com/Down2pound/ophthalmic_tech_course.git
cd ophthalmic_tech_course
git checkout codex/optitech-product-spec
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
```

If the repo already exists on `jeffmini`:

```bash
cd C:\dev\ophthalmic_tech_course
git fetch origin
git checkout codex/optitech-product-spec
git pull
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
```

## Option B: Continue From The Drive Bundle

Use this if GitHub is unavailable or the branch is missing.

1. Download `optitech-academy-branch-2026-07-17-b851c92.bundle` from the Drive
   backup folder.
2. Put it in `C:\dev`.
3. Open PowerShell in `C:\dev`.
4. Run:

```bash
git clone optitech-academy-branch-2026-07-17-b851c92.bundle ophthalmic_tech_course --branch codex/optitech-product-spec
cd ophthalmic_tech_course
git remote set-url origin https://github.com/Down2pound/ophthalmic_tech_course.git
git push -u origin codex/optitech-product-spec
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
```

Beginner translation: the bundle is the travel version of the Git branch. This
turns it back into a normal project and reconnects it to GitHub.

## Option C: Continue From The Drive ZIP

Use this only if Git and the bundle path are confusing.

1. Download `optitech-academy-source-2026-07-17-b851c92.zip`.
2. Extract it to `C:\dev\ophthalmic_tech_course`.
3. Open PowerShell in that folder.
4. Run:

```bash
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
```

The ZIP has the files, but the bundle and GitHub branch are better because they
preserve Git history.

## First Production Setup Order

Run these command helpers before touching real payment settings:

```bash
pnpm launch:next
pnpm launch:external-setup
pnpm launch:render-setup
pnpm launch:clinical-review
pnpm launch:database-setup
pnpm launch:stripe-products
pnpm launch:email-setup
pnpm launch:admin-tokens
pnpm launch:env-template
pnpm launch:doctor
```

Do not set `ENABLE_PAID_ENROLLMENT=true` yet.

## Render Deployment Order

1. Open Render.
2. Create a new Blueprint from the GitHub repo.
3. Select branch `codex/optitech-product-spec`.
4. Let Render read `render.yaml`.
5. Keep `ENABLE_PAID_ENROLLMENT=false`.
6. Fill only real production values in the Render dashboard.
7. Let Render create the PostgreSQL database.
8. Confirm `pnpm db:setup` runs during deploy.
9. Open:

```text
https://your-real-domain.example/api/health
https://your-real-domain.example/api/launch/readiness
https://your-real-domain.example/api/checkout/availability
```

## First Deployed Smoke Test

Use this while paid launch is still closed:

```powershell
$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"
$env:LAUNCH_BASE_URL="https://your-real-domain.example"
pnpm launch:smoke
$env:PUBLIC_APP_URL="https://your-real-domain.example"
pnpm launch:sitemap
pnpm launch:first-sales
pnpm launch:go-no-go
```

## Paid Launch Is Still Blocked Until

- Module 1 clinical review is approved and recorded.
- Production PostgreSQL is connected and schema is verified.
- Stripe checkout and webhook work in test mode.
- Passwordless email sends sign-in links.
- Practice-seat and alert admin tokens are set.
- Browser/mobile/smoke checks pass on the deployed site.
- One low-risk live-mode internal purchase works end to end.

Only then set:

```text
ENABLE_PAID_ENROLLMENT=true
```

## Safety Rule

Do not upload or paste `.env`, Stripe keys, webhook secrets, email API keys,
database passwords, raw sign-in links, session cookies, card numbers, patient
information, or private employee details.
