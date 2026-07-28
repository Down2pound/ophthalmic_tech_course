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
optitech-academy-source-YYYY-MM-DD-COMMIT.zip
optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle
optitech-academy-launch-evidence-YYYY-MM-DD-COMMIT.zip
optitech-academy-static-first-sale-page-YYYY-MM-DD-COMMIT.zip
```

Example:

```text
optitech-academy-source-2026-07-28-1416-405d66c.zip
optitech-academy-branch-2026-07-28-1416-405d66c.bundle
optitech-academy-launch-evidence-2026-07-28-1416-405d66c.zip
optitech-academy-static-first-sale-page-2026-07-28-1416-405d66c.zip
```

## Latest Confirmed Backup

Latest confirmed full source backup point:

- Commit: `405d66c`
- Source code ZIP:
  `https://drive.google.com/file/d/1F5d1kPiY2AxHIL_Ed6QwfaerkgCgPf8z/view?usp=drivesdk`
- Git branch bundle:
  `https://drive.google.com/file/d/1scEgevEcYBXlRtayeajEgyDY5GlAC1vZ/view?usp=drivesdk`
- Launch evidence ZIP:
  `https://drive.google.com/file/d/1ABgQw3pxYu2HKSpb17mbldj1qp1YsHwE/view?usp=drivesdk`
- Static first-sale page ZIP:
  `https://drive.google.com/file/d/1wOZRlyCSKgP0SO59j_T7uxuDfiL8LbdY/view?usp=drivesdk`

If this manifest has a newer GitHub commit than the listed backup commit, that
newer commit is usually only backup bookkeeping. For full restore, use the
newest matching source ZIP and Git bundle in the Drive folder.

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
