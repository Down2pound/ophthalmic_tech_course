# OptiTech Academy Production Launch

This runbook takes the merged course platform from source code to a revenue-capable production service.

## 1. Confirm the business details

Before deployment, decide and record:

- legal business name
- mailing address
- customer support email
- email address that should receive new-sale alerts
- public course domain or temporary Render URL
- whether Stripe Tax will be enabled

The site will refuse to start in production when required identity, payment, email, security, or storage variables are missing.

## 2. Configure Stripe in test mode

1. Create a product named **OptiTech Academy — Ophthalmic Technician Foundations**.
2. Create a **one-time** price of **$699 USD**.
3. Copy the test secret key and test Price ID.
4. After the Render service exists, create a Stripe webhook endpoint:
   - URL: `https://YOUR-DOMAIN/api/stripe/webhook`
   - events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`
5. Copy the webhook signing secret.
6. Leave Stripe in test mode until the complete smoke test below passes.

Promotion codes are enabled by default. Stripe automatic tax remains disabled unless `STRIPE_AUTOMATIC_TAX=true` and the Stripe account is configured for it.

## 3. Configure transactional email

1. Create a Resend account.
2. Add and verify the sending domain.
3. Create an API key.
4. Choose a sender such as `OptiTech Academy <course@yourdomain.com>`.
5. Set a monitored support address and a sale-notification address.

Transactional email is used for paid-order activation, password recovery, support messages, and sale notifications.

## 4. Deploy through Render

1. Connect the GitHub repository to Render.
2. Create a Blueprint from `render.yaml`.
3. Enter every variable marked `sync: false`.
4. Use a paid Starter web service because the included durable disk is required.
5. After Render assigns the public URL, set `PUBLIC_APP_URL` to that exact HTTPS origin and redeploy.
6. Confirm `/api/health` returns `status: ok`, `emailConfigured: true`, and `webhookConfigured: true`.

The Blueprint mounts a 1 GB disk at `/var/data` and writes application records to `/var/data/course-data.json`. A service with a disk must remain a single-instance deployment.

## 5. Complete the test-mode purchase

Use a new email address and complete each step:

1. Open the public landing page.
2. Select individual enrollment.
3. Confirm the price shown is $699.
4. Accept the policies and continue to Stripe.
5. Pay with Stripe test card `4242 4242 4242 4242`, any future expiration, any CVC, and any postal code.
6. Confirm the browser returns to the account-activation page.
7. Confirm the activation email arrives even if the browser is closed.
8. Create a password and enter the course.
9. Sign out and sign in again.
10. Request a password reset and complete it.
11. Pass one quiz and confirm the dashboard saves the score.
12. Submit the support form and confirm delivery.

Repeat with a two-seat practice purchase and confirm the manager receives one teammate invitation.

## 6. Validate recovery and duplicate protection

- Replay the same Stripe webhook event and confirm it is acknowledged as a duplicate.
- Open an activation link after the purchase has been activated and confirm it cannot create another account.
- Attempt repeated incorrect logins and confirm rate limiting occurs.
- Restart the Render service and confirm the account and course progress remain available.

## 7. Switch to live revenue

1. Create or confirm the live-mode $699 Price.
2. Replace the Stripe test key, Price ID, and webhook secret with live values.
3. Create the live webhook endpoint at the same `/api/stripe/webhook` path.
4. Redeploy.
5. Make one real purchase with a controlled internal email and refund it from Stripe after confirming fulfillment.
6. Review the public Terms, Privacy, Refund, and Training Disclaimer pages with qualified counsel before broad advertising.

## 8. Sales launch checklist

- connect a memorable domain
- confirm TLS and redirects
- add the course URL to the practice website and staff email signatures
- prepare a short launch email for practices and prospective technicians
- create one introductory promotion code with an expiration date
- define who answers support and refund requests
- monitor Stripe payments, webhook failures, Render health, and sale-notification email daily during launch week

## Scaling note

The included JSON data store is suitable for a small, single-instance launch. Move accounts and progress to a managed database before adding multiple application instances or substantial volume.
