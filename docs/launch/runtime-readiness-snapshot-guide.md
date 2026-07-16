# OptiTech Academy Runtime Readiness Snapshot Guide

Use this after the app is deployed. It tells you what to copy from the live
readiness endpoint before opening paid enrollment.

Simple translation: this is the scoreboard. If the scoreboard does not say the
store is ready, do not invite real buyers yet.

## Where To Check

Open this URL after replacing the domain with the real production site:

```text
https://your-domain.example/api/launch/readiness
```

Save the response as `runtime-readiness-snapshot.json` in the launch evidence
folder.

Do not paste Stripe secret keys, webhook secrets, email API keys, database
passwords, raw sign-in links, cookies, card numbers, patient information,
protected health information, or private employer details into launch notes.

The readiness response is designed to list missing variable names and launch
status, not secret values.

## Must Be True Before Paid Links Go Broadly Public

- [ ] `readyForPaidLaunch` is `true`.
- [ ] `salesChannels.individualLearner.ready` is `true`.
- [ ] `salesChannels.practicePacks.ready` is `true`.
- [ ] `commerce.checkoutConfigured` is `true`.
- [ ] `commerce.webhookConfigured` is `true`.
- [ ] `commerce.stripeSecretKeyMode` is `live`.
- [ ] `commerce.paidEnrollmentEnabled` is `true`.
- [ ] `auth.passwordlessConfigured` is `true`.
- [ ] `practiceSeatAdmin.practiceSeatAdminConfigured` is `true`.
- [ ] `alertAdmin.alertAdminConfigured` is `true`.
- [ ] `database.databaseConfigured` is `true`.
- [ ] `databaseReadiness.schemaVerified` is `true`.
- [ ] `clinicalReview.moduleOneReviewApproved` is `true`.
- [ ] `warnings` is empty or contains only an understood non-blocking note.

## Key Environment Switches To Confirm

- `MODULE_ONE_CLINICAL_REVIEW_APPROVED=true`
- `ENABLE_PAID_ENROLLMENT=true`
- `DATABASE_SSL=true`
- `PUBLIC_APP_URL` matches the deployed https site.
- Stripe is live mode, not test mode, before real public sales.

## Snapshot Template

Copy the deployed response into a file named `runtime-readiness-snapshot.json`.
If you are writing a human summary instead, use this structure:

```text
Snapshot date/time:
Production URL:
Commit or release:

readyForPaidLaunch:
individualLearner ready:
practicePacks ready:
paid enrollment enabled:
Stripe mode:
Stripe webhook configured:
passwordless email configured:
database configured:
database schema verified:
clinical review approved:
practice seat admin protected:
alert admin protected:

Warnings:

Launch actions still open:

Decision:
```

## If The Scoreboard Is Not Ready

1. Keep `ENABLE_PAID_ENROLLMENT=false`.
2. Read the `warnings`, `nextSetupSteps`, and `launchActions` sections.
3. Fix the missing setup area using the matching launch guide.
4. Redeploy or restart if host settings changed.
5. Reopen `/api/launch/readiness`.
6. Save a fresh snapshot only after the output changes.

## Matching Guides

- `docs/launch/production-env-checklist.md`
- `docs/launch/go-live-checklist.md`
- `docs/launch/render-deployment-guide.md`
- `docs/launch/stripe-setup-guide.md`
- `docs/launch/email-setup-guide.md`
- `docs/launch/database-setup-guide.md`
- `docs/launch/clinical-review-guide.md`
