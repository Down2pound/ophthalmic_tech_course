# OptiTech Academy Database Setup Guide

Use this guide to connect managed PostgreSQL before accepting payment. The
database is the app's long-term memory. It stores purchases, learner access,
practice seat packs, sign-in records, lesson progress, and quiz attempts.

## Why This Is Required

Paid checkout intentionally fails closed until the database is configured and
the launch tables are verified. This prevents a real payment from creating
access only in temporary server memory.

## Required Host Variables

Set these in the production host dashboard, not in Git:

```text
DATABASE_URL=
DATABASE_SSL=true
```

Most managed PostgreSQL providers require SSL. Leave `DATABASE_SSL=true` unless
your database provider clearly says otherwise.

Print the work-safe database setup checklist with:

```bash
pnpm launch:database-setup
```

That command lists the required host variables, launch tables, setup order, and
proof to save without printing any database secrets.

## Tables Created By Setup

Run:

```bash
pnpm db:setup
```

On Render, the included `render.yaml` Blueprint runs this as a pre-deploy
command. If you are using a different host, run it manually after `DATABASE_URL`
points to managed PostgreSQL.

That command creates these launch tables when they do not already exist:

- `commerce_purchases`
- `commerce_enrollments`
- `commerce_practice_seat_packs`
- `commerce_practice_seat_assignments`
- `commerce_practice_inquiries`
- `auth_users`
- `auth_magic_links`
- `auth_sessions`
- `learning_lesson_completions`
- `assessment_attempts`
- `assessment_question_results`

The setup uses `CREATE TABLE IF NOT EXISTS`, so it is safe to run again when
you are checking a launch candidate.

## Setup Order

1. Create the managed PostgreSQL database.
2. Add `DATABASE_URL` to the production host dashboard.
3. Set `DATABASE_SSL=true`.
4. Run `pnpm db:setup` against the production database.
5. Open `/api/launch/readiness`.
6. Confirm the database schema is verified and no required tables are missing.

## What To Prove Before Selling

Save safe evidence that shows:

- `pnpm db:setup` completed against the production database.
- `/api/launch/readiness` reports the launch database schema as verified.
- Stripe test checkout created a durable individual enrollment.
- Stripe test checkout created a durable practice seat pack.
- A custom practice inquiry created a durable lead record.
- A learner's lesson progress survives refresh and sign-out/sign-in.
- A quiz attempt is saved server-side.

Do not save database passwords, raw connection strings, SQL dumps with learner
emails, session cookies, raw sign-in tokens, or protected health information in
Google Drive or support notes.

## If Readiness Says Tables Are Missing

Check these in order:

1. `DATABASE_URL` points to the intended production database.
2. The host can reach the database network.
3. The database user has permission to create tables and indexes.
4. `pnpm db:setup` was run against the same database used by the deployed app.
5. `/api/launch/readiness` was checked after the app restarted or reloaded env
   values.

If database readiness fails during live sales, set
`ENABLE_PAID_ENROLLMENT=false` until the schema is verified again.
