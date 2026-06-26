# Ophthalmic Technician Training Course

## 10-Day Super Course Overview

A professional enrollment website for a **10-day high-intensity multimedia training program** designed to prepare new hires and career changers to become clinic-ready ophthalmic technicians.

### 10-Day Curriculum Structure

Each day features a dedicated module with comprehensive training materials, hands-on exercises, and assessments.

- **Day 1**: Ophthalmic Fundamentals & Anatomy
- **Day 2**: Patient Assessment & History Taking
- **Day 3**: Diagnostic Equipment - Part 1 (Refraction)
- **Day 4**: Diagnostic Equipment - Part 2 (Imaging)
- **Day 5**: Clinical Procedures & Measurements
- **Day 6**: Anterior Segment Examination
- **Day 7**: Posterior Segment Examination
- **Day 8**: Surgical Assistance & Instrumentation
- **Day 9**: Practice Management & Patient Communication
- **Day 10**: Advanced Topics & Certification Preparation

### Features

- Comprehensive curriculum overview for all 10 modules
- Flexible pricing tiers for individual technicians and practice managers
- Verified instructor credentials and expertise
- Interactive enrollment forms
- Video content and multimedia learning materials
- Quizzes and assessments for each module
- Hands-on practical exercises

**Built with TypeScript, Vite, and modern web technologies.**

---

## Project Structure

```
├── client/          # Frontend application
├── server/          # Backend API
├── shared/          # Shared utilities and types
├── patches/         # Dependency patches
└── config files     # Build and formatting configuration
```

## Getting Started

See individual README files in `client/`, `server/`, and `shared/` directories for setup instructions.

## Stripe Checkout Setup

The app uses Stripe-hosted Checkout for founding learner purchases. That means
learners enter card details on Stripe's secure page, not inside this app.

Required environment variables:

```text
STRIPE_SECRET_KEY=sk_test_replace_with_your_secret_key
PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_replace_with_your_webhook_signing_secret
```

`PUBLIC_APP_URL` should be the real deployed site URL in production. The server
uses it to build the success and cancel return links after Stripe checkout.

Use `.env.example` as the safe template for local setup. Copy it to `.env`, then
paste real local/test values into `.env`. The `.env` file is ignored by Git so
real secrets do not get committed.

Stripe key guide:

- `pk_test_...` is a publishable test key. It is safe to expose to the browser,
  but the current hosted Checkout flow does not require it.
- `sk_test_...` is a secret test key. It must stay server-only in `.env`.
- `whsec_...` is the webhook signing secret. It must stay server-only in `.env`.

Checkout routes:

- Frontend page: `/checkout`
- Policies page: `/policies`
- Server endpoint: `POST /api/checkout/sessions`
- Success return: `/learn?checkout=success`
- Cancel return: `/checkout?checkout=cancelled`

If `STRIPE_SECRET_KEY` is missing, checkout fails closed with a setup message and
does not collect payment.
