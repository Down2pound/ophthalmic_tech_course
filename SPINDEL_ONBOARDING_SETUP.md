# Spindel Eye Associates Employee Onboarding

## What this adds

The application now serves two programs from the same platform:

- **OptiTech Academy** remains the public paid ophthalmic technician course.
- **Spindel Eye Associates Employee Onboarding** is an internal, branded ten-module onboarding program.

Spindel employees receive the custom dashboard, lessons, quizzes, manager tracking, and certificate automatically when their account organization is `Spindel Eye Associates`.

## Internal portal

- Portal: `/spindel`
- Employee and manager login: `/spindel/login`
- Authenticated dashboard: `/course`

The Spindel routes are excluded from `robots.txt`, but confidential patient information must never be placed in the course. The lesson content is internal education, not a repository for PHI or sensitive personnel records.

## Create the manager account

Set these environment values in Render:

```text
SPINDEL_MANAGER_EMAIL=manager@your-domain.example
SPINDEL_MANAGER_PASSWORD=use-a-unique-long-password
SPINDEL_MANAGER_FIRST_NAME=First name shown on dashboard
SPINDEL_MANAGER_LAST_NAME=Last name shown on dashboard
SPINDEL_SEAT_LIMIT=100
```

When both the email and password are present, the application creates a Spindel manager account and enough private employee invitation links for the configured seat limit. No Stripe purchase is required for this internal account.

Use a unique password of at least 12 characters. Do not reuse a practice email password or shared system password.

## Enroll employees

1. Sign in at `/spindel/login` with the manager account.
2. Open **Employee Seats**.
3. Copy one unused private invitation link.
4. Send it directly to the employee.
5. The employee opens the link, enters their name and email, and creates a password.
6. Their account inherits the `Spindel Eye Associates` organization and opens the branded onboarding program.
7. The manager dashboard shows progress for every assigned employee.

Each invitation works once. Increase `SPINDEL_SEAT_LIMIT` when more links are needed.

## Completion rules

- Ten modules are required.
- Every module assessment displays an 80% requirement.
- Each assessment contains three questions, so passing requires all three answers to be correct.
- The manager dashboard displays the number of passed modules.
- The certificate unlocks after all ten modules are passed.

## Curriculum

1. Welcome to Spindel Eye Associates
2. HIPAA, Privacy & Information Security
3. Patient Arrival & Veradigm Acknowledgement
4. Technician Workflow & Documentation
5. Clinical Safety, Infection Control & Equipment
6. Patient Communication & Service Recovery
7. Referrals, Patient Handouts & Care Coordination
8. Urgent Calls, Same-Day Requests & Escalation
9. Quality, Coding Support & Accountability
10. Onboarding Readiness & Final Acknowledgement

## Important operational review

Before assigning the program to employees, a Spindel manager should review the lessons against the current:

- employee handbook
- HIPAA and information-security policies
- Veradigm acknowledgement workflow
- emergency and late-day call-routing policy
- referral and patient-handout procedures
- infection-control standards
- equipment reporting process
- coding and documentation policies

Current written policy, physician direction, and supervisor instruction always take priority over training examples.

## Recommended supervisor sign-off

The online certificate confirms completion of knowledge modules only. Maintain a separate supervisor checklist for role-specific, hands-on validation such as:

- room turnover and disinfection
- patient identification and acknowledgement
- history taking and documentation
- visual acuity and other assigned testing
- lensometry, tonometry, imaging, or visual fields where applicable
- equipment operation
- urgent-message routing
- specialty referral workflow

Do not authorize independent clinical procedures solely because an employee completed the online program.
