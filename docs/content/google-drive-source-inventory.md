# Google Drive Course Source Inventory

**Audited:** June 25, 2026  
**Purpose:** Track existing OptiTech Academy source material without duplicating, losing, or accidentally publishing internal practice information.

## Handling Rules

Drive files are source material, not automatically approved production content.

Before publication, each asset must receive:

- Content owner and rights status.
- Clinical reviewer and review date.
- Source citations.
- Intended module and learner level.
- Public, practice-only, or excluded classification.
- Accessibility review.
- Duplicate/version resolution.

Do not publish patient information, staff personal details, provider credentials, internal schedules, insurance rules, proprietary practice workflows, or other Spindel-only operational material in the national course.

## Canonical Curriculum Sources

### NotebookLM Bootcamp Course Materials

- Type: NotebookLM notebook
- ID: `a4bc6fed-4059-4597-a60f-a43aa78ff3e1`
- URL: https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1
- Classification: Public-course candidate source workspace, pending export and review
- User note: All course materials can also be found here.
- Access note: NotebookLM may require the owner's logged-in Google session; external fetch may not expose the notebook contents.
- Value:
  - Central place to review and reason over the bootcamp course materials.
  - Useful for creating summaries, lesson outlines, study guides, and quiz drafts from the same source set.
- Action:
  - Export or copy source lists, summaries, and any NotebookLM-generated study material before treating it as repository content.
  - Preserve original Drive file IDs alongside any NotebookLM-derived summaries.
  - Do not publish NotebookLM summaries without checking them against the original source files and clinical review.

### Bootcamp Google Drive Folder

- Type: Google Drive folder
- ID: `1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q`
- URL: https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q
- Classification: Public-course candidate, pending rights and clinical review
- Found during follow-up audit: July 13, 2026
- Value:
  - Contains the practical bootcamp media library: videos, PDFs, audio, infographics, and reference images.
  - Includes the nested `ophthalmic-tech-bootcamp-site` folder with an older structured course app.
  - Contains exact assets that match the 10-day bootcamp sequence.
- Action:
  - Treat this folder as the current media source bucket for bootcamp assets.
  - Do not copy raw files into the public app until rights, clinical review, accessibility, and storage location are approved.
  - Prefer linking each asset to a module through repository metadata before publishing it.

### Ophthalmic Tech Bootcamp Site Course Data

- Type: Source-code file from nested Drive folder
- Parent folder: `ophthalmic-tech-bootcamp-site`
- File: `src/lib/course-data.ts`
- ID: `1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI`
- URL: https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI
- Classification: Public-course candidate, pending reconciliation
- Found during follow-up audit: July 13, 2026
- Value:
  - Defines a 10-day course map with titles, slugs, subtitles, outcomes, clinic tasks, assets, notebook pearls, and review prompts.
  - Maps videos, PDFs, audio, and images to module-like days.
  - Marks Day 1 assets as free-preview candidates.
- Action:
  - Use this as the strongest Drive-folder map for matching raw Bootcamp files to the current repository catalog.
  - Maintain the typed migration map in `shared/course/bootcampSourceMap.ts`.
  - Reconcile duplicate or older media filenames before copying anything into production storage.
  - Keep clinical review and public/practice-only classification gates before publishing.

#### Course Data Day Map

| Day | Slug | Title | Main Asset Types |
| ---: | --- | --- | --- |
| 1 | `foundations-first-patient-encounter` | Foundations and the First Patient Encounter | Videos, anatomy PDF, duties infographic |
| 2 | `anatomy-biological-camera` | Anatomy and the Biological Camera | Anatomy video, audio overview, technician blueprint PDF |
| 3 | `diagnostic-testing-map` | Essential Diagnostic Testing | Diagnostics video, slide deck PDFs, diagnostics infographic |
| 4 | `common-eye-diseases` | Common Eye Diseases and Red Flags | Disease videos, HPI cheat sheet PDF, keratoconus image |
| 5 | `lensometry-practical-guide` | Manual Lensometry | Lensometry video, lensometry PDFs, topography PDF |
| 6 | `tonometry-goldmann-and-alternatives` | Tonometry and Eye Pressure Methods | Tonometry video, tonometry infographic, Goldmann reference image |
| 7 | `refraction-troubleshooting` | Refraction Support and Troubleshooting | Refraction video, ocular diagnostic mapping PDFs |
| 8 | `exam-room-skills-pharma` | Exam Room Skills and Pharmacology | Exam-room video, soft-skills PDF |
| 9 | `professional-skills-emr` | Professional Skills and EMR Documentation | Professional-skills video, soft-skills PDF, scheduling image |
| 10 | `capstone-certification-roadmap` | Simulation Capstone and Certification Roadmap | Capstone PDF, final-test video, COA videos, career infographic |

### Practical Ophthalmic Technician Foundations Bootcamp Curriculum

- Type: Google Doc
- ID: `1zKSwNXOKUMaKipL1iL8eFO3Pc85FFoflA_5r_n0Vr3c`
- URL: https://docs.google.com/document/d/1zKSwNXOKUMaKipL1iL8eFO3Pc85FFoflA_5r_n0Vr3c
- Classification: Public-course candidate
- Value:
  - Complete ten-day JavaScript course object.
  - Objectives, key terms, scenarios, manager checklists, and infographic references.
  - Daily recap quiz bank.
- Action:
  - Treat as the strongest current structured curriculum source.
  - Reconcile it with repository curriculum definitions.
  - Clinically review every claim and assessment.

### Practical Ophthalmic Technician Foundations: 10-Day Bootcamp Syllabus

- Type: Google Doc
- ID: `1aUtdx9yVXqRBMgAT7RnREw6Cz-Wx7m1zYd4ZCWcnF0g`
- URL: https://docs.google.com/document/d/1aUtdx9yVXqRBMgAT7RnREw6Cz-Wx7m1zYd4ZCWcnF0g
- Classification: Public-course candidate
- Value: Learner-facing syllabus and module sequence.
- Action: Use for course overview and learning-path copy after alignment with the canonical catalog.

### Practical Ophthalmic Technician Foundations: 10-Day Bootcamp Syllabus PDF

- Type: PDF
- ID: `1LCK_QIn-fs1UIeKeZjKenWwqiYUFAfaz`
- URL: https://drive.google.com/file/d/1LCK_QIn-fs1UIeKeZjKenWwqiYUFAfaz
- Classification: Public-course candidate
- Action: Compare against the Google Doc and retain only the newest canonical version.

### Practical Ophthalmic Technician Foundations

- Type: Google Doc
- ID: `1THBNW5mpGad-wKrIZ9LafH17ivhhMgebMeptJf_2GAk`
- URL: https://docs.google.com/document/d/1THBNW5mpGad-wKrIZ9LafH17ivhhMgebMeptJf_2GAk
- Classification: Public-course candidate
- Value: Earlier long-form curriculum and lesson planning.
- Action: Mine unique content; do not treat as canonical when it conflicts with newer June 2026 material.

### Course Concept

- Type: Google Doc
- ID: `1ZapS6J5yz2m-ehQcnitsg3KGaivlWaMS9sDSdu0zGyc`
- URL: https://docs.google.com/document/d/1ZapS6J5yz2m-ehQcnitsg3KGaivlWaMS9sDSdu0zGyc
- Classification: Product strategy
- Value:
  - Audience and offer concepts.
  - Six-module microlearning alternative.
  - Video production plan.
  - Free mini-course and social-video marketing strategy.
- Action: Preserve the short-lesson production guidance and free-preview funnel. Superseded pricing and course-length ideas remain research notes, not final product decisions.

### Ophthalmic Curriculum JCAHPO Alignment and Database Audit

- Type: Google Doc
- ID: `1WyC0wqUkIid6VVGK9e0B42WAvoWUJ5JvyxQEhnTc8u4`
- URL: https://docs.google.com/document/d/1WyC0wqUkIid6VVGK9e0B42WAvoWUJ5JvyxQEhnTc8u4
- Classification: Standards and technical audit
- Action:
  - Review against current official IJCAHPO materials.
  - Use as a lead, not authoritative evidence.
  - Convert valid mappings into versioned repository metadata.

## Core Clinical Content Candidates

### Clinical Pattern Recognition & HPI Cheat Sheet

- Google Doc ID: `1kTVt669_kiaqS6M16ptq3AAVE9LyfptM79RxyC-GyAs`
- PDF ID: `1FFCff8cIeCmQUVaUY8oRCRF5yf2ERFCb`
- Classification: Public-course candidate
- Intended use: Patient history, triage, and documentation modules.
- Action: Use the Google Doc as editable source and the PDF only as a visual/export reference.

### Manual Lensometry Standards and Procedures

- Google Doc ID: `1SCcM9zQnqCEtxlNqeLnKZpuseLUSrgi4X2ZVsguBPfo`
- PDF ID: `12PDnzSBy6i0jq3m3eTl9CFbvR7o2lz96`
- Classification: Public-course candidate
- Intended use: Lensometry and optics module.
- Action: Clinical review, step validation, scope note, and conversion into lessons plus a supervised skill checklist.

### Refraction Troubleshooting Clinical Pearls

- Google Doc ID: `1PQ_ww_fltL4K3s-EW1yrUPLGG16dUPa1yQaDXCYpgoc`
- PDF ID: `1Lae6ec-IqCcAEMDp-m5Y_v5FvAlqscWr`
- Classification: Advanced public-course candidate
- Intended use: Medical Assistant Bridge or advanced refraction unit.
- Action:
  - Verify short-lane compensation guidance and clinical language.
  - Avoid presenting advanced refraction as an unsupervised entry-level competency.
  - Correct duochrome guidance where needed before publication.

### Contact Lens Care and Handling for Ophthalmic Technicians

- Google Doc ID: `1nSwKmnYl5xzLW9WsUDxvmP6wVDDzb3vrmo3DOoC7plA`
- PDF ID: `1_LN0maREM7PLcoqVJFRgOTq06rsAaBnH`
- Classification: Public-course candidate
- Intended use: Patient education and safety.
- Action: Verify prescription and jurisdiction-specific statements; emphasize provider direction and infection prevention.

### Soft Skills and Patient Care for Ophthalmic Professionals

- Preferred Google Doc ID: `1isxw2pU4PbV7V415mG0Mu_Pz9V1E_j6PKSFZpNz-8no`
- Duplicate Google Doc ID: `1auPWwkLSvpvTylk9O6urm17jY4mll353G4RsaAbz-JI`
- Preferred PDF ID: `14r59eVBd2IAJ7hTCvg1bYmd0rZ8s57zd`
- Duplicate PDF ID: `1slN12wTfeCQSNBl7u7Co1cH_og9rN4h6`
- Classification: Public-course candidate
- Intended use: Communication, difficult encounters, vulnerable populations, and professionalism.
- Action: Compare duplicates and designate one source of truth.

### Urgent Ophthalmic Technician Red-Flag Checklist

- Google Doc ID: `1c2f4qKIQ_0YzQfQiOnuGTeTZ_qHTNALH071pv_ojRtA`
- PDF ID: `17RaPrrF69sMDMoq5YFXbRuyQIcN3QgbF`
- Classification: Public-course candidate after renaming and review
- Intended use: Triage and escalation.
- Action:
  - Replace the current sensational title with professional safety language.
  - Require ophthalmologist review.
  - Clearly distinguish recognition and escalation from diagnosis.

## Visual and Multimedia Candidates

### Ophthalmic Technician Blueprint

- Preferred PDF ID: `1-flyo7upL6h0lcZvqSqkYbdX0mpmEEun`
- Older duplicate ID: `16jsqgMRaPwn5GS6r6aFfHMcY35UPFzsl`
- Size: Approximately 13 MB
- Classification: Visual public-course candidate
- Action: Compare versions, inspect rights and accessibility, and map reusable pages to modules.

### Clinical Simulation Capstone

- Preferred PDF ID: `1qSpEKQt_V8Ci_f1rjIR2rsQXd2e9Mvmb`
- Older duplicate ID: `15MoE6g3JPcaZzOj11JybxsbPbT_r9cin`
- Size: Approximately 10 MB
- Classification: Public-course candidate
- Intended use: Module 10 integrated simulation.
- Action: Extract scenario logic into interactive cases; retain PDF only as an optional facilitator resource.

### Diagnostic Mastery

- PDF ID: `1mGQQ2WJyxILOFieVWNpG7_OJaEmP_aQ0`
- Size: Approximately 20 MB
- Classification: Public-course candidate
- Intended use: OCT, visual fields, pachymetry, retinal imaging, and quality control.
- Action: Break into focused lessons; avoid publishing one large undifferentiated PDF as the primary experience.

### Advanced Ocular Diagnostic Masterclass

- Preferred PDF ID: `12c66UAVoRg3_whUqm0dvbm-naprP4zDX`
- Older duplicate ID: `1LgDnbIWf08gdPMHTAA6FDU1zBzsaabKq`
- Classification: Advanced-content candidate
- Action: Reserve advanced content for later modules or continuing development; do not overload career-entry lessons.

### Day 3 Diagnostic Slide Deck

- Preferred PDF ID: `1joMocZjtiZqfMoqjZU-oIxP1D00ci1yl`
- Older duplicate ID: `1MQb8WaF-X_jeFvBaw4jdJR0RdU9863AD`
- Classification: Public-course candidate
- Action: Compare against Diagnostic Mastery and remove duplicate teaching material.

### Lensometry Blueprint

- Preferred PDF ID: `1UqLkbskeGUXHxqf0UOjjkd2vFlGsU42i`
- Older duplicate ID: `1VkavmW_6F3aJ_jCvZ3bYFk9CKjsdkGYj`
- Classification: Visual public-course candidate
- Intended use: Lensometry and prescriptions.

### Precision Lens Topography

- Preferred PDF ID: `1rVTZ0EhwBPymn5Zu5z1P7vTR_hLvC1-j`
- Older duplicate ID: `1ZPMCeUtJsOrRumrJBvxXzyZC0FqSJmlu`
- Classification: Advanced visual candidate
- Action: Determine whether this is lensometry, corneal topography, or mixed content before module placement.

### The Biological Camera

- Preferred PDF ID: `1csJ5mjX4Nb2-4HdxBrcozqunp55nWTFf`
- Older duplicate ID: `1eOjJtoMa6OjBVU2tV6lyziyIqNob-rVd`
- Classification: Visual public-course candidate
- Intended use: Anatomy, physiology, and optics.

### Ophthalmic Color Standards

- PDF ID: `1hW8MefchSKA0MEMcvPzzuM_mI7NkSg6c`
- Classification: Visual design reference
- Action: Review as a potential OptiTech Academy visual-system input, not as a clinical authority.

## Practice-Only Sources

The following content may inform a configurable employer-onboarding layer but must not be included in the national core course:

- Spindel provider-specific workup rules.
- Internal scheduling and insurance guidance.
- Staff directories, nicknames, roles, and personal facts.
- Practice equipment configurations and internal escalation paths.
- Spindel-specific post-operative protocols.
- Internal quizzes about staff or local workflows.

These items belong in a private organization tenant with separate access controls and review.

## Excluded and Sensitive Sources

### Masterbuild and Knowledge Base Files

Examples:

- `Masterbuild 6.0`
- `Masterbuild 5.5`
- `knowledgeBase1.0`

These files contain extensive internal operational material and may include:

- Personal staff information.
- Provider identifiers and credentials.
- Internal schedules.
- Insurance and billing procedures.
- Internal technology, HR, and escalation details.

Classification: **Excluded from public course ingestion**

Only narrowly selected, de-identified, clinically reviewed concepts may be rewritten for the public curriculum. Never bulk-import these documents.

## Duplicate Resolution Policy

When both Google Doc and PDF versions exist:

1. Use the newest Google Doc as the editable source.
2. Use the PDF to verify visual design and exported layout.
3. Compare dates and content before deleting or archiving duplicates.
4. Record the chosen canonical ID in this inventory.
5. Do not import duplicate copies into the repository.

## Next Content Migration Steps

1. Fetch the two canonical curriculum Docs in full.
2. Convert the selected curriculum into a single typed repository catalog.
3. Map each Drive asset to one module and lesson.
4. Create a clinical-review queue.
5. Extract Modules 1-3 content into versioned Markdown or MDX.
6. Copy only approved public assets into managed course storage.
7. Preserve Drive IDs and attribution in content metadata.
8. Keep Spindel-only onboarding content in a separate private namespace.
