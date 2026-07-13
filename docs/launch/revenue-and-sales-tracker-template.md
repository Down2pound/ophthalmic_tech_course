# OptiTech Academy Revenue And Sales Tracker Template

Use this as the simple business notebook for the course. The goal is to track
who is interested, who bought, who needs help, and what to do next.

## Safe Tracking Rules

This tracker is safe for Google Drive when you keep it to business notes only.
Do not paste secrets, private medical details, or raw access links.

Safe to track:

- Buyer name, practice name, and business email.
- Purchase amount and offer name.
- Stripe Checkout session ID or Stripe event ID.
- Follow-up date, status, and next step.
- General support themes, such as "sign-in email not received."

Do not track:

- Credit card numbers.
- Stripe secret keys, webhook secrets, passwords, or API keys.
- Patient names, patient charts, medical record numbers, or PHI.
- Raw magic sign-in links or session cookies.
- Staff performance details that do not belong in a sales tracker.

## Lead Tracker

Use this table before someone buys.

| Date Added | Lead Type | Name Or Practice | Source | Buyer Path | Status | Next Follow-Up | Safe Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-13 | Individual | Example Learner | LinkedIn | Individual course | New | 2026-07-16 | Wants beginner-friendly tech training. |
| 2026-07-13 | Practice | Example Eye Care | Referral | Five-seat pack | Warm | 2026-07-17 | Asked about onboarding new technicians. |

Status ideas:

- New
- Contacted
- Warm
- Demo requested
- Waiting on buyer
- Won
- Lost

## Purchase Tracker

Use this table after someone pays.

| Purchase Date | Buyer Type | Buyer Name Or Practice | Buyer Email | Offer | Amount | Stripe Checkout Session ID | Stripe Event ID | Fulfillment Status | Sign-In Confirmed | Support Needed | Safe Notes |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| 2026-07-13 | Individual | Example Learner | learner@example.com | Individual learner | 199 | cs_test_example | evt_test_example | Access sent | No | No | Send welcome email. |
| 2026-07-13 | Practice | Example Eye Care | admin@example.com | Five-seat practice pack | 799 | cs_test_example | evt_test_example | Seats created | No | Yes | Needs seat assignment help. |

Fulfillment status ideas:

- Paid, waiting on webhook
- Access sent
- Seats created
- Welcome email sent
- Complete
- Needs manual review

## Practice Seat Tracker

Use this table when a practice buys seats for employees.

| Practice | Pack Size | Seats Assigned | Seats Remaining | Practice Contact | Onboarding Lead | Next Check-In | Safe Notes |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
| Example Eye Care | 5 | 2 | 3 | admin@example.com | Jeff | 2026-07-20 | Two new technicians starting Module 1. |

## Practice Inquiry Tracker

Use this table for larger-practice conversations that start before purchase.
Do not save patient details, private employee performance notes, passwords,
card data, raw sign-in links, or secrets.

| Date | Inquiry ID | Practice | Contact Email | Estimated Learners | Timeline | Status | Next Step |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| 2026-07-13 | practice_inquiry_example | Example Eye Care | manager@example.com | 18 | Next hiring class | New | Schedule rollout call. |

## Refund And Support Tracker

Use this table when someone needs help or requests a refund.

| Request Date | Buyer Type | Buyer Name Or Practice | Category | Offer | Stripe Refund ID | Status | Follow-Up Date | Safe Reason Theme | Safe Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-07-13 | Individual | Example Learner | Sign-in help | Individual learner | N/A | Open | 2026-07-14 | Email not received | Resend sign-in after confirming email spelling. |

Category ideas:

- Sign-in help
- Access missing
- Seat assignment help
- Billing question
- Refund request
- Content question
- Practice onboarding question

## Weekly Business Review

Answer these once a week. Think of it like checking the course dashboard, but
for real customers.

| Week Of | Leads Added | Sales Closed | Revenue | Refunds | Biggest Blocker | Best Source | Next Experiment |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| 2026-07-13 | 0 | 0 | 0 | 0 | Need first outreach list | Not known yet | Email five local practices. |

Weekly questions:

- Which lead source brought the best conversations?
- Which buyer type was easiest to explain: individual learners or practices?
- Where did people get confused before buying?
- Did anyone need help after paying?
- Is there one page, email, or offer that should be clearer?
- What is the next small action that could create a sale?

## Simple Follow-Up Script

Use this when a lead is interested but has not bought yet:

```text
Hi [Name],

I wanted to follow up on OptiTech Academy. It is built for new ophthalmic
technicians, medical assistants, and practices that want a more structured
onboarding path.

The course starts with beginner-friendly eye care foundations, then helps
learners build confidence with real clinic workflows.

Would it be helpful if I sent the individual course link or the practice seat
pack option?

Thank you,
[Your Name]
```

## What Good Looks Like

You are not trying to build a giant spreadsheet. You are trying to answer four
simple business questions:

1. Who might buy?
2. Who already bought?
3. Did they get access successfully?
4. What should I do next?
