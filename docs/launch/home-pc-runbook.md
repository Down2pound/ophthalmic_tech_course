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
- Or the Google Drive source-code ZIP backup.
- Or another zip copy of the project folder.
- Or a Google Drive copy of the generated launch evidence folder.

Do not bring home `.env` files, live Stripe secret keys, email API keys,
database passwords, session cookies, raw sign-in links, or private learner data.

Important: if the newest work has not been pushed to GitHub yet, the Google
Drive source-code ZIP is the safest way to continue from home. Think of GitHub
as the shared bookshelf and the Drive ZIP as the backpack copy you can carry
home today.

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

If you are using the Google Drive source-code ZIP instead:

1. Download the ZIP from Google Drive.
2. Extract it to a simple folder, such as:

```text
C:\dev\ophthalmic_tech_course
```

3. Open PowerShell in that extracted folder.
4. Continue with `pnpm install`.

Do not extract the project inside Downloads if Windows security keeps blocking
commands. A simple folder like `C:\dev` is usually easier.

If you are using the Git bundle instead:

1. Download the newest `optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle`.
2. Put it in a simple folder, such as `C:\dev`.
3. Open PowerShell in that folder.
4. Run:

```bash
git clone optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle ophthalmic_tech_course --branch codex/optitech-product-spec
cd ophthalmic_tech_course
git remote set-url origin https://github.com/Down2pound/ophthalmic_tech_course.git
git push -u origin codex/optitech-product-spec
```

Beginner translation: the bundle is a travel copy of the Git branch. This turns
that travel copy back into a normal project folder, reconnects it to GitHub,
and pushes your saved work to the online repo.

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
pnpm launch:secret-scan
pnpm build
pnpm launch:bundle
```

If those all pass, run the one-command version next time:

```bash
pnpm launch:preflight
```

`launch:secret-scan` is a plain safety check that looks for likely Stripe keys,
webhook secrets, database passwords, and similar values before you package or
push the project. Beginner translation: it checks that private keys did not
accidentally get mixed into the public project files.

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
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:sitemap
```

Use the smoke command without `LAUNCH_SMOKE_ALLOW_NOT_READY=true` only for the
final go-live check after paid enrollment is supposed to be ready. The smoke
test also checks browser safety headers and `/robots.txt`, so it catches more
than just a blank or broken page.

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
