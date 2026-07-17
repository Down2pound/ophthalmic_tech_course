# OptiTech Academy Post-07/16 Workspace Handoff

Use this when continuing from the latest completed backup.

Simple translation: the `07/16/2026` backup is the last packed suitcase. The
items below are newer papers sitting on the desk. They should be committed and
backed up before switching computers or deploying.

Print this note with:

```bash
pnpm launch:post-0716-handoff
```

## Latest Completed Backup

- Backup date label: `2026-07-16`
- Latest completed backup commit: `2efefd0`
- Source ZIP: `optitech-academy-source-2026-07-16-2efefd0.zip`
- Git bundle: `optitech-academy-branch-2026-07-16-2efefd0.bundle`

Do not relabel this backup as `07/17/2026`. The July 17 work below happened
after that backup.

## Post-Backup Workspace Changes

These files were changed or added after the `07/16/2026` backup:

- `README.md`
- `docs/content/google-drive-source-inventory.md`
- `docs/launch/bootcamp-content-migration-checklist.md`
- `docs/launch/domain-and-sharing-guide.md`
- `docs/launch/first-buyer-fulfillment-checklist.md`
- `docs/launch/first-customers-sales-packet.md`
- `docs/launch/github-and-source-backup-guide.md`
- `docs/launch/home-pc-command-cheatsheet.md`
- `docs/launch/individual-learner-decision-one-pager.md`
- `docs/launch/post-0716-workspace-handoff.md`
- `docs/launch/practice-manager-approval-one-pager.md`
- `docs/launch/production-launch-package.md`
- `docs/launch/render-deployment-guide.md`
- `client/src/App.tsx`
- `client/src/lib/leadCsvExport.ts`
- `client/src/lib/leadCsvExport.test.ts`
- `client/index.html`
- `client/public/social-preview.svg`
- `client/src/pages/BuyerGuide.tsx`
- `client/src/pages/Curriculum.tsx`
- `client/src/pages/FreePreview.tsx`
- `client/src/pages/Home.tsx`
- `client/src/pages/Checkout.tsx`
- `client/src/pages/PracticePacks.tsx`
- `client/src/pages/PracticeSeatAdmin.tsx`
- `shared/commerce/buyerDecisionGuide.ts`
- `shared/commerce/buyerDecisionGuide.test.ts`
- `shared/commerce/learnerReadinessChecklist.ts`
- `shared/commerce/learnerReadinessChecklist.test.ts`
- `shared/commerce/offers.ts`
- `shared/commerce/practiceValueCalculator.ts`
- `shared/commerce/practiceValueCalculator.test.ts`
- `shared/launch/firstWeekSalesPlan.ts`
- `shared/launch/firstWeekSalesPlan.test.ts`
- `shared/course/bootcampDriveRefreshIntake.ts`
- `shared/course/bootcampSourceMap.ts`
- `shared/course/bootcampSourceMap.test.ts`
- `shared/course/contentAudiencePolicy.ts`
- `shared/course/contentAudiencePolicy.test.ts`
- `shared/course/freePreview.ts`
- `shared/course/freePreview.test.ts`
- `shared/course/spindelOnboardingSourceMap.ts`
- `shared/course/spindelOnboardingSourceMap.test.ts`
- `server/src/config/environment.ts`
- `server/src/config/environment.test.ts`
- `server/src/config/runtimeReadiness.test.ts`
- `server/src/config/indexHtmlMetadata.ts`
- `server/src/config/indexHtmlMetadata.test.ts`
- `server/src/commerce/purchaseWelcomeEmail.ts`
- `server/src/commerce/purchaseWelcomeEmail.test.ts`
- `server/src/db/setupLaunchDatabase.test.ts`
- `server/index.ts`
- `server/src/launch/bootcampContentMigrationChecklist.ts`
- `server/src/launch/bootcampContentMigrationChecklist.test.ts`
- `server/src/launch/deploymentFiles.test.ts`
- `server/src/launch/deploymentSmokeTest.ts`
- `server/src/launch/deploymentSmokeTest.test.ts`
- `server/src/launch/launchDoctor.ts`
- `server/src/launch/launchEvidenceBundle.test.ts`
- `server/src/launch/storefrontMetadata.test.ts`
- `server/src/launch/productionSetupPlan.ts`
- `server/src/launch/productionSetupPlan.test.ts`
- `server/src/launch/externalSetupWorksheet.ts`
- `server/src/launch/externalSetupWorksheet.test.ts`
- `server/src/launch/launchGoNoGo.ts`
- `server/src/launch/launchGoNoGo.test.ts`
- `server/src/launch/runLaunchGoNoGo.ts`
- `server/src/launch/runExternalSetupWorksheet.ts`
- `server/src/launch/runProductionSetupPlan.ts`
- `server/src/launch/runFirstWeekSalesPlan.ts`
- `server/src/launch/runSpindelOnboardingChecklist.ts`
- `server/src/launch/sitemap.ts`
- `server/src/launch/sitemap.test.ts`
- `server/src/launch/spindelOnboardingChecklist.ts`
- `server/src/launch/spindelOnboardingChecklist.test.ts`
- `server/src/routes/stripeWebhook.test.ts`
- `scripts/launch-bootcamp-intake.mjs`
- `scripts/launch-blockers-summary.mjs`
- `scripts/launch-first-sales-links.mjs`
- `scripts/launch-first-revenue-path.mjs`
- `scripts/launch-post-0716-handoff.mjs`
- `scripts/launch-backup-handoff.mjs`
- `package.json`

## What Changed

- Added a July 17 Bootcamp Drive refresh intake queue.
- Recorded 46 visible top-level Drive items from the Bootcamp folder.
- Marked 35 visible filenames as already represented in the typed source map.
- Identified 13 Drive refresh intake items that still need review before use.
- Added `pnpm launch:bootcamp-intake` to print the review queue.
- Added `pnpm launch:first-revenue` to print the shortest safe path from
  restored code to one controlled paid buyer.
- Updated backup handoff guidance so the Bootcamp intake command travels with
  the launch instructions.
- Expanded `pnpm launch:workstation-handoff` so it prints blockers, secret scan
  results, backup handoff, post-backup handoff, and the first-revenue path.
- Aligned the Render deployment guide summary with the actual `render.yaml`
  build command and linked the first-revenue path.
- Added a public `/preview` page with one safe sample lesson, buyer-fit notes,
  and calls to individual checkout, practice packs, curriculum, and policies.
- Updated the home page, curriculum page, first-sales link script, and sales
  packet so early buyers can inspect the free preview before paid enrollment.
- Added `/preview` to the production sitemap route list and deployment smoke
  public-page checks so the deployed preview page is verified before sharing.
- Added a public `/buyer-guide` page for individual learners and practice
  managers, linked it from buyer pages, sales scripts, one-pagers, sitemap, and
  deployment smoke checks.
- Updated the domain/sharing and production launch guides so launch-day page
  checks and sales links include `/preview` and `/buyer-guide`.
- Fixed launch test expectations that had fallen behind the newer database,
  readiness, email-safety, evidence-bundle, and buyer-guide wording.
- Updated generated mailto links so Outlook-friendly subjects still use `+`
  while email bodies decode cleanly.
- Added `pnpm launch:next`, a beginner-friendly launch command center that
  prints the current paid-launch phase, blocked gates, next best actions, and
  production smoke-test commands without exposing secret values.
- Added protected Practice Seat Manager CSV exports for custom practice leads
  and individual learner interest leads so early buyer follow-up can move into a
  spreadsheet without exposing checkout secrets.
- Added dynamic storefront share metadata and a public social preview image so
  buyer links can show the production domain and a professional preview card
  after `PUBLIC_APP_URL` is set.
- Mapped `Advanced_Ocular_Diagnostic_Masterclass.pdf` to Day 3 diagnostic
  testing and `Clinical Guide_ Manual Lensometry Standards and Procedures.pdf`
  to Day 5 lensometry in the typed Bootcamp source map.
- Added a content-audience policy so doctor-specific protocols, provider workup
  preferences, Spindel post-op/pre-op rules, and SEA workflow instructions route
  to the private Spindel Eye Technician onboarding version instead of the public
  OptiTech course.
- Added `pnpm launch:spindel-onboarding`, which prints the private Spindel Eye
  Technician onboarding lanes, storage roots, examples, and review gates for
  SEA doctor protocols and internal workflows.
- Added `pnpm launch:first-week-sales`, a seven-day controlled outreach plan
  that tells you what to do each day, what proof to save, and when not to send
  paid checkout links yet.
- Added `pnpm launch:go-no-go`, a live-site owner report that says GO,
  CAUTION, or NO-GO for public preview links, practice inquiries, and paid
  checkout links.
- Added `pnpm launch:external-setup`, a home-PC worksheet for the outside
  accounts needed to sell: GitHub, Render, Stripe, email, clinical signoff, and
  the first controlled live purchase.
- Added a practice value planner to `/practice-packs` so managers can compare
  seat-pack cost against their own estimate of repeated supervisor onboarding
  time, with clear no-guarantee language.
- Added a quick learner readiness check to `/checkout` so individual learners
  can decide whether the course is a strong fit, a possible fit after preview,
  or something to pause on before buying.
- Added route-level lazy loading in the React app so buyer pages, course pages,
  and admin pages load as separate browser chunks instead of one large initial
  bundle.
- Expanded purchase welcome emails with clearer next steps, buyer-safe support
  references, checkout email reminders, policy links, and safe-support warnings
  for both individual learners and practice pack buyers.

## Why It Matters For Launch

New Drive files should not flow straight into paid lessons. Each one needs:

- Drive file ID captured.
- Duplicate/version review.
- Rights and ownership review.
- Clinical review.
- Accessibility review.
- Public course, practice-only, newsletter/internal, duplicate, or excluded
  classification.

This protects the course from accidentally publishing internal Spindel material,
unreviewed clinical claims, duplicate files, or inaccessible media.

## Safe Commands Already Verified On Work Computer

These commands passed after the post-backup changes:

```bash
pnpm launch:bootcamp-intake
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm launch:external-setup
pnpm launch:first-sales
pnpm launch:first-week-sales
pnpm launch:next
pnpm launch:spindel-onboarding
pnpm build
pnpm launch:preflight
```

Earlier, the work computer blocked tests with `spawn EPERM`. After the runtime
became available, the brittle Markdown line-wrap assertion in
`server/src/launch/launchEvidenceBundle.test.ts` was fixed with a whitespace-
and case-normalized helper. The full test suite then passed.

`pnpm launch:blockers` and `pnpm launch:doctor` still report that paid launch is
blocked by missing production setup: clinical signoff, Stripe checkout/webhook,
passwordless email, hosted database, production URL, practice-seat admin token,
alert admin token, and the final paid-enrollment switch.

Run the same checks again on the home PC before deployment because Git is
missing on this workstation.

`pnpm launch:go-no-go` was added, but it needs a live deployment URL through
`LAUNCH_BASE_URL` or `PUBLIC_APP_URL`, so run it after the site is deployed.

## Repeated Error Rule

If the same command fails with the same error 3 times, stop retrying it on the
work computer. Record:

- The command that failed.
- The repeated error text.
- What was already verified successfully.
- The next home-PC command or setup step.

This is especially important for known work-computer blocks such as
`spawn EPERM`, missing `git`, or `git: 'remote-https' is not a git command`.

## Commit This Work When Git Is Available

```bash
git add README.md docs/content/google-drive-source-inventory.md docs/launch/bootcamp-content-migration-checklist.md docs/launch/domain-and-sharing-guide.md docs/launch/first-buyer-fulfillment-checklist.md docs/launch/first-customers-sales-packet.md docs/launch/github-and-source-backup-guide.md docs/launch/home-pc-command-cheatsheet.md docs/launch/individual-learner-decision-one-pager.md docs/launch/post-0716-workspace-handoff.md docs/launch/practice-manager-approval-one-pager.md docs/launch/production-launch-package.md docs/launch/render-deployment-guide.md client/index.html client/public/social-preview.svg client/src/App.tsx client/src/lib/leadCsvExport.ts client/src/lib/leadCsvExport.test.ts client/src/pages/BuyerGuide.tsx client/src/pages/Checkout.tsx client/src/pages/Curriculum.tsx client/src/pages/FreePreview.tsx client/src/pages/Home.tsx client/src/pages/PracticePacks.tsx client/src/pages/PracticeSeatAdmin.tsx shared/commerce/buyerDecisionGuide.ts shared/commerce/buyerDecisionGuide.test.ts shared/commerce/learnerReadinessChecklist.ts shared/commerce/learnerReadinessChecklist.test.ts shared/commerce/offers.ts shared/commerce/practiceValueCalculator.ts shared/commerce/practiceValueCalculator.test.ts shared/launch/firstWeekSalesPlan.ts shared/launch/firstWeekSalesPlan.test.ts shared/course/bootcampDriveRefreshIntake.ts shared/course/bootcampSourceMap.ts shared/course/bootcampSourceMap.test.ts shared/course/contentAudiencePolicy.ts shared/course/contentAudiencePolicy.test.ts shared/course/freePreview.ts shared/course/freePreview.test.ts shared/course/spindelOnboardingSourceMap.ts shared/course/spindelOnboardingSourceMap.test.ts server/index.ts server/src/commerce/purchaseWelcomeEmail.ts server/src/commerce/purchaseWelcomeEmail.test.ts server/src/config/environment.ts server/src/config/environment.test.ts server/src/config/indexHtmlMetadata.ts server/src/config/indexHtmlMetadata.test.ts server/src/config/runtimeReadiness.test.ts server/src/db/setupLaunchDatabase.test.ts server/src/launch/bootcampContentMigrationChecklist.ts server/src/launch/bootcampContentMigrationChecklist.test.ts server/src/launch/deploymentFiles.test.ts server/src/launch/deploymentSmokeTest.ts server/src/launch/deploymentSmokeTest.test.ts server/src/launch/launchDoctor.ts server/src/launch/launchEvidenceBundle.test.ts server/src/launch/storefrontMetadata.test.ts server/src/launch/productionSetupPlan.ts server/src/launch/productionSetupPlan.test.ts server/src/launch/externalSetupWorksheet.ts server/src/launch/externalSetupWorksheet.test.ts server/src/launch/launchGoNoGo.ts server/src/launch/launchGoNoGo.test.ts server/src/launch/runExternalSetupWorksheet.ts server/src/launch/runFirstWeekSalesPlan.ts server/src/launch/runLaunchGoNoGo.ts server/src/launch/runProductionSetupPlan.ts server/src/launch/runSpindelOnboardingChecklist.ts server/src/launch/sitemap.ts server/src/launch/sitemap.test.ts server/src/launch/spindelOnboardingChecklist.ts server/src/launch/spindelOnboardingChecklist.test.ts server/src/routes/stripeWebhook.test.ts scripts/launch-bootcamp-intake.mjs scripts/launch-blockers-summary.mjs scripts/launch-first-sales-links.mjs scripts/launch-first-revenue-path.mjs scripts/launch-post-0716-handoff.mjs scripts/launch-backup-handoff.mjs package.json
git commit -m "feat: add buyer preview and decision guide"
```

After the commit, create a new backup only if you intentionally want a new
backup beyond `07/16/2026`.

## Home PC Validation Before Deployment

```bash
pnpm install
pnpm check
pnpm test
pnpm launch:secret-scan
pnpm build
pnpm launch:bundle
pnpm launch:preflight
```

Do not paste `.env`, Stripe keys, webhook secrets, email API keys, database
passwords, raw sign-in links, session cookies, card numbers, patient
information, private learner details, or private employer details into this
handoff note.
