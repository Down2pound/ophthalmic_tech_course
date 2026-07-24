# OptiTech Academy Manual Payment Link Checklist

Use this only for a small controlled first-buyer sale when automated app
checkout is still paused.

Simple translation: this is the careful shortcut. Stripe can take the payment,
but you must personally confirm the receipt and manually complete access setup.

Do not paste Stripe secret keys, webhook secrets, card numbers, raw sign-in
links, session cookies, database passwords, patient information, private learner
details, or private employee details into this checklist.

## When This Shortcut Is Allowed

- [ ] The app is deployed to a real `https` URL.
- [ ] `pnpm launch:preflight` passed for the deployed commit.
- [ ] `LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke` passed against the
      deployed URL.
- [ ] The buyer is a warm, approved first buyer.
- [ ] The buyer understands the course is education, not certification,
      employment, exam success, or hands-on competency signoff.
- [ ] You are ready to run `pnpm launch:fulfillment` immediately after payment.

Do not use manual payment links for broad public launch.

## Create Stripe Payment Links

Create one Stripe Payment Link per offer in the Stripe dashboard:

| Offer | Price | Host variable |
| --- | ---: | --- |
| Founding Learner Access | `$199` | `PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER` |
| Five-Seat Practice Onboarding Pack | `$799` | `PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_5_SEATS` |
| Fifteen-Seat Practice Onboarding Pack | `$1,799` | `PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS` |

Use only links that begin with:

```text
https://buy.stripe.com/
```

These are public buyer links, not secret keys. They can be saved in the host
dashboard, but they should not be blasted publicly until the full launch gates
are proven.

## Host Dashboard Setup

Keep the normal automated launch switch paused:

```text
ENABLE_PAID_ENROLLMENT=false
```

Paste only the optional public links that you are ready to use:

```text
PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_5_SEATS=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS=
```

After redeploy or restart, open:

```text
/api/checkout/availability
```

Expected manual-link status:

```text
primaryAction: use-manual-payment-link
```

## Before Sending A Manual Payment Link

- [ ] Confirm the buyer's email.
- [ ] Send the buyer guide and policy page first.
- [ ] Confirm the buyer understands manual fulfillment may take staff follow-up.
- [ ] Confirm the exact offer and price.
- [ ] Confirm you can monitor Stripe for the payment.
- [ ] Confirm you can manually send access/welcome instructions afterward.

## After The Buyer Pays

Immediately run:

```bash
pnpm launch:fulfillment
```

Then complete the matching section:

- Individual learner: `first-buyer-fulfillment-checklist.md`
- Practice pack: `first-buyer-fulfillment-checklist.md`
- Sales tracking: `revenue-and-sales-tracker-template.md`

Save safe evidence only:

- Buyer email.
- Offer purchased.
- Stripe Payment Link name.
- Stripe payment or checkout session ID.
- Payment status.
- Whether access was manually granted.
- Whether welcome instructions were sent.
- Any non-private buyer feedback.

## Stop Rules

Stop using manual payment links if:

- A buyer pays and does not receive access quickly.
- The buyer is confused about certification or employment claims.
- Stripe payment amount or offer name does not match the course offer.
- You cannot confirm who paid.
- You cannot complete manual fulfillment the same day.
- More than one buyer needs manual rescue.

Fix the issue before sending another payment link.
