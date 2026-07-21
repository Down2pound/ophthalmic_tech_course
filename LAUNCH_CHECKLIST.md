# OptiTech Academy Revenue Launch Checklist

## Required accounts

- [ ] Stripe account activated for live payments
- [ ] One-time Stripe product and price created at $699 per seat
- [ ] Resend account created and sending domain verified
- [ ] Render account connected to this GitHub repository
- [ ] Business checking account connected to Stripe payouts

## Render deployment

1. In Render, choose **New + → Blueprint** and select this repository.
2. Render will read `render.yaml` and create the web service plus a persistent disk.
3. Enter every secret value marked `sync: false`.
4. Deploy and verify that `/api/health` reports `status: ok`.

## Required environment values

- `STRIPE_SECRET_KEY`: Stripe live secret key for production
- `STRIPE_STANDARD_PRICE_ID`: one-time $699 Price ID
- `STRIPE_WEBHOOK_SECRET`: signing secret for the production webhook
- `RESEND_API_KEY`: transactional-email API key
- `EMAIL_FROM`: verified sender, such as `OptiTech Academy <course@example.com>`
- `SUPPORT_EMAIL`: monitored customer-support inbox
- `SALES_NOTIFICATION_EMAIL`: inbox receiving new-sale notices
- `BUSINESS_LEGAL_NAME`: legal seller name used in policies
- `BUSINESS_ADDRESS`: business mailing address used in policies

## Stripe webhook

Create a webhook endpoint pointing to:

`https://YOUR-DOMAIN/api/stripe/webhook`

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.

## End-to-end test before accepting live customers

- [ ] Use Stripe test keys and a test one-time Price
- [ ] Complete an individual purchase
- [ ] Confirm the activation email arrives
- [ ] Close the browser before activation, then activate from the email
- [ ] Sign in and complete a quiz
- [ ] Request and complete a password reset
- [ ] Complete a multi-seat practice purchase
- [ ] Redeem a practice invitation
- [ ] Submit the support form
- [ ] Confirm sale notifications arrive
- [ ] Verify Terms, Privacy, Refund, Disclaimer, and Support pages
- [ ] Replace test Stripe credentials with live credentials
- [ ] Complete one low-risk live purchase and issue a refund after verification

## Revenue operations

- [ ] Set Stripe payout schedule
- [ ] Enable Stripe Radar defaults
- [ ] Decide whether to enable automatic tax before broad sales
- [ ] Document who handles refunds and support
- [ ] Back up `/var/data/course-data.json` regularly
- [ ] Review conversion, checkout abandonment, refunds, and support weekly

The product should not be advertised as professional certification, licensure, guaranteed employment, or a substitute for supervised clinical training.
