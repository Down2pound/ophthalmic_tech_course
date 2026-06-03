// Add at the top of content.ts
export const courseMetadata = {
  notebookLmId: "a4bc6fed-4059-4597-a60f-a43aa78ff3e1",
  repositoryUrl: "https://github.com/Down2pound/ophthalmic_tech_course",
  contentVersion: "1.0.0",
  lastUpdated: "2026-06-03"
};

export const courseContent = [
  {
    day: 1,
    id: "day-1-foundations",
    title: "Foundations & The Elite Workup",
    department: "Foundations of Ophthalmology & Clinic Workflow",
    summary: "An introduction to the role of the ophthalmic technician, clinic workflow, and the vital skill of gathering a complete patient history (Chief Complaint and HPI).",
    durationMinutes: 120,
    objectives: [
      "Understand the responsibilities, scope of practice, and value of the ophthalmic technician in clinical care.",
      "Learn how to gather a complete and accurate ophthalmic patient history.",
      "Differentiate between a 'bad' HPI and an 'elite' HPI by incorporating specific clinical pattern recognition details."
    ],
    keyTerms: [
      "Chief Complaint (CC)",
      "History of Present Illness (HPI)",
      "Ocular History"
    ],
    scenario: "A patient presents with a vague chief complaint of 'blurry vision'. You must use open-ended questions and pattern recognition to gather an elite HPI, determining the onset, duration, severity, and any associated symptoms.",
    managerChecklist: [
      "Verify the technician reviews the patient chart before calling them from the waiting room.",
      "Ensure the technician accurately records the chief complaint in the patient's own words."
    ],
    infographic: "Technicain Duties Overview"
  },
  {
    day: 2,
    id: "day-2-visual-acuity",
    title: "Visual Acuity & Clinic Safety",
    department: "Foundations of Ophthalmology & Clinic Workflow",
    summary: "Mastering distance and near vision testing, understanding corrected versus uncorrected vision, pinhole testing, and essential infection control practices.",
    durationMinutes: 120,
    objectives: [
      "Perform and document visual acuity accurately using the Snellen chart for distance and near vision.",
      "Apply a pinhole occluder to determine if decreased vision is due to a refractive error.",
      "Understand and execute critical infection control practices, including proper hand hygiene and tonometer tip disinfection."
    ],
    keyTerms: [
      "Pinhole Occluder",
      "OD, OS, OU (Right Eye, Left Eye, Both Eyes)",
      "Infection Control"
    ],
    scenario: "A patient reads 20/40 uncorrected on the Snellen chart. You must properly position the patient, verify the testing distance, and utilize a pinhole occluder to see if their visual acuity improves.",
    managerChecklist: [
      "Observe the technician ensuring proper lighting and patient positioning during the Snellen test.",
      "Verify the technician consistently washes hands and disinfects equipment between every patient."
    ],
    infographic: "Clinical Pattern Recognition & HPI Cheat Sheet"
  },
  {
    day: 3,
    id: "day-3-anatomy",
    title: "Basic Eye Anatomy & Physiology",
    department: "Basic Eye Anatomy & Physiology",
    summary: "Mapping the major structures of the eye, from the cornea and anterior chamber to the lens, accommodation, retina, and the visual pathway to the brain.",
    durationMinutes: 120,
    objectives: [
      "Identify the major anatomical structures of the anterior and posterior segments of the eye.",
      "Explain the mechanism of accommodation and how lens opacity leads to cataracts and presbyopia.",
      "Understand the retina's role in vision, specifically distinguishing the macula (sharp central vision) from the optic disc."
    ],
    keyTerms: [
      "Macula",
      "Optic Nerve / Optic Disc",
      "Accommodation & Presbyopia"
    ],
    scenario: "A 50-year-old patient describes their arms 'getting too short' to read menus. You must explain the anatomical process of the lens losing flexibility (presbyopia) using simple, patient-friendly terms.",
    managerChecklist: [
      "Ask the technician to accurately point out the macula and the optic disc on a fundus photograph.",
      "Verify the technician can explain the basic visual pathway from the photoreceptors to the brain."
    ],
    infographic: "Mod 2 Human Eye and Camera Anatomy"
  },
  {
    day: 4,
    id: "day-4-triage",
    title: "Triage & High-Stakes Scenarios",
    department: "Common Eye Diseases",
    summary: "Developing pattern recognition for critical ocular emergencies and utilizing dramatic red-flag checklists so technicians know exactly when to alert the physician.",
    durationMinutes: 120,
    objectives: [
      "Recognize critical red-flag symptoms such as flashes, floaters, and sudden vision loss that indicate a potential retinal detachment.",
      "Distinguish between neurological and ocular double vision (diplopia).",
      "Identify patients at risk for angle-closure glaucoma and know strictly when NOT to instill dilating drops."
    ],
    keyTerms: [
      "Retinal Detachment",
      "Angle-Closure Glaucoma",
      "Diplopia"
    ],
    scenario: "A patient calls the clinic reporting a sudden shower of new floaters and flashing lights in their peripheral vision. You must immediately triage this as a high-stakes emergency requiring urgent physician evaluation.",
    managerChecklist: [
      "Ensure the technician knows how to check for a shallow anterior chamber before ever administering dilating drops.",
      "Review the clinical protocol for immediate action when a patient reports flashes and floaters."
    ],
    infographic: "URGENT: OPHTHALMIC TECHNICIAN 'DO NOT SCREW THIS UP' RED FLAG CHECKLIST"
  },
  {
    day: 5,
    id: "day-5-exam-skills",
    title: "Exam Room Skills & Visual Fields",
    department: "Clinical Skills & Exam Room Techniques",
    summary: "Setting up the exam room, properly instilling eye drops, instructing patients on contact lens care, and mastering visual field test setup and interpretation.",
    durationMinutes: 120,
    objectives: [
      "Demonstrate the correct technique for instilling cycloplegic and mydriatic eye drops.",
      "Train patients on the safe insertion, removal, and hygiene of both soft and RGP contact lenses.",
      "Set up a Visual Field test and correctly interpret reliability metrics, including false positives and fixation losses."
    ],
    keyTerms: [
      "False Positives",
      "Fixation Losses",
      "Rigid Gas Permeable (RGP) Lenses"
    ],
    scenario: "During a SITA Standard 24-2 visual field test, you notice the patient pressing the response button repeatedly even when no stimulus is presented. You must pause the test, identify the 'trigger-happy' false positive behavior, and re-instruct the patient.",
    managerChecklist: [
      "Observe the technician instructing a patient to never 'top off' contact lens solution and to never sleep or swim in their lenses.",
      "Verify the technician reminds the patient that contact lens prescriptions expire after exactly 1 year."
    ],
    infographic: "Clinical Training Guide: Contact Lens Management and Patient Instruction"
  },
  {
    day: 6,
    id: "day-6-diagnostic-testing",
    title: "Essential Diagnostic Testing",
    department: "Essential Diagnostic Testing",
    summary: "Mastering clinical imaging devices to capture optimal results, focusing on Optical Coherence Tomography (OCT), Pachymetry, and Ultra-Widefield Imaging.",
    durationMinutes: 120,
    objectives: [
      "Understand the diagnostic purpose of OCT imaging and execute techniques to capture high-resolution cross-sectional retinal layers.",
      "Perform Pachymetry to measure Central Corneal Thickness (CCT) and understand its relationship to glaucoma.",
      "Capture a 200-degree view of the retina using Optomap ultra-widefield imaging."
    ],
    keyTerms: [
      "Optical Coherence Tomography (OCT)",
      "Central Corneal Thickness (CCT)",
      "Ultra-Widefield Imaging"
    ],
    scenario: "You are attempting to capture an OCT scan on a patient with a dense cataract. You must use troubleshooting techniques, such as moving the scan slightly away from the center to find a 'window of clarity', to achieve a readable image.",
    managerChecklist: [
      "Review an OCT scan with the technician to ensure adequate signal strength and accurate anatomical labeling.",
      "Verify the technician correctly inputs Pachymetry data into the EMR for accurate IOP adjustment."
    ],
    infographic: "Mod 3 Diagnostic Testing Guide"
  },
  {
    day: 7,
    id: "day-7-refraction",
    title: "Refraction & Slit Lamp Mechanics",
    department: "Clinical Skills & Exam Room Techniques",
    summary: "Developing practical exam room skills by mastering refraction troubleshooting and properly assisting the physician with slit lamp examinations.",
    durationMinutes: 120,
    objectives: [
      "Apply mathematical adjustments during refraction, such as adding -0.25D for shorter 10-foot exam rooms.",
      "Manage patients who are 'eating the minus' by verifying that additional minus power is actually earned through improved visual acuity.",
      "Assist the physician by properly setting up and maintaining the slit lamp biomicroscope."
    ],
    keyTerms: [
      "Refraction",
      "Spherical Equivalent",
      "Slit Lamp Biomicroscopy"
    ],
    scenario: "A patient during a manifest refraction reads the 20/20 line perfectly but asks for 'more minus' power because the letters look 'smaller and darker.' You must recognize they are accommodating and stop increasing the minus power.",
    managerChecklist: [
      "Observe the technician ensuring the patient's posture and fixation are correct at the slit lamp.",
      "Verify the technician strictly performs dry manifest refraction BEFORE applying any anesthetic or dilating drops."
    ],
    infographic: "Refraction Troubleshooting Clinical Pearls"
  },
  {
    day: 8,
    id: "day-8-tonometry",
    title: "Tonometry & Common Eye Diseases",
    department: "Common Eye Diseases",
    summary: "Learning the mechanics of common eye diseases while mastering Goldmann Applanation Tonometry (GAT), including how to project clinical confidence to anxious patients.",
    durationMinutes: 120,
    objectives: [
      "Recognize the clinical findings and symptoms of Cataracts, Glaucoma, Macular Degeneration, Diabetic Retinopathy, and Dry Eye Disease.",
      "Perform Goldmann Applanation Tonometry accurately, identifying mire errors caused by too much fluorescein (thick) or dry eye (thin).",
      "Utilize the 'fake it till you make it' philosophy to project confidence during tonometry, keeping the patient calm and steady."
    ],
    keyTerms: [
      "Goldmann Applanation Tonometry (GAT)",
      "Imbert-Fick Principle",
      "Age-Related Macular Degeneration (AMD)"
    ],
    scenario: "A highly anxious patient tenses up as you bring the Goldmann tonometer probe toward their eye. You must use active distraction techniques, talk continuously, and have them breathe audibly to safely capture their intraocular pressure.",
    managerChecklist: [
      "Ensure the technician strictly performs Goldmann tonometry AFTER refraction, as applanation warps the corneal surface.",
      "Verify the technician's GAT mires are equal, centered, and correctly overlapping during evaluation."
    ],
    infographic: "Clinical Comparison of Tonometry Methods"
  },
  {
    day: 9,
    id: "day-9-patient-care",
    title: "Professional Skills & Patient Care",
    department: "Professional Skills & Patient Care",
    summary: "Developing essential soft skills, including team communication, managing difficult patients, EMR documentation accuracy, and interacting with vulnerable populations.",
    durationMinutes: 120,
    objectives: [
      "Communicate effectively and empathetically with patients, utilizing specific protocols for those with Dementia or Alzheimer's.",
      "Navigate difficult patient encounters with professional de-escalation techniques.",
      "Maintain strict EMR accuracy, avoiding the dangerous habit of 'copying forward' outdated clinical data."
    ],
    keyTerms: [
      "EMR Accuracy",
      "Patient Empathy",
      "Dementia Protocol"
    ],
    scenario: "An elderly patient with Alzheimer's becomes confused during the visual acuity test. Instead of repeating a long string of complex instructions, you must adapt your pacing and use short, one-sentence explanations, allowing triple the normal time for comprehension.",
    managerChecklist: [
      "Audit a sample EMR chart to ensure the technician has not 'copied forward' unverified findings from a past visit.",
      "Observe the technician's communication style, ensuring they project a calm, assured professional presence."
    ],
    infographic: "Communication Flashcards"
  },
  {
    day: 10,
    id: "day-10-capstone",
    title: "Clinical Simulation Capstone",
    department: "Course Completion Project",
    summary: "The final evaluation requiring technicians to seamlessly simulate a complete patient workup from intake to final diagnostic testing.",
    durationMinutes: 180,
    objectives: [
      "Execute a complete mock patient workup, seamlessly integrating history taking, visual acuity, and tonometry.",
      "Adhere strictly to the 'Golden Rules' order of operations for clinical workups.",
      "Understand the allied ophthalmic healthcare career development pathways from COA to COT to COMT."
    ],
    keyTerms: [
      "Clinical Workup Sequence",
      "Mock Patient Simulation",
      "COA / COT / COMT Certification"
    ],
    scenario: "You are assigned a mock patient. You must independently execute a flawless workflow sequence: 1. Patient History, 2. Visual Acuity, 3. Refraction, 4. Tonometry, and finally, 5. Dilation, explaining the clinical rationale for this exact order to your proctor.",
    managerChecklist: [
      "Time the technician's mock patient workup to evaluate clinic flow efficiency.",
      "Evaluate the technician's technical accuracy, bedside manner, and infection control compliance during the simulation."
    ],
    infographic: "Clinical Cheat Sheet: Ophthalmic Workup Order of Operations"
  }
];

export const courseQuizzes = [
  {
    lessonId: "day-1-foundations",
    question: "What is the primary difference between a 'bad' HPI and an 'elite' HPI?",
    options: [
      "Length of the description",
      "Including specific pattern recognition details",
      "Using only medical abbreviations",
      "Skipping the chief complaint"
    ],
    answer: "Including specific pattern recognition details"
  },
  {
    lessonId: "day-1-foundations",
    question: "When calling a patient from the waiting room, what is the first thing a technician should do?",
    options: [
      "Check their visual acuity",
      "Review the patient chart",
      "Ask for their insurance",
      "Dilate their eyes"
    ],
    answer: "Review the patient chart"
  },
  {
    lessonId: "day-2-visual-acuity",
    question: "If a patient's vision is worse than expected on the Snellen chart, what tool should be used to determine if it is a refractive error?",
    options: [
      "Occluder",
      "Amsler Grid",
      "Pinhole",
      "Transilluminator"
    ],
    answer: "Pinhole"
  },
  {
    lessonId: "day-2-visual-acuity",
    question: "What is the first, most critical step in infection prevention in the eye clinic?",
    options: [
      "Wiping down the slit lamp",
      "Hand hygiene",
      "Changing the tonometer tip",
      "Wearing a mask"
    ],
    answer: "Hand hygiene"
  },
  {
    lessonId: "day-3-anatomy",
    question: "What anatomical structure is responsible for providing sharp central vision?",
    options: [
      "Cornea",
      "Optic Disc",
      "Macula",
      "Lens"
    ],
    answer: "Macula"
  },
  {
    lessonId: "day-3-anatomy",
    question: "Which structure carries visual signals from the eye directly to the brain?",
    options: [
      "Retina",
      "Optic Nerve",
      "Fovea",
      "Anterior Chamber"
    ],
    answer: "Optic Nerve"
  },
  {
    lessonId: "day-4-triage",
    question: "What red-flag symptom requires immediate physician notification because it may indicate a retinal detachment?",
    options: [
      "Gradual blurring of vision",
      "Sudden flashes of light and new floaters",
      "Itchy, red eyes",
      "A dull headache"
    ],
    answer: "Sudden flashes of light and new floaters"
  },
  {
    lessonId: "day-4-triage",
    question: "Under what specific clinical circumstance should a technician NEVER dilate a patient?",
    options: [
      "When the patient has a migraine",
      "When the patient has an allergy to artificial tears",
      "When there is a risk of angle-closure due to a shallow anterior chamber",
      "When the patient has dry eye disease"
    ],
    answer: "When there is a risk of angle-closure due to a shallow anterior chamber"
  },
  {
    lessonId: "day-5-exam-skills",
    question: "During a visual field test, what error indicates a 'trigger-happy' patient pressing the button without a stimulus?",
    options: [
      "Fixation Losses",
      "False Positives",
      "False Negatives",
      "Blind Spot Errors"
    ],
    answer: "False Positives"
  },
  {
    lessonId: "day-5-exam-skills",
    question: "How long is a standard contact lens prescription valid before a patient is required to have it updated?",
    options: [
      "6 Months",
      "1 Year",
      "2 Years",
      "5 Years"
    ],
    answer: "1 Year"
  },
  {
    lessonId: "day-6-diagnostic-testing",
    question: "Which essential diagnostic test specifically measures Central Corneal Thickness (CCT)?",
    options: [
      "OCT Imaging",
      "Fundus Photography",
      "Pachymetry",
      "Topography"
    ],
    answer: "Pachymetry"
  },
  {
    lessonId: "day-6-diagnostic-testing",
    question: "What OCT imaging technique can a technician use to scan through a dense cataract?",
    options: [
      "Move the scan away from the center to find a 'window of clarity'",
      "Increase the brightness of the screen",
      "Dilate the eye twice",
      "Have the patient close one eye"
    ],
    answer: "Move the scan away from the center to find a 'window of clarity'"
  },
  {
    lessonId: "day-7-refraction",
    question: "If performing a refraction in a shorter 10-foot exam room instead of a standard 20-foot room, what mathematical adjustment must be made?",
    options: [
      "Add +0.25D",
      "Add -0.25D",
      "Subtract cylinder power",
      "Change the axis by 90 degrees"
    ],
    answer: "Add -0.25D"
  },
  {
    lessonId: "day-7-refraction",
    question: "Why must a dry manifest refraction ALWAYS be completed before Goldmann Applanation Tonometry (GAT)?",
    options: [
      "Because the patient will be tired",
      "Because GAT physically flattens the cornea and the required anesthetic alters the tear film, ruining the refraction",
      "Because the slit lamp light bleaches the photoreceptors",
      "Because tonometry dilates the pupil"
    ],
    answer: "Because GAT physically flattens the cornea and the required anesthetic alters the tear film, ruining the refraction"
  },
  {
    lessonId: "day-8-tonometry",
    question: "When evaluating Goldmann Tonometry mires, what does an excessively thick mire indicate?",
    options: [
      "Severe dry eye causing an artificially low reading",
      "Too much fluorescein, causing an artificially high reading",
      "High astigmatism",
      "Perfect calibration"
    ],
    answer: "Too much fluorescein, causing an artificially high reading"
  },
  {
    lessonId: "day-8-tonometry",
    question: "What clinical finding characterizes Wet Age-Related Macular Degeneration (AMD) as opposed to Dry AMD?",
    options: [
      "Yellow lipid deposits called drusen",
      "Geographic atrophy",
      "Choroidal neovascularization leaking fluid and blood into the retina",
      "High intraocular pressure"
    ],
    answer: "Choroidal neovascularization leaking fluid and blood into the retina"
  },
  {
    lessonId: "day-9-patient-care",
    question: "What is the recommended communication protocol when examining a patient with dementia or Alzheimer's?",
    options: [
      "Speak loudly and quickly",
      "Give short, one-sentence explanations and allow triple the normal time for comprehension",
      "Explain the entire procedure in detail before starting",
      "Only speak to the family member"
    ],
    answer: "Give short, one-sentence explanations and allow triple the normal time for comprehension"
  },
  {
    lessonId: "day-9-patient-care",
    question: "Why is it clinically dangerous to routinely 'copy forward' notes in an EMR from a patient's previous visit?",
    options: [
      "It takes too much time",
      "It uses too much server storage",
      "It risks documenting clinical findings that were not actually assessed or resolved during the current visit",
      "The EMR system will crash"
    ],
    answer: "It risks documenting clinical findings that were not actually assessed or resolved during the current visit"
  },
  {
    lessonId: "day-10-capstone",
    question: "Unlike Goldmann Tonometry, which tonometry method is safe to perform BEFORE a refraction?",
    options: [
      "Tono-Pen",
      "iCare Rebound Tonometry",
      "Non-Contact Tonometry (Air-Puff)",
      "Dynamic Contour Tonometry"
    ],
    answer: "Non-Contact Tonometry (Air-Puff)"
  },
  {
    lessonId: "day-10-capstone",
    question: "What are the three core levels of IJCAHPO certification for allied ophthalmic personnel?",
    options: [
      "CMA, CNA, LPN",
      "COA, COT, COMT",
      "OSA, ROUB, CDOS",
      "OD, MD, DO"
    ],
    answer: "COA, COT, COMT"
  }
];
