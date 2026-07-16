# OptiTech Academy Manual Launch QA Evidence

Use this file to record the human launch checks that cannot be proven by
automated tests alone.

Simple translation: this is the launch-day score sheet. It proves the store,
cash register, sign-in email, course access, and practice pack flow were checked
by a real person.

Do not paste card numbers, Stripe secret keys, webhook secrets, raw magic-link
tokens, session cookies, database passwords, generated admin/session secrets,
patient information, protected health information, or private employer details
into this file.

## Release Candidate

Deployment URL:

Commit SHA:

Tester:

QA date:

## Preflight

- [ ] Clinical review signoff is saved with launch records.
- [ ] Production database setup completed with `pnpm db:setup`.
- [ ] Production host environment variables are configured.
- [ ] `/api/health` returns ok.
- [ ] `/api/launch/readiness` shows the expected launch status.

## Stripe Checkout And Webhook Fulfillment

Why it matters: paid buyers must receive durable access after checkout.

Required action: test Stripe checkout and webhook fulfillment before paid
launch.

Evidence needed: Stripe session ID, Stripe event ID, webhook delivery result,
and app access result without secrets.

- [ ] Completed.
- [ ] Passed without blocking issue.
- [ ] Evidence saved without secrets.

Tester:

Date:

Environment URL:

Result:

Notes:

## Paid Learner Flow

Why it matters: individual learners must be able to buy, sign in, and start
learning.

Required action: test the paid learner flow end to end.

Evidence needed: checkout return, sign-in email delivery, learner session,
Module 1 access, progress, and quiz behavior.

- [ ] Completed.
- [ ] Passed without blocking issue.
- [ ] Evidence saved without secrets.

Tester:

Date:

Environment URL:

Result:

Notes:

## Browser And Accessibility QA

Why it matters: first buyers need the public pages, checkout, and learning pages
to work on normal screens and input methods.

Required action: run browser and accessibility QA on desktop and mobile.

Evidence needed: notes for layout, labels, keyboard navigation, contrast,
overflow, shared-link preview, and any blocking issue.

- [ ] Completed.
- [ ] Passed without blocking issue.
- [ ] Evidence saved without secrets.

Tester:

Date:

Environment URL:

Result:

Notes:

## Paid Launch Evidence Details

Record IDs and screenshots only when they do not expose secrets, card numbers,
cookies, patient information, or private learner data.

### Stripe Individual Learner Test

Stripe checkout session ID:

Stripe event ID:

Webhook delivery status:

Learner email used:

Enrollment/access result:

Individual checkout success return URL:

Individual checkout cancel return URL:

- [ ] Individual success return showed the learner payment received message.
- [ ] Individual checkout required policy acceptance.
- [ ] Individual cancel return showed no payment was taken.

### Passwordless Email Delivery

Email provider used:

Sender address verified:

Test learner inbox:

Delivery result:

- [ ] Sign-in email arrived without exposing raw token in support notes.
- [ ] Sign-in link opened the deployed app and created a session.
- [ ] Learner could request a fresh sign-in link from the Learn page access
      panel.
- [ ] Failed or expired sign-in link showed a safe error.
- [ ] Repeated sign-in requests eventually returned 429 with Retry-After.

### Stripe Practice Pack Test

Stripe checkout session ID:

Stripe event ID:

Webhook delivery status:

Practice manager email used:

Seat pack size purchased:

Seat assignment result:

Practice checkout success return URL:

Practice checkout cancel return URL:

- [ ] Practice success return showed practice pack payment received next steps.
- [ ] Practice checkout required policy acceptance.
- [ ] Practice cancel return kept the buyer on the practice pack options.
- [ ] Practice success next steps asked for learner emails without requesting
      private patient or staff details.

### Custom Practice Inquiry Test

Inquiry email address:

Inquiry subject:

Practice size or rollout note:

- [ ] Larger-practice inquiry path is visible on `/practice-packs`.
- [ ] Inquiry message does not include patient information or secrets.
- [ ] Custom inquiry is treated as a conversation, not an automatic purchase
      agreement.
- [ ] Repeated practice inquiry submissions eventually returned 429 with
      Retry-After.

### Webhook Failure Handling

- [ ] Invalid webhook signature was rejected in test mode or by automated test
      evidence.
- [ ] Completed checkout event with missing purchase data does not get marked as
      successfully fulfilled.
- [ ] Repeated checkout session starts eventually returned 429 with Retry-After.

Notes:

### Search And Sharing

Public domain:

Sitemap URL or generated sitemap path:

Shared-link preview checked for title/description:

### Final Paid Enrollment Switch

- [ ] ENABLE_PAID_ENROLLMENT stayed false until all gates passed.
- [ ] Final readiness check passed after the switch was enabled.
- [ ] One low-risk live-mode internal purchase was verified.

## Final Decision

- [ ] No blocking checkout issue.
- [ ] No blocking learner access issue.
- [ ] No blocking practice pack issue.
- [ ] No blocking browser, mobile, keyboard, label, contrast, or overflow issue.

Decision:

Approver:
