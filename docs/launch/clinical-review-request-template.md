# OptiTech Academy Clinical Review Request Template

Use this to ask a qualified reviewer to review Module 1 before paid learners are
accepted.

Simple translation: this is the message you send when you need someone clinical
to check the first module and either approve it or tell you what must be fixed.

Do not include patient information, real chart details, protected health
information, private employee notes, Stripe keys, email API keys, database
passwords, raw sign-in links, or other secrets in the request.

## Short Email

Subject:

```text
Clinical review request for OptiTech Academy Module 1
```

Message:

```text
Hi [Reviewer Name],

I am preparing to launch OptiTech Academy, a beginner ophthalmic technician foundations course for career changers, medical assistants, and new eye-care team members.

Before accepting paid learners, I need Module 1 clinically reviewed for accuracy, beginner safety, scope boundaries, escalation language, and patient-facing wording.

Could you review the Module 1 clinical review packet and mark one of these outcomes?

1. Approved as written.
2. Approved after listed corrections are made.
3. Not approved yet; corrections required before paid launch.

Review packet:
[Attach docs/launch/module-1-clinical-review-packet.md or share the deployed /api/launch/clinical-review-packet.md link]

Please focus especially on whether the content avoids diagnosis, treatment advice, medication advice, or independent clinical authority for entry-level learners.

If you request corrections, I will keep paid enrollment closed until those are resolved.

Thank you,
[Your Name]
```

## Reviewer Decision To Record

```text
Clinical reviewer name:
Reviewer role or credentials:
Review date:
Approved module version:
Corrections required:
Corrections resolved date:
Final approval status:
```

## After Approval

Set these only in the production host dashboard after required corrections are
resolved:

```text
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=true
```

Keep `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until the reviewer approves the
final corrected version.

## Related Files

- `docs/launch/module-1-clinical-review-packet.md`
- `docs/launch/clinical-review-guide.md`
- `docs/launch/go-live-checklist.md`
