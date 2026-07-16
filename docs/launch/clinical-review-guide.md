# OptiTech Academy Clinical Review Guide

Use this guide to complete the Module 1 clinical review gate before accepting
paid learners. This is the safety review that checks whether the educational
content is accurate, beginner-appropriate, and clear about scope limits.

## What To Review

Download or generate the Module 1 review packet:

```text
docs/launch/module-1-clinical-review-packet.md
```

After deployment, the same packet is also available at:

```text
/api/launch/clinical-review-packet.md
```

The launch evidence bundle also includes:

```text
module-1-clinical-review-packet.md
```

The reviewer should read the lesson outcomes, lesson body, clinic context,
patient-friendly script, scenario, common mistakes, scope note, sources, and
review questions.

## Who Should Review

Use an appropriate clinical reviewer, such as an ophthalmologist, optometrist,
senior ophthalmic technician, trainer, or other qualified eye-care leader who
can judge whether Module 1 is accurate and safe for entry-level learners.

The reviewer should check:

- Clinical accuracy.
- Scope boundaries for entry-level learners.
- Escalation and patient-safety language.
- Patient-facing scripts.
- Whether any correction is required before paid launch.

## Required Production Values

After the reviewer approves Module 1, set these in the production host
dashboard:

```text
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=true
```

Keep `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until required corrections are
resolved.

## What To Save With Launch Records

Save safe evidence that shows:

- Reviewer name.
- Reviewer role or credentials.
- Review date.
- Approved module version.
- Corrections requested, if any.
- Corrections resolved date, if any.
- Final approval status.

Do not save patient information, real chart details, protected health
information, private employer data, secret keys, raw sign-in links, session
cookies, or database passwords in the review record.

## When To Repeat Review

Repeat clinical review when:

- Lesson clinical content changes.
- Scope language changes.
- Patient-facing scripts change.
- New clinical procedures, medications, diagnoses, or safety warnings are added.
- The course moves from founding Module 1 content to more advanced modules.

If clinical review is no longer current, set
`MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until review is updated.
