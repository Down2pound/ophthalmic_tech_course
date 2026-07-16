# OptiTech Academy Deployment Cutover Checklist

Use this when the app is ready to move from "deployed but not selling yet" to
"safe to accept paid buyers."

Simple translation: this is the launch runway. It keeps the online store closed
while you test the doors, cash register, email, and course access.

## 1. First Hosted Deploy

- [ ] Deploy the chosen Git commit to Render or the selected production host.
- [ ] Keep `ENABLE_PAID_ENROLLMENT=false`.
- [ ] Confirm the app opens at the public `https` URL.
- [ ] Open `/api/health` and confirm it returns healthy.
- [ ] Open `/api/launch/readiness` and save the safe readiness summary.
- [ ] Confirm `PUBLIC_APP_URL` matches the deployed URL.
- [ ] Confirm `DATABASE_URL` is set by the host and `DATABASE_SSL=true`.
- [ ] Confirm the database setup step completed or rerun `pnpm db:setup` from a
      trusted machine or host shell.

## 2. Pre-Paid Smoke Test

Run this from a home PC or host shell that is not blocked by work-computer admin
rules:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
```

This check should prove the deployed site, health endpoint, launch readiness
endpoint, buyer pages, checkout return pages, security headers, and robots.txt
load before real paid enrollment is turned on.

Do not use this command as final launch approval. It allows the app to be "not
ready" while you are still setting up Stripe, email, clinical review, and live
mode.

## 3. Paid Launch Gate

Only continue when all of these are true:

- [ ] Module 1 clinical review is approved and saved.
- [ ] Stripe live secret key is set in the host dashboard.
- [ ] Stripe live webhook endpoint points to `/api/stripe/webhook`.
- [ ] Webhook listens for `checkout.session.completed`.
- [ ] Transactional email is configured and a sign-in email reaches a test
      inbox.
- [ ] Practice-seat admin token and alert admin token are configured.
- [ ] `/api/launch/readiness` shows no missing launch-critical setup.
- [ ] Stripe test-mode warning is gone before accepting real buyers.
- [ ] `pnpm launch:doctor` or the readiness endpoint says paid launch is ready.

## 4. Turn On Paid Enrollment

- [ ] Set `ENABLE_PAID_ENROLLMENT=true` in the production host dashboard.
- [ ] Redeploy or restart the production web service.
- [ ] Open `/api/launch/readiness`.
- [ ] Confirm `readyForPaidLaunch` is `true`.
- [ ] Run the final smoke test without the not-ready override:

```bash
LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
```

- [ ] Make one low-risk internal live purchase.
- [ ] Confirm the purchase creates durable learner access or the correct
      practice seat pack.
- [ ] Confirm the buyer can request a passwordless sign-in email.
- [ ] Save non-secret evidence in the launch evidence folder.

## 5. If Anything Fails

- [ ] Set `ENABLE_PAID_ENROLLMENT=false` again.
- [ ] Redeploy or restart the production web service.
- [ ] Save the failure theme without secrets, card numbers, raw sign-in links,
      patient details, or private learner data.
- [ ] Fix one issue at a time.
- [ ] Rerun `/api/launch/readiness`.
- [ ] Rerun the smoke test before sharing checkout links again.

## 6. First 24 Hours

- [ ] Use `first-buyer-fulfillment-checklist.md` for the first real buyer.
- [ ] Use `revenue-and-sales-tracker-template.md` for safe sales notes.
- [ ] Check support email after each early purchase.
- [ ] Confirm no repeated checkout, sign-in, webhook, or seat-assignment issue.
- [ ] Pause broader outreach if a buyer needs manual rescue.

Do not save `.env`, live secret keys, webhook secrets, email API keys, database
passwords, raw magic links, session cookies, card numbers, patient information,
or protected health information in this checklist.
