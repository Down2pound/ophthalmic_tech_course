# OptiTech Academy GitHub And Source Backup Guide

Use this when you need to confirm where the latest app code lives and where the
course source material comes from.

Simple translation: GitHub is the project bookshelf, Drive is the media/source
library, and NotebookLM is a study table built from those sources. The app
should not depend on a private Drive or NotebookLM session at runtime.

## GitHub Repo

Repository:

```text
https://github.com/Down2pound/ophthalmic_tech_course.git
```

Current Codex working branch:

```text
codex/optitech-product-spec
```

From a home PC with normal Git installed, push the current branch with:

```bash
git push -u origin codex/optitech-product-spec
```

If GitHub asks you to sign in, use Git Credential Manager, GitHub Desktop, or
the GitHub CLI. The work computer may fail with `remote-https` or `spawn EPERM`
even when the repo itself is fine.

## Portable Backup Files

When this work computer cannot push to GitHub, keep both files:

- `optitech-academy-source-YYYY-MM-DD-COMMIT.zip`
- `optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle`

Use the ZIP when you simply need the project files. Use the bundle when you want
to preserve Git commit history for the branch.

To restore the Git bundle on a home PC:

```bash
git clone optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle ophthalmic_tech_course --branch codex/optitech-product-spec
cd ophthalmic_tech_course
git remote set-url origin https://github.com/Down2pound/ophthalmic_tech_course.git
git push -u origin codex/optitech-product-spec
```

Print the current handoff checklist with:

```bash
pnpm launch:backup
```

This command prints the GitHub repo, branch push command, portable backup file
names, and the Drive/NotebookLM course source trail.

On a locked-down work computer, run this combined safe handoff command before
stopping:

```bash
pnpm launch:workstation-handoff
```

It runs the plain-Node secret scan and then prints the backup handoff report.

Safe Drive backup rule: upload only the ZIP, bundle, and generated
`launch-evidence/` folder. Do not upload `.env`, Stripe secret keys, webhook
secrets, email API keys, database passwords, raw sign-in links, session cookies,
card numbers, patient information, or protected health information.

## Course Source Libraries

Bootcamp Drive folder: https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q

NotebookLM workspace: https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1

Older Bootcamp site course data:
https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI

The repo records these sources in:

- `shared/course/sourceInventory.ts`
- `shared/course/bootcampSourceMap.ts`
- `docs/content/google-drive-source-inventory.md`

## How Content Should Flow Into The Course

1. Find the source asset in the Bootcamp Drive folder or NotebookLM source
   workspace.
2. Preserve the original Drive file ID, filename, and source title.
3. Map it to a course day, module, or lesson in repository metadata.
4. Classify it as public course, practice-only onboarding, or excluded.
5. Review for clinical accuracy, rights, accessibility, and privacy.
6. Publish only reviewed content through the app repository or approved
   production storage.

Do not live-pull private Drive or NotebookLM content directly into the paid app.
The paid app should use reviewed repository content and approved production
asset storage.

## Quick Backup Check

Before stopping work for the day:

- [ ] `git status --short --branch` shows the expected branch.
- [ ] Latest local commit hash is written down.
- [ ] Latest ZIP and bundle were created.
- [ ] ZIP and bundle were uploaded to the Drive handoff folder if GitHub push
      failed.
- [ ] GitHub branch was pushed from a home PC when possible.
- [ ] Bootcamp or NotebookLM source changes were copied into repo metadata
      before being used in paid course content.
