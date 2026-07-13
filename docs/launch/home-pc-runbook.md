# OptiTech Academy Home PC Runbook

Use this if the work computer blocks development commands with errors like
`spawn EPERM`, admin permission prompts, security software warnings, or network
blocks.

Simple translation: the app code may be fine, but the work computer may be
stopping helper programs from opening. A home PC usually gives you more control,
so you can finish the checks there.

## What To Bring Home

You need one of these:

- The GitHub repo URL.
- Or a zip copy of the project folder.
- Or a Google Drive copy of the generated launch evidence folder.

Do not bring home `.env` files, live Stripe secret keys, email API keys,
database passwords, session cookies, raw sign-in links, or private learner data.

## Install The Basics

Install these on the home PC:

- Git
- Node.js LTS
- pnpm

Then open PowerShell or Terminal.

## Get The Project

Clone the repo:

```bash
git clone https://github.com/Down2pound/ophthalmic_tech_course.git
cd ophthalmic_tech_course
```

If you already have the repo, update it:

```bash
git pull
```

## Install Project Packages

Run:

```bash
pnpm install
```

Beginner translation: this downloads the code helpers the app needs to run,
test, and build.

## Run The Local Safety Checks

Run:

```bash
pnpm check
pnpm test
pnpm build
pnpm launch:bundle
```

If those all pass, run the one-command version next time:

```bash
pnpm launch:preflight
```

## If You See `spawn EPERM`

Try these in order:

1. Close VS Code, terminal windows, and any app using the project folder.
2. Move the repo to a simple folder like:

```text
C:\dev\ophthalmic_tech_course
```

3. Reopen PowerShell as your normal user.
4. Run `pnpm install` again.
5. Run `pnpm check`.
6. Run `pnpm test`.

If it still fails, your antivirus may be blocking helper programs from
`node_modules`. Add the project folder to the antivirus allow list only if you
trust the repo and packages.

## Create The Launch Evidence Folder

Run:

```bash
pnpm launch:bundle
```

This creates a `launch-evidence/` folder. It is designed to be safe to save to
Google Drive because it does not include secret values.

## After The App Is Deployed

Replace the example URL with your real production URL:

```bash
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:sitemap
```

Save the smoke test output and hosted sitemap URL with the launch evidence.

## What Still Requires Real Online Accounts

These cannot be finished by local code alone:

- Production host account and deployment.
- Managed PostgreSQL database.
- Stripe live mode and webhook setup.
- Transactional email provider.
- Real production domain.
- Clinical reviewer approval.
- Final live checkout test.

Think of local checks as inspecting the car in your driveway. The online-account
steps are registering it, fueling it, and driving it on the road.

## When To Stop And Ask For Help

Stop and ask for help if:

- A command asks for a secret you do not understand.
- A command wants to delete files.
- Stripe is in live mode and you are unsure.
- A database command points to a real production database and you are unsure.
- Clinical content changes after signoff.

Bring the exact command and error message when asking for help.
