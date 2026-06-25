# OptiTech Academy Product Design

**Date:** June 25, 2026  
**Status:** Proposed implementation specification  
**Repository:** `Down2pound/ophthalmic_tech_course`

## Product Decision

OptiTech Academy will be an independent national training brand for people entering ophthalmic care. Spindel Eye Associates will serve as the pilot practice and subject-matter proving ground, not as the product name.

The product will serve three audiences through one shared curriculum:

1. Career changers with no prior clinical experience.
2. Medical assistants and other healthcare workers broadening into ophthalmology.
3. New ophthalmic technicians completing practice onboarding.

The primary commercial offer is an individual, self-paced career-entry program. Practices can purchase seats and add supervised skill checkoffs for onboarding.

## Product Promise

> Build the knowledge, vocabulary, clinical judgment, and supervised practice plan needed to contribute confidently in an entry-level ophthalmic assistant or technician role.

OptiTech Academy must not claim that completion:

- Confers IJCAHPO certification.
- Satisfies an IJCAHPO eligibility pathway unless formally approved.
- Replaces employer-supervised practical training.
- Guarantees employment, examination success, income, or clinical competency.

Marketing may accurately describe the curriculum as `COA-aligned` after the mapping is documented and clinically reviewed.

## Existing Work To Preserve

The current repository is the starting point. The following work remains valuable and will be evolved rather than discarded:

- React 19, Vite, TypeScript, Tailwind, shadcn/Radix, and Wouter application foundation.
- Ten-module course concept and existing curriculum prose.
- `client/src/data/curriculum.ts` module objectives, topics, durations, and difficulty levels.
- `client/src/data/quizzes.ts` quiz bank and answer explanations.
- Shared curriculum, progress, quiz, attempt, and resource types.
- `ModuleQuiz` interaction model, including answer review and retakes.
- Public curriculum page and enrollment interaction.
- Express server foundation and proposed curriculum/quiz endpoints.
- Existing Git history and the `integrate-android-app` branch.
- Android concepts for offline learning, course state, and practice onboarding.
- NotebookLM notebook as an editorial source once its materials are exported into durable repository files.

## Existing Work That Requires Reconciliation

The repository currently contains three conflicting course definitions:

1. `CURRICULUM.md` uses anatomy, history, equipment, procedures, segment examination, surgical assistance, practice management, and certification preparation.
2. `client/src/data/curriculum.ts` uses foundations, refraction, tonometry, slit lamp, retinal imaging, visual fields, advanced imaging, communication, documentation, and professional development.
3. `shared/types/curriculum.ts` repeats the older day structure.

These definitions will become one canonical course catalog. UI, APIs, assessments, and future Android clients will consume the same catalog.

The Android branch includes a fourth proposed sequence. Its strongest ideas, including triage, clinical simulation, clinic safety, and an onboarding dashboard, will be incorporated into the canonical catalog before the branch is integrated.

## Canonical Learning Architecture

The course remains a ten-module program, but `10-day` means a recommended intensive schedule rather than a fixed completion deadline. Learners may complete it at their own pace.

### Module 1: Entering Ophthalmic Care

- Ophthalmic careers and scope boundaries.
- Clinic roles and patient journey.
- Medical terminology foundations.
- Professional conduct and patient privacy.
- Career-entry orientation and baseline assessment.

### Module 2: Eye Anatomy, Physiology, and Optics

- Ocular structures and visual pathway.
- Refractive errors.
- Basic optics and prescriptions.
- Common abbreviations.
- Anatomy image identification.

### Module 3: Patient History, Communication, and Documentation

- Chief complaint and history of present illness.
- Ocular, medical, surgical, family, social, and medication history.
- Patient-centered communication.
- Documentation accuracy and pertinent negatives.
- Accessible communication and interpreter escalation.

### Module 4: Visual Acuity, Pupils, and Motility

- Distance and near acuity.
- Pinhole testing.
- Pupillary assessment.
- Extraocular motility and confrontation fields.
- Red flags requiring escalation.

### Module 5: Tonometry and Foundational Measurements

- IOP principles.
- Tonometry methods and sources of error.
- Pachymetry context.
- Keratometry, biometry, and other practice-dependent measurements.
- Infection control and equipment care.

### Module 6: Lensometry, Refraction, and Optical Skills

- Lensometer operation.
- Sphere, cylinder, axis, add power, and prism.
- Transposition concepts.
- Autorefraction and refraction support.
- Scope boundaries for entry-level learners.

### Module 7: Diagnostic Imaging and Visual Fields

- OCT acquisition and quality.
- Fundus photography and ultra-widefield imaging.
- Automated perimetry.
- Corneal topography and anterior-segment imaging.
- Artifacts, reliability, and when to repeat a test.

### Module 8: Anterior and Posterior Segment Foundations

- Slit-lamp mechanics and technician responsibilities.
- Common anterior-segment findings.
- Posterior-segment anatomy and common retinal conditions.
- Dilation workflow and medication safety.
- Urgent symptoms and escalation.

### Module 9: Procedures, Surgery, and Patient Safety

- Aseptic technique and instrument awareness.
- Minor procedure support.
- Cataract and retinal surgery workflow overview.
- Medication reconciliation and allergy checks.
- Never-events, time-outs, and patient identification.

### Module 10: Clinic Readiness and Career Launch

- Integrated patient simulations.
- Clinic flow, teamwork, and professionalism.
- Skills Passport and supervisor signoff.
- Resume, interview, and job-search preparation.
- COA, COT, and COMT pathways with current official-source links.
- Comprehensive final assessment.

## Learning Experience

Each module will use a consistent lesson structure:

1. A clear clinical or career outcome.
2. Five-to-ten-minute lessons with text, diagrams, narrated media, or demonstrations.
3. `In the clinic` context explaining why the concept matters.
4. Common mistakes and safety limits.
5. A patient-friendly explanation learners can practice.
6. A scenario-based decision exercise.
7. A knowledge check with explanation for every response.
8. A downloadable practice checklist.
9. A supervised skill checkoff when the topic requires hands-on competency.

The platform will distinguish:

- **Knowledge completed:** the learner passed the online assessment.
- **Practice observed:** the learner practiced under supervision.
- **Skill verified:** an authorized practice supervisor signed the competency.

Online completion alone must never label a hands-on skill as clinically verified.

## Learner Paths

### Career Starter

The default path includes all foundational content, career orientation, medical terminology support, and job-search tools.

### Medical Assistant Bridge

An onboarding assessment allows experienced medical assistants to shorten general healthcare topics while preserving all ophthalmic-specific content and safety assessments. Skipped lessons remain available for review.

### Practice Onboarding

Practices assign the canonical course, set target dates, invite supervisors, and add practice-specific checklists. Practice content is layered onto the core curriculum rather than forking it.

## Assessment Model

The current quiz engine is retained and expanded.

- Low-stakes checks appear throughout each lesson.
- Each module has a scored assessment.
- The passing score defaults to 80%.
- Attempts, answers, score, duration, and remediation recommendations are stored.
- Questions are tagged by objective, topic, difficulty, and COA blueprint domain.
- Scenario questions test prioritization and escalation rather than memorization alone.
- Learners receive explanations after submission.
- A randomized final assessment samples from the full bank.
- Completion requires all module assessments and the final assessment.

All existing questions will be clinically reviewed. Ambiguous or inaccurate questions will be rewritten. For example, optical notation questions must not imply that only one valid minus-cylinder prescription exists when multiple options are technically valid.

## Skills Passport

The Skills Passport tracks practical competencies separately from online lessons.

Each skill includes:

- Skill name and associated module.
- Preparation checklist.
- Observable performance criteria.
- Safety-critical errors.
- Practice attempts.
- Supervisor name, date, status, and note.
- Status: `not started`, `practicing`, `verified`, or `needs remediation`.

Individual learners who are not employed may print or share the checklist with a future employer. OptiTech Academy does not remotely verify physical skills.

## Product Surfaces

### Public Storefront

- Career-focused home page.
- Honest outcomes and audience fit.
- Course preview.
- Curriculum.
- Instructor and clinical-review information.
- Pricing and payment options.
- FAQ, limitations, refund terms, privacy policy, and terms.
- Employer purchasing route.

Unsupported social-proof numbers, artificial scarcity, and unverified success claims will be removed.

### Learner Application

- Account onboarding and baseline assessment.
- Personalized path.
- Dashboard with next lesson, progress, scores, and skills.
- Module and lesson player.
- Assessments and remediation.
- Skills Passport.
- Career toolkit.
- Completion certificate and verification page.

### Practice Manager Application

- Seat purchase and invitation.
- Learner roster.
- Assignment and due dates.
- Knowledge progress.
- Skills Passport review.
- Supervisor checkoffs.
- Exportable completion and competency report.

### Content Administration

Initial content can remain repository-managed to reduce complexity. The data model must support a future authoring interface, but a full CMS is not required for the first commercial release.

## Commercial Model

Initial pricing will be tested rather than presented as proven market pricing.

### Individual

- Free career and anatomy preview.
- Founding learner offer: `$199` one-time.
- Future standard price target: `$249-$299`.
- Twelve months of access.
- Optional installment plan.

### Practice

- Five-seat onboarding pack: `$799`.
- Fifteen-seat onboarding pack: `$1,799`.
- Larger practices: annual quote.
- Practice-specific curriculum and implementation support are separate services.

Payments must use hosted Stripe Checkout. Payment card data will never be stored by the application.

## Technical Architecture

The first commercial release remains a TypeScript monorepo.

### Frontend

- React 19 and Vite.
- Tailwind CSS and shadcn/Radix.
- Wouter may remain for routing unless route requirements outgrow it.
- TanStack Query for server state.
- React Hook Form and Zod for forms.

### Backend

- Express API using the existing server entry point.
- PostgreSQL for users, organizations, enrollments, progress, assessments, skills, and purchases.
- Drizzle ORM for schema and migrations.
- Session-based authentication with secure, HTTP-only cookies.
- Passwordless email sign-in for learners and managers in the first release.
- Stripe Checkout and verified webhooks for access provisioning.
- Transactional email provider for sign-in links, receipts, invitations, reminders, and completion.

### Content

- One typed, versioned course catalog shared by client and server.
- Lesson copy stored as MDX or structured Markdown in the repository.
- Media stored in a production object store or video platform.
- Every source asset receives attribution, rights status, and clinical-review metadata.

### Deployment

- Web application deployed through a supported Node hosting platform.
- Managed PostgreSQL.
- Environment-specific secrets.
- Automated preview and production builds.
- Error reporting and privacy-conscious product analytics.

## Data Boundaries

Core entities:

- `User`
- `Organization`
- `OrganizationMembership`
- `Course`
- `Module`
- `Lesson`
- `Enrollment`
- `LessonProgress`
- `Assessment`
- `Question`
- `AssessmentAttempt`
- `Skill`
- `SkillAttempt`
- `SkillVerification`
- `Purchase`
- `Certificate`
- `ContentReview`

Course content and assessment definitions are versioned. A learner's attempt references the exact version used at submission.

## Content Governance

Every clinical lesson must include:

- Author.
- Clinical reviewer.
- Review date.
- Source list.
- Intended learner level.
- Scope and safety note.
- Next review date.

Current official sources take priority for certification pathways, medication warnings, and professional requirements. NotebookLM is a research and drafting workspace, not the production content database.

Before NotebookLM material is published, it must be exported into the repository, attributed, edited, and reviewed. The product must remain maintainable if NotebookLM access changes.

## Existing Android Branch

The `integrate-android-app` branch will not be discarded or merged immediately.

The web application is the first revenue-producing client because it supports checkout, desktop learning, manager workflows, and faster iteration. The Android app becomes a later client after the API, authentication, catalog, and progress contracts stabilize.

Before integration:

- Remove default admin credentials from documentation and code.
- Replace speculative sync claims with implemented API contracts.
- Align the mobile curriculum with the canonical catalog.
- Add missing Android project files and tests.

## First Commercial Milestone

The first release is not all ten modules at maximum production depth. It is a complete purchase-to-learning experience with enough excellent content to prove value.

It includes:

- Public storefront and truthful offer.
- Individual purchase.
- Learner authentication and onboarding assessment.
- Learner dashboard.
- Production-quality Modules 1-3.
- Existing Modules 4-10 presented as clearly scheduled course content only after their lessons are ready.
- Persistent progress.
- Expanded assessments for Modules 1-3.
- Skills Passport foundation.
- Career toolkit.
- Completion logic limited to published content.
- Practice seat purchase and learner invitations.
- Basic practice roster and progress view.

The release must not sell access to empty modules as if they were complete. A founding cohort may be sold only with a clear delivery schedule and refund terms.

## Quality and Safety Gates

No production release until:

- All visible claims have an evidence source or are removed.
- All published clinical content has reviewer metadata.
- Payment and webhook flows are tested.
- Authorization prevents learners from accessing other learners' records.
- Practice managers can access only their organization.
- Assessment scores are calculated server-side.
- Quiz answer keys are never sent before submission.
- Accessibility is tested for keyboard navigation, contrast, labels, and text scaling.
- Mobile and desktop purchase and learning flows pass end-to-end testing.
- Certificate language accurately states completion, not certification.
- Terms, privacy, refund, and educational limitations are visible before purchase.

## Success Measures

First-cohort measures:

- Preview-to-purchase conversion.
- Module 1 start rate.
- Module 1 and Module 3 completion rates.
- Assessment improvement between first and best attempt.
- Time to first practice checkoff.
- Learner confidence change using the same pre/post scale.
- Practice-manager satisfaction.
- Refund and support-request reasons.
- Job interview and placement outcomes reported voluntarily and labeled as self-reported.

No public success-rate claim will be made until a defined sample, period, and calculation can be published.

## Explicitly Deferred

- Formal IJCAHPO approval or accreditation.
- Native iOS application.
- Full Android release.
- Live cohort scheduling.
- AI-generated clinical advice.
- Public learner community.
- Full visual content authoring CMS.
- Continuing-education credit.
- Automated remote verification of physical skills.

These may be evaluated after the first commercial cohort validates demand and learning outcomes.

