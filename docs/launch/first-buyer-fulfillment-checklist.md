# OptiTech Academy First Buyer Fulfillment Checklist

Use this when the first real individual learner or practice buyer pays. The goal
is to confirm the buyer received what they paid for and to catch problems before
more people buy.

Simple translation: this is the receipt-and-access checklist for the first real
customer.

Do not paste card numbers, Stripe secret keys, webhook secrets, raw sign-in
links, session cookies, database passwords, patient information, private learner
details, or private employee details into this checklist.

## Before Accepting The First Buyer

- [ ] `ENABLE_PAID_ENROLLMENT=true` is active only after all go-live gates pass.
- [ ] `/api/launch/readiness` reports `readyForPaidLaunch: true`.
- [ ] Stripe checkout and webhook were tested in test mode.
- [ ] Passwordless sign-in email delivery was tested.
- [ ] Managed PostgreSQL tables were created with `pnpm db:setup`.
- [ ] Clinical review signoff is recorded.
- [ ] The public domain, sitemap, and smoke test evidence are saved.

If any item above is not true, stop and use `go-live-checklist.md` first.

## Individual Learner Fulfillment

Use this when someone buys Founding Learner Access.

- [ ] Record purchase date and buyer email.
- [ ] Confirm Stripe payment status is paid.
- [ ] Confirm `checkout.session.completed` webhook was delivered.
- [ ] Confirm learner access exists for the buyer email.
- [ ] Confirm the buyer can request a passwordless sign-in link.
- [ ] Confirm the buyer can open Module 1.
- [ ] Confirm the buyer can see course policies and support contact.
- [ ] Send a short welcome email if the automated email does not already cover
      the next steps.

Safe welcome message:

```text
Hi [Name],

Thank you for joining OptiTech Academy as a founding learner.

Your course access is connected to this email address: [buyer email].
Use the sign-in link on the site with the same email address to start Module 1.

The course is foundational education, not certification or employment
verification. Use the Skills Passport language with a supervisor, trainer, or
future employer for hands-on observation conversations.

Please reply if you have trouble accessing the course. Do not send patient
information, card numbers, passwords, or raw sign-in links.

Jeff
```

## Practice Pack Fulfillment

Use this when a practice buys a five-seat or fifteen-seat pack.

- [ ] Record purchase date, buyer email, practice name, and purchased pack size.
- [ ] Confirm Stripe payment status is paid.
- [ ] Confirm `checkout.session.completed` webhook was delivered.
- [ ] Confirm the practice seat pack exists with the correct seat count.
- [ ] Confirm the manager knows seat assignment happens through the protected
      practice setup process.
- [ ] Confirm the manager has the support email and policy link.
- [ ] Ask for the first learner email only after the buyer is ready to assign a
      seat.
- [ ] Confirm assigned learners can request passwordless sign-in links.

Safe practice welcome message:

```text
Hi [Name],

Thank you for purchasing the OptiTech Academy practice onboarding pack.

Purchase email: [buyer email]
Seat pack: [five-seat / fifteen-seat]

This pack gives learner access to the shared foundations course. Local
supervisors remain responsible for practice-specific protocols, observation,
competency signoff, and employment decisions.

When you are ready to assign seats, send the learner emails you want to start
with. Please do not send patient information, private employee performance
details, passwords, card numbers, or raw sign-in links.

Jeff
```

## First Buyer Evidence To Save

Save safe evidence only:

- Buyer type: individual learner or practice pack.
- Offer purchased.
- Purchase date.
- Buyer email.
- Stripe Checkout session ID.
- Stripe event ID.
- Whether access appeared automatically.
- Whether sign-in email worked.
- Whether support follow-up was needed.
- Any non-private feedback about what confused the buyer.

Do not save card details, patient information, raw sign-in links, session
cookies, passwords, database URLs, or secret keys.

## If Something Goes Wrong

Use `first-sale-support-runbook.md` if:

- Payment succeeded but access is missing.
- Sign-in email does not arrive.
- A practice seat cannot be assigned.
- The buyer asks for a refund.
- Multiple buyers report the same issue.

Pause broader sales outreach until the issue is understood and documented.
