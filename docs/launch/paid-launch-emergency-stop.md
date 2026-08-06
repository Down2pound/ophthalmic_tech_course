# OptiTech Academy Paid Launch Emergency Stop

Use this if a live checkout, webhook, email, database, or access problem appears
after paid enrollment opens.

Simple translation: this is the red-button checklist. First stop new buyers
from paying, then check that the stop worked, then collect safe evidence and
fix the problem calmly.

Do not paste Stripe secret keys, webhook signing secrets, card numbers, raw
sign-in links, session cookies, database passwords, patient information,
protected health information, or private employee details into this checklist.

## Stop New Checkout First

1. Open the production host dashboard.
2. Set `ENABLE_PAID_ENROLLMENT=false`.
3. Save the environment setting.
4. Redeploy or restart the service if the host requires it.
5. Open `/api/checkout/availability`.
6. Confirm the buyer-facing status says checkout is paused or unavailable.
7. Open `/api/launch/readiness`.
8. Confirm paid launch is no longer marked ready.

## If Manual Stripe Payment Links Were Shared

1. Open the Stripe dashboard.
2. Pause or deactivate any public Payment Links that were shared broadly.
3. Leave Stripe webhook delivery history intact.
4. Do not delete products, prices, checkout sessions, payments, or webhook
   events during triage.
5. Save only safe IDs in notes, such as the Payment Link name, Checkout session
   ID, payment ID, or webhook event ID.

## Protect Current Buyers

1. Check whether any buyer paid during the problem window.
2. Use the protected buyer lookup before changing access.
3. If payment succeeded but access is missing, check webhook delivery before
   editing records.
4. If a welcome email failed, confirm the buyer still has durable access before
   resending sign-in instructions.
5. If a refund is needed, handle the refund in Stripe and then use the protected
   access revocation flow only after documenting the decision.
6. Before changing app access, run `pnpm launch:access-revocation` to prepare a
   one-target packet from the buyer lookup result.

## Safe Evidence To Save

- Production URL.
- Deployed commit.
- Time paid checkout was turned off.
- `/api/checkout/availability` result after the stop.
- `/api/launch/readiness` result after the stop.
- Stripe Checkout session IDs involved.
- Stripe event IDs involved.
- Public error messages seen by buyers.
- Buyer support action taken.
- Decision: fix in place, rollback deployment, refund, or reopen after tests.

## Fix Before Reopening

Run these before turning checkout back on:

```bash
pnpm launch:blockers
pnpm launch:preflight
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-domain.example pnpm launch:smoke
pnpm launch:live-purchase-test
```

Only set `ENABLE_PAID_ENROLLMENT=true` again after:

- The original issue is understood.
- The fix is deployed.
- `/api/health` is healthy.
- `/api/launch/readiness` shows the expected state.
- `/api/checkout/availability` shows the expected state.
- Stripe webhook delivery is healthy.
- Email sign-in works.
- A controlled internal purchase or approved test proves access is created.

## Related Guides

- `docs/launch/go-live-checklist.md`
- `docs/launch/first-sale-support-runbook.md`
- `docs/launch/manual-payment-link-checklist.md`
- `docs/launch/runtime-readiness-snapshot-guide.md`
