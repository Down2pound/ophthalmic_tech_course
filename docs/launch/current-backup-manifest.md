# OptiTech Academy Current Backup Manifest

Use this file to identify where the newest safe handoff point lives in GitHub
and Google Drive.

Simple translation: this is the luggage tag. The actual newest suitcase is the
newest matching ZIP and bundle pair in Drive, or the latest pushed GitHub
branch.

## Primary Backup Sources

- Branch: `codex/optitech-product-spec`
- GitHub repo:
  `https://github.com/Down2pound/ophthalmic_tech_course`
- GitHub branch:
  `https://github.com/Down2pound/ophthalmic_tech_course/tree/codex/optitech-product-spec`
- Draft PR:
  `https://github.com/Down2pound/ophthalmic_tech_course/pull/10`
- Google Drive folder:
  `https://drive.google.com/drive/folders/1pA_fNKEMLKnCmhn6tkM7VLrEj7fgX97T`

## Drive Backup File Pattern

Use the newest matching pair with the same date and commit hash:

```text
optitech-academy-source-YYYY-MM-DD-COMMIT-tracked.zip
optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle
optitech-academy-launch-evidence-YYYY-MM-DD-COMMIT.zip
optitech-academy-static-first-sale-page-YYYY-MM-DD-COMMIT.zip
```

Example:

```text
optitech-academy-source-2026-08-06-a6cbdb4-tracked.zip
optitech-academy-branch-2026-08-06-a6cbdb4.bundle
optitech-academy-launch-evidence-2026-08-06-a6cbdb4.zip
optitech-academy-static-first-sale-page-2026-08-06-a6cbdb4.zip
```

## Latest Confirmed Backup

Latest confirmed backup point:

- Commit: `a6cbdb4`
- Backup date: `2026-08-06`
- Source code ZIP, tracked repo files only:
  `https://drive.google.com/file/d/1eatoxS-uJWSPUg_I8TaltVf5xHbroUmx/view?usp=drivesdk`
- Git branch bundle:
  `https://drive.google.com/file/d/1-N6461KAAc9W5pzNFy1fNfskLoJMoXeg/view?usp=drivesdk`
- Launch evidence ZIP:
  `https://drive.google.com/file/d/1uFMUT_CMeprtGx3xrXu0CGodH3FpWata/view?usp=drivesdk`
- Static first-sale page ZIP:
  `https://drive.google.com/file/d/11LodjFiyeMhhhmXWDogXbeFnpD0WsSeA/view?usp=drivesdk`

This manifest may be committed after `a6cbdb4` only to record the Drive links.
If GitHub shows a newer manifest-only commit, use GitHub for the newest branch
state and use the Drive files above as the latest full portable backup set.

The source ZIP was created from Git-tracked files only so it stays small enough
for Google Drive upload. It does not include installed packages such as
`node_modules`; run `pnpm install` after restoring on a home PC.

Use the newest matching ZIP and bundle pair in the Google Drive folder. The
date and short commit hash should match in both filenames.

Beginner translation: if the ZIP says `eeb7504`, use the bundle that also says
`eeb7504`. Do not mix a ZIP from one commit with a bundle from another commit.

GitHub is the easiest restore path when the branch is pushed. Drive is the
backup path when GitHub, network access, or the work computer gets blocked. The
launch-evidence ZIP is the safe document packet to upload or share for launch
review; it is not a full source-code restore by itself.

## What This Backup Includes

- Paid enrollment and checkout readiness gates.
- Individual and practice buyer pages.
- Practice seat admin support tools.
- Buyer lookup, access revocation, lead exports, and follow-up drafts.
- Revenue and first-buyer sales tracker templates.
- First-buyer fulfillment checklist.
- Launch docs for hosting, database, email, Stripe, clinical review, and live
  purchase testing.

## What Still Must Happen Before Selling

- Run full local validation on `jeffmini` or another home PC.
- Deploy to a public HTTPS host.
- Connect managed PostgreSQL.
- Configure Stripe live checkout and webhook.
- Configure passwordless transactional email.
- Set admin protection tokens.
- Complete Module 1 clinical review signoff.
- Run production smoke tests.
- Complete one low-risk internal live purchase before public checkout links are
  shared broadly.

## Safety Rule

Do not save `.env`, Stripe keys, webhook secrets, email API keys, database
passwords, raw sign-in links, session cookies, card numbers, patient
information, protected health information, or private employee details in
GitHub or Google Drive.
