# OptiTech Academy First Week Sales Plan

Use this after the app is deployed or nearly deployed and you are ready for
controlled first-buyer conversations.

Simple translation: this is the day-by-day recipe for finding the first real
buyers without blasting checkout links too early.

## Before You Send Paid Checkout Links

- `/api/launch/readiness` must say paid launch readiness is complete.
- `pnpm launch:smoke` must pass against the production site without
  `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.
- One internal live purchase must work end to end.
- Stripe live checkout, webhook fulfillment, email sign-in, production
  database, and clinical review must be proven.

If any of those are not ready, send the course overview, free preview, buyer
guide, or practice inquiry path instead.

## Seven-Day Plan

### Day 1: Prepare the warm list

Goal: Create a small, realistic list before sending any sales messages.

Actions:

- Pick 5 individual learners and 5 practice buyers who might honestly benefit.
- Label each lead as individual, practice, or Spindel pilot.
- Run `pnpm launch:first-sales`, `pnpm launch:lead-qualifier`, and
  `pnpm launch:sales-tracker`.
- Send preview or overview links only if paid launch readiness is not complete.

Proof to save:

- First 10 tracker filled with non-private lead names or safe placeholders.
- Current paid-launch readiness result.

### Day 2: Start individual learner outreach

Goal: Test whether career changers, medical assistants, and new techs
understand the offer.

Actions:

- Send the individual learner message to 3 warm leads.
- Use the free preview link first when someone needs to see the teaching style.
- Ask one simple question: what would make starting in eye care feel less
  overwhelming?

Proof to save:

- Outreach date for each learner.
- Non-private themes from replies.

### Day 3: Start practice buyer outreach

Goal: Test whether managers understand the practice-pack value.

Actions:

- Send the practice buyer message to 3 managers, supervisors, owners, or
  training leads.
- Lead with onboarding consistency, shared vocabulary, and supervisor time
  savings.
- Ask what confuses new hires most in the first 30 days.

Proof to save:

- Outreach date for each practice.
- Questions practice buyers ask before trusting the course.

### Day 4: Fix the first confusing thing

Goal: Improve one buyer-facing page based on real feedback.

Actions:

- Review replies and write down the most common confusion.
- Improve the checkout, preview, buyer guide, or practice-pack wording if
  needed.
- Do not change medical claims without clinical review.

Proof to save:

- The buyer question that caused the change.
- The page or document updated.

### Day 5: Follow up without pressure

Goal: Give interested people a clear next step without pushing too hard.

Actions:

- Follow up with anyone who replied or opened a conversation.
- Send the buyer decision guide when someone is unsure which path fits.
- Send paid checkout links only after production readiness, smoke test, and
  internal live purchase are proven.

Proof to save:

- Follow-up date.
- Next step for each interested buyer.

### Day 6: Run the first purchase carefully

Goal: Prove one controlled buyer can pay and get access before broad outreach.

Actions:

- Run `pnpm launch:live-purchase-test` before inviting a real paid buyer.
- Use one low-risk internal or friendly buyer first.
- Confirm payment, webhook fulfillment, sign-in email, learner access, and
  support path.

Proof to save:

- Purchase tracker row with safe business details only.
- Whether access worked without a manual fix.

### Day 7: Choose next week's focus

Goal: Decide whether individuals or practices are the better next sales lane.

Actions:

- Count leads, replies, interested buyers, sales, and support issues.
- Pick one focus for next week: individual learners, practice buyers, or Spindel
  pilot onboarding.
- Improve one page, script, or FAQ based on what buyers actually asked.

Proof to save:

- Weekly business review CSV updated.
- One clear next-week experiment.

## Safe Claims

Say: foundational learning, onboarding support, shared language, knowledge
checks, supervised practice preparation, and help getting less overwhelmed at
the start.

Do not promise: certification, employment, promotion, exam success, income,
clinical competency, or replacement of hands-on supervision.

Do not save `.env` files, Stripe keys, webhook secrets, email API keys,
database passwords, raw sign-in links, session cookies, card numbers, patient
information, protected health information, private learner details, or private
employer details in outreach notes.

Related commands:

```bash
pnpm launch:first-sales
pnpm launch:lead-qualifier
pnpm launch:first-10-customers
pnpm launch:sales-tracker
pnpm launch:live-purchase-test
```
