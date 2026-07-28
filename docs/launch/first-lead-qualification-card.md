# OptiTech Academy First Lead Qualification Card

Use this when someone says they may be interested, but you are not sure whether
to send a preview link, buyer guide, practice-pack page, inquiry form, or paid
checkout path.

Simple translation: this is the "who should I talk to first?" card. It keeps
you from sending payment links too early and helps you focus on people who are
most likely to benefit from the course.

Do not write patient names, protected health information, private employee
performance details, Stripe secrets, card numbers, raw sign-in links, passwords,
or private employer details on this card.

## Step 1: Pick The Buyer Type

- Individual learner: career changer, medical assistant, new technician, or
  someone buying for themselves.
- Practice buyer: manager, owner, supervisor, trainer, or practice lead buying
  seats for a team.
- Not sure: send the first-buyer overview and ask one clarifying question.

## Step 2: Quick Fit Score

Give one point for each yes.

| Question | Yes / No |
| --- | --- |
| They are interested in ophthalmic technician foundations or onboarding. | |
| They understand this is education, not certification. | |
| They have a clear learning or onboarding reason in the next 30 to 90 days. | |
| They are willing to use the free preview or buyer guide before paying. | |
| They are not asking for medical, legal, billing, hiring, or certification advice. | |

Score:

- 0 to 1: Low fit. Send free preview only or pause.
- 2 to 3: Warm fit. Send buyer guide and ask one follow-up question.
- 4 to 5: Strong fit. Send the correct buyer path when launch readiness allows.

## Individual Learner Next Action

If paid checkout is not open yet, send:

- Free preview: `https://your-real-domain.example/preview`
- Buyer guide: `https://your-real-domain.example/buyer-guide`
- First-buyer overview: `https://your-real-domain.example/first-sale`

Ask:

```text
What would make learning ophthalmic basics feel easier for you in the next 30 days?
```

Only send the paid checkout path after go/no-go says paid checkout links are
safe to share.

## Practice Buyer Next Action

If paid checkout is not open yet, send:

- Practice packs: `https://your-real-domain.example/practice-packs`
- First-buyer overview: `https://your-real-domain.example/first-sale`
- Policies: `https://your-real-domain.example/policies`

Ask:

```text
How many new learners or cross-training staff would need onboarding in the next 3 to 6 months?
```

If they need more than 15 seats, use the custom practice conversation path
before discussing payment.

## Stop Rules

Pause the sales conversation if:

- They think this is certification.
- They ask for guaranteed job, promotion, exam, income, or clinical competency
  outcomes.
- They want patient-specific advice or private staff performance review.
- `/api/launch/readiness` is not ready and they are asking to pay now.
- You cannot clearly explain what they are buying.

## Safe Notes To Save

- Buyer type: individual / practice / not sure.
- Fit score: 0 to 5.
- Next safe action.
- Public link sent.
- Non-private question they asked.
- Follow-up date.

Do not save private medical details, private employee details, passwords, raw
access links, payment card information, or secrets.
