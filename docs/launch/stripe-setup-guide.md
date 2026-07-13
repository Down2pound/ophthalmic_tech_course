# OptiTech Academy Stripe Setup Guide

Use this guide to connect Stripe safely before accepting real payment. The app
uses Stripe-hosted Checkout, so card entry happens on Stripe's secure page. The
app never stores card numbers.

## How This App Uses Stripe

The checkout route creates one-time Stripe Checkout Sessions from the app's
shared offer list:

| Offer | App offer id | Price |
| --- | --- | --- |
| Founding Learner Access | `founding-learner` | `$199` |
| Five-Seat Practice Onboarding Pack | `practice-five-seat-pack` | `$799` |
| Fifteen-Seat Practice Onboarding Pack | `practice-fifteen-seat-pack` | `$1,799` |

The app sends these values to Stripe when checkout starts:

- buyer email as `customer_email`
- offer id as `metadata[offer_id]`
- access period as `metadata[access_months]`
- practice-pack seat count as `metadata[seat_count]`

Because the app sends price data directly, you do not need to manually create
Stripe products before test checkout. If you later want Stripe dashboard
products for reporting, keep the app offer ids and prices aligned with this
file.

## Test Mode First

1. Keep `ENABLE_PAID_ENROLLMENT=false`.
2. Add the Stripe test secret key to the host dashboard as `STRIPE_SECRET_KEY`.
3. Add the deployed public URL as `PUBLIC_APP_URL`.
4. Create a Stripe webhook endpoint for:

```text
https://your-domain.example/api/stripe/webhook
```

5. Subscribe that endpoint to:

```text
checkout.session.completed
```

6. Add the webhook signing secret to the host dashboard as
   `STRIPE_WEBHOOK_SECRET`.
7. Keep the webhook secret server-side only. Do not paste it into Git, Google
   Drive, screenshots, support notes, or chat.

## Required Test Purchases

Run these in Stripe test mode after the production database is connected and
`pnpm db:setup` has run:

- Individual learner purchase for `founding-learner`.
- Five-seat practice pack purchase for `practice-five-seat-pack`.
- Fifteen-seat practice pack purchase for `practice-fifteen-seat-pack`.

For each purchase, save safe evidence only:

- Checkout session ID.
- Stripe event ID.
- Buyer email used.
- Offer purchased.
- Webhook delivery status.
- Whether the app created learner access or the practice seat pack.

Do not save card numbers, secret keys, webhook secrets, raw sign-in links,
session cookies, database passwords, or protected health information.

## What The Webhook Must Prove

Before real sales, prove that `checkout.session.completed` does the right thing:

- Individual learner checkout creates durable learner access.
- Practice pack checkout creates the correct purchased seat count.
- Duplicate Stripe events do not create duplicate access.
- Invalid webhook signatures are rejected.
- Events missing buyer email, offer id, amount, currency, or access metadata do
  not get marked fulfilled.

The app intentionally fails closed unless the database is configured and the
launch tables are verified. That protects paid access from being created only
in temporary memory.

## Turning On Real Payment

Only after clinical review, database setup, email sign-in, test checkout,
webhook fulfillment, and deployed smoke testing pass:

1. Add live Stripe keys in the host dashboard.
2. Create the live-mode webhook endpoint for `/api/stripe/webhook`.
3. Set the live webhook signing secret.
4. Recheck `/api/launch/readiness`.
5. Confirm the readiness report no longer warns that Stripe is in test mode.
6. Set `ENABLE_PAID_ENROLLMENT=true`.
7. Redeploy or restart the app.
8. Run one low-risk internal live purchase.

If that live purchase fails, turn `ENABLE_PAID_ENROLLMENT=false` again before
debugging.
