# OptiTech Academy Go-Live Checklist

Use this as the final launch-day sequence. Do not turn on real paid enrollment
until every section is complete and the deployed app says it is ready.

## 1. Freeze The Release Candidate

- [ ] Choose the commit that will be deployed.
- [ ] Run `pnpm launch:preflight`.
- [ ] Save the generated `launch-evidence/` folder.
- [ ] Confirm no `.env`, secret keys, raw tokens, cookies, database passwords,
      or protected health information were saved.

## 2. Complete Clinical Review

Detailed guide: `docs/launch/clinical-review-guide.md`

- [ ] Module 1 clinical review packet was reviewed.
- [ ] Corrections were resolved.
- [ ] Reviewer name, role, date, approved version, and approval status were
      saved.
- [ ] Production host has the `MODULE_ONE_CLINICAL_*` values.
- [ ] `MODULE_ONE_CLINICAL_REVIEW_APPROVED=true` only after approval.

## 3. Connect Hosting And Database

Detailed guides:

- `docs/launch/deployment-guide.md`
- `docs/launch/database-setup-guide.md`

- [ ] App is deployed to a public `https` URL.
- [ ] `PUBLIC_APP_URL` matches the deployed URL.
- [ ] Managed PostgreSQL database exists.
- [ ] `DATABASE_URL` and `DATABASE_SSL=true` are configured in the host.
- [ ] `pnpm db:setup` completed against the production database.
- [ ] `/api/health` returns `ok: true`.
- [ ] `/api/launch/readiness` reports database schema verified.

## 4. Connect Stripe And Email

Detailed guides:

- `docs/launch/stripe-setup-guide.md`
- `docs/launch/email-setup-guide.md`

- [ ] Stripe test secret key is configured.
- [ ] Stripe webhook endpoint points to `/api/stripe/webhook`.
- [ ] Webhook listens for `checkout.session.completed`.
- [ ] Webhook signing secret is configured.
- [ ] Transactional email endpoint and API key are configured.
- [ ] Sign-in sender address is verified.
- [ ] Test sign-in email arrives and opens the deployed app.

## 5. Run Paid Flow Tests

Record safe evidence in `manual-launch-qa-evidence.md`.

- [ ] Individual learner test checkout creates durable learner access.
- [ ] Five-seat practice pack test checkout creates the correct seat pack.
- [ ] Fifteen-seat practice pack test checkout creates the correct seat pack.
- [ ] Practice seat assignment works and cannot exceed purchased capacity.
- [ ] Learner can sign in, open Module 1, complete progress, submit quiz, and
      see certificate eligibility only after requirements are met.
- [ ] Custom practice inquiry path is visible and works as a conversation path.

## 6. Run Browser And Sharing Checks

- [ ] Desktop layout checked.
- [ ] Mobile layout checked.
- [ ] Keyboard navigation checked.
- [ ] Form labels checked.
- [ ] Contrast and readability checked.
- [ ] Text overflow checked.
- [ ] Checkout error states checked.
- [ ] Sign-in error states checked.
- [ ] Course access denied states checked.
- [ ] Sitemap generated with the production domain.
- [ ] Shared-link preview title and description checked.

## 7. Turn On Paid Enrollment

Only after every earlier section passes:

- [ ] Stripe live secret key is configured.
- [ ] Stripe live-mode webhook endpoint is configured.
- [ ] `/api/launch/readiness` no longer warns that Stripe is in test mode.
- [ ] Set `ENABLE_PAID_ENROLLMENT=true`.
- [ ] Redeploy or restart the app.
- [ ] Run `LAUNCH_BASE_URL=https://your-domain.example pnpm launch:smoke`.
- [ ] Confirm the smoke report includes individual and practice checkout
      success/cancel return pages.
- [ ] Open `/api/launch/readiness`.
- [ ] Confirm `readyForPaidLaunch` is `true`.
- [ ] Run one low-risk internal live-mode purchase.
- [ ] Confirm live purchase creates durable access.

If any live check fails, set `ENABLE_PAID_ENROLLMENT=false` before debugging.

## 8. Archive The Launch Record

- [ ] Save the final `launch-evidence/` folder.
- [ ] Save clinical reviewer signoff evidence.
- [ ] Save Stripe test evidence without secrets.
- [ ] Save email delivery evidence without raw sign-in links.
- [ ] Save browser/accessibility QA notes.
- [ ] Save deployment smoke report.

Do not archive `.env`, live secret keys, webhook secrets, email API keys,
database passwords, raw magic-link tokens, session cookies, card numbers, or
protected health information.
