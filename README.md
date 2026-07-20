# OptiTech Academy — Ophthalmic Technician Foundations

A full-stack, ten-module ophthalmic technician education platform built with React, TypeScript, Vite, and Express.

## Included Features

- Public course and curriculum pages
- Individual and practice-team enrollment
- One-time Stripe Checkout at $699 per student seat
- Stripe payment verification before account activation
- Password hashing with Node `scrypt`
- Signed, HTTP-only login sessions
- Protected student dashboard and lessons
- Ten instructional modules with practice checklists and clinical safety notes
- End-of-module quizzes with saved scores
- Practice-manager invitation links and team progress
- Printable certificate of course completion
- Persistent local account/progress data
- GitHub Actions type-check and production-build validation

## Curriculum

1. Ophthalmic Foundations & Patient Communication
2. Refraction & Lensometry
3. Tonometry & Intraocular Pressure Measurement
4. Slit Lamp Examination & Anterior Segment Imaging
5. Retinal Imaging & OCT Interpretation
6. Visual Field Testing & Interpretation
7. Advanced Imaging & Specialized Procedures
8. Patient Communication & Soft Skills
9. Clinical Documentation & EHR Proficiency
10. Professional Development & Career Pathways

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The development frontend runs through Vite. A production build bundles the Express server and creates the static client files.

```bash
pnpm run check
pnpm run build
pnpm start
```

## Required Production Environment Variables

```env
PUBLIC_APP_URL=https://course.example.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_STANDARD_PRICE_ID=price_...
SESSION_SECRET=a-long-random-secret
DATA_FILE=/var/data/optitech/course-data.json
```

The Stripe Price must be configured as a **one-time $699 payment**. Practice enrollment uses the selected number of seats as the Stripe Checkout quantity.

## Persistent Storage Requirement

Accounts, password hashes, practice invitations, and quiz progress are stored in the JSON file configured by `DATA_FILE`. The hosting platform must provide a durable writable volume. Ephemeral or read-only deployments will lose account data after a restart and are not appropriate without replacing `server/store.ts` with a managed database adapter.

The data file is written with restricted file permissions and is ignored by Git. Back it up according to the organization's security and retention policies.

## Stripe Test Checklist

1. Create a one-time test Price for $699.
2. Add the test secret key and Price ID to the deployment.
3. Complete an individual purchase with a Stripe test card.
4. Confirm that the payment-success page creates a password and signs in.
5. Complete all quiz flows and verify progress remains after sign-out/sign-in.
6. Complete a multi-seat practice purchase and redeem each private invitation link.
7. Replace test credentials with live credentials only after successful testing.

## Certificate Scope

The generated certificate confirms completion of this independent educational course. It is not licensure, JCAHPO certification, or proof of independent clinical competency. Students and employers must verify current certification eligibility and scope requirements with the appropriate official organizations and applicable regulations.
