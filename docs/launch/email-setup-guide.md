# OptiTech Academy Email Setup Guide

Use this guide to connect passwordless sign-in email before paid enrollment.
Learners do not use passwords. They enter their email, receive a one-time link,
and use that link to enter the course.

## How This App Sends Email

The app sends a `POST` request to the configured transactional email endpoint:

```text
TRANSACTIONAL_EMAIL_API_URL=
```

The request uses this authorization header:

```text
Authorization: Bearer TRANSACTIONAL_EMAIL_API_KEY
```

The JSON body has this shape:

```json
{
  "from": "OptiTech Academy <noreply@your-domain.example>",
  "to": "learner@example.com",
  "subject": "Your OptiTech Academy sign-in link",
  "text": "Use this secure link to sign in...",
  "html": "<p>Use this secure link to sign in...</p>"
}
```

Choose an email provider or adapter that accepts this format, or add a small
server adapter that converts this format into the provider's required shape.

## Required Host Variables

Set these in the production host dashboard, not in Git:

```text
AUTH_SESSION_SECRET=
TRANSACTIONAL_EMAIL_API_URL=
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
PUBLIC_APP_URL=
```

`PUBLIC_APP_URL` must be the deployed `https` site because sign-in links point
back to:

```text
https://your-domain.example/api/auth/callback?token=...
```

## Sender Setup

Before launch:

1. Verify the sender address or sending domain with the email provider.
2. Set `SIGN_IN_FROM_EMAIL` to that verified sender.
3. Send a test sign-in email to an internal learner inbox.
4. Check inbox, spam, quarantine, and link behavior.
5. Confirm the link opens the deployed app and creates a session.

## What To Prove Before Selling

Save safe evidence that shows:

- A valid learner receives a sign-in email.
- The sign-in link opens the deployed app.
- The link can only be used once.
- Expired or invalid links show a safe error.
- The app never exposes raw magic-link tokens in support notes or launch
  evidence.

Do not save raw sign-in links, raw tokens, session cookies, email API keys,
database passwords, protected health information, or private learner details in
Google Drive or support notes.

## If Email Fails

Check these in order:

1. `/api/launch/readiness` shows email variables are configured.
2. `TRANSACTIONAL_EMAIL_API_URL` is the correct production endpoint.
3. `TRANSACTIONAL_EMAIL_API_KEY` is active and server-side only.
4. `SIGN_IN_FROM_EMAIL` is verified by the provider.
5. `PUBLIC_APP_URL` uses the deployed `https` domain.
6. The learner used the same email that received purchase access.
7. The provider did not suppress, bounce, or quarantine the email.

If email fails during live sales, keep `ENABLE_PAID_ENROLLMENT=false` until the
issue is fixed and a sign-in test passes again.
