export interface LessonSection {
  title: string;
  paragraphs: string[];
  keyPoints?: string[];
}

export interface LessonContent {
  day: number;
  introduction: string;
  sections: LessonSection[];
  practiceChecklist: string[];
  safetyNote: string;
}

export const courseContent: LessonContent[] = [
  {
    day: 1,
    introduction:
      "A reliable ophthalmic examination begins with anatomy, careful observation, and a patient history that gives the clinician a clear picture of the problem.",
    sections: [
      {
        title: "Functional Ocular Anatomy",
        paragraphs: [
          "The cornea supplies most of the eye's refractive power, while the crystalline lens fine-tunes focus and changes shape for accommodation. The iris controls pupil size, and the retina converts light into neural signals that travel through the optic nerve.",
          "Central detail is primarily supported by the macula and fovea. Peripheral retina supports side vision and motion awareness. Anterior segment structures include the conjunctiva, cornea, anterior chamber, iris, and lens; posterior segment structures include the vitreous, retina, choroid, and optic nerve.",
        ],
        keyPoints: [
          "Cornea: primary refractive surface",
          "Lens: accommodation and fine focusing",
          "Retina: photoreception and signal conversion",
          "Optic nerve: transmission to the brain",
        ],
      },
      {
        title: "Building the Chief Complaint and History",
        paragraphs: [
          "Begin with the patient's own words, then clarify onset, location, duration, quality, severity, timing, and associated symptoms. For vision complaints, determine whether the change is monocular or binocular, constant or intermittent, and at distance, near, or both.",
          "Ask about pain, redness, discharge, photophobia, flashes, floaters, field loss, diplopia, trauma, contact lens use, prior ocular surgery, medications, allergies, and relevant systemic conditions. Document important negatives rather than relying on a generic statement that the review was normal.",
        ],
      },
      {
        title: "Patient-Centered Communication",
        paragraphs: [
          "Introduce yourself and your role, confirm the patient's identity, explain what will happen, and obtain cooperation before touching the patient or equipment. Use plain language and pause for questions.",
          "Active listening means allowing the patient to finish, reflecting the concern back, and checking understanding. Difficult interactions often improve when the concern is acknowledged before options or limits are explained.",
        ],
      },
    ],
    practiceChecklist: [
      "Confirm two patient identifiers",
      "Record the chief complaint in the patient's words",
      "Clarify onset, laterality, duration, and associated symptoms",
      "Reconcile ocular medications and allergies",
      "Escalate urgent symptoms according to office protocol",
    ],
    safetyNote:
      "Sudden vision loss, a curtain or field defect, new flashes with numerous floaters, chemical exposure, penetrating trauma, or severe pain can require urgent clinician review. Follow the practice's emergency triage policy immediately.",
  },
  {
    day: 2,
    introduction:
      "Lensometry and refraction require a consistent sequence, accurate notation, and careful confirmation that the measured result matches the patient and the spectacles being evaluated.",
    sections: [
      {
        title: "Refractive Error and Prescription Components",
        paragraphs: [
          "Sphere corrects myopia or hyperopia. Cylinder and axis describe astigmatic power and orientation. Addition power supports near work in multifocal prescriptions, while prism may be prescribed to alter image position for binocular alignment.",
          "A prescription can be written in plus- or minus-cylinder form. Transposition changes the cylinder sign, adds the original cylinder to the sphere, and rotates the axis by 90 degrees while keeping it between 1 and 180 degrees.",
        ],
      },
      {
        title: "Manual Lensometry Workflow",
        paragraphs: [
          "Focus the eyepiece before measuring. Position the lens with the temple side facing away according to the instrument's procedure, center the target, and locate the sphere and cylinder powers by bringing the principal meridians into focus.",
          "Mark the optical center and verify axis, addition, and prism when present. Repeat unexpected readings and inspect the lens for tilt, poor positioning, scratches, or progressive-corridor effects that may alter the measurement.",
        ],
        keyPoints: [
          "Focus the eyepiece first",
          "Measure sphere, cylinder, axis, and add systematically",
          "Confirm right and left lenses before documenting",
          "Do not infer prism direction without verifying the reticle",
        ],
      },
      {
        title: "Refraction Principles",
        paragraphs: [
          "Objective refraction provides a starting estimate; subjective refraction refines clarity through patient responses. Use small, controlled changes and avoid rushing a patient into inconsistent choices.",
          "Fogging can reduce accommodation, while Jackson cross-cylinder testing refines cylinder axis and power. Binocular balance and near testing are performed according to clinician direction and office protocol.",
        ],
      },
    ],
    practiceChecklist: [
      "Verify the instrument is clean and calibrated",
      "Confirm the eyewear belongs to the correct patient",
      "Measure and document OD and OS separately",
      "Repeat readings that do not match the prior prescription or visual acuity",
      "Ask for help before documenting uncertain prism or progressive measurements",
    ],
    safetyNote:
      "Technicians should perform refraction only within their training, scope, and the supervising clinician's protocol. A measured result is not automatically a final prescription.",
  },
  {
    day: 3,
    introduction:
      "Tonometry is a measurement procedure, not a diagnosis. Reliable results depend on patient positioning, instrument condition, technique, and awareness of factors that can influence the reading.",
    sections: [
      {
        title: "Understanding Intraocular Pressure",
        paragraphs: [
          "Intraocular pressure reflects the balance between aqueous humor production and outflow. Population reference ranges are often described around 10 to 21 mmHg, but risk assessment depends on the entire clinical picture rather than a single cutoff.",
          "Corneal thickness, corneal biomechanics, squeezing, breath holding, body position, prior surgery, and measurement method can affect the result. Pachymetry provides useful context, but simple correction formulas should not replace clinical interpretation.",
        ],
      },
      {
        title: "Goldmann Applanation Technique",
        paragraphs: [
          "Disinfect the prism according to manufacturer and infection-control guidance. Instill the ordered anesthetic and fluorescein, position the patient comfortably, align the cobalt-blue illumination, and advance the prism gently to the cornea.",
          "Adjust the dial until the inner edges of the fluorescein semicircles meet at the midpoint of their pulsation. Record the value, eye, time, and method. Repeat an unexpected result and notify the clinician according to protocol.",
        ],
        keyPoints: [
          "Avoid excessive fluorescein",
          "Do not press on the globe or eyelids",
          "Ask the patient to breathe normally and keep both eyes open",
          "Clean and store the prism correctly after use",
        ],
      },
      {
        title: "Common Sources of Error",
        paragraphs: [
          "Too much fluorescein can produce thick mires and an artificially high reading; too little may make the endpoint difficult to see. Tight eyelid squeezing, Valsalva, poor alignment, and pressure from the examiner's fingers can also increase the measurement.",
          "Irregular corneas, edema, scarring, and recent surgery may reduce reliability. Document the method and any difficulty rather than presenting a questionable value as definitive.",
        ],
      },
    ],
    practiceChecklist: [
      "Confirm there is no contraindication to the ordered drops",
      "Position the patient without pressure on the neck or globe",
      "Obtain a stable endpoint in each eye",
      "Record method, time, and any measurement difficulty",
      "Escalate markedly abnormal or inconsistent readings promptly",
    ],
    safetyNote:
      "Never applanate a suspected open globe, active corneal infection, or significant epithelial defect unless specifically directed by the clinician. Follow disinfection instructions exactly.",
  },
  {
    day: 4,
    introduction:
      "The slit lamp combines magnification and controlled illumination. Technicians should understand the optical sections and examination sequence even when the diagnostic interpretation belongs to the clinician.",
    sections: [
      {
        title: "Instrument Setup",
        paragraphs: [
          "Adjust the oculars for interpupillary distance and refractive error, position the patient with forehead and chin supported, and align the lateral canthus with the height marker. Begin at low illumination and magnification.",
          "The illumination arm creates diffuse, broad, narrow, or optic-section beams. The observation microscope provides binocular magnification. Coordinated movement of both systems allows structures at different depths to be examined.",
        ],
      },
      {
        title: "Systematic Anterior Segment Survey",
        paragraphs: [
          "A common sequence moves from lids and lashes to conjunctiva, cornea, anterior chamber, iris, pupil, and lens. Diffuse illumination gives orientation; a narrow beam and optic section reveal depth and layer-specific detail.",
          "Document observations using approved terminology and location. Avoid assigning a diagnosis when the finding has not been confirmed by the clinician.",
        ],
        keyPoints: [
          "Start wide and low, then narrow and magnify",
          "Move anterior to posterior in a repeatable order",
          "Use the least light needed for patient comfort",
          "Disinfect contact surfaces between patients",
        ],
      },
      {
        title: "Photography and Imaging Quality",
        paragraphs: [
          "Good anterior segment images require focus on the intended structure, appropriate exposure, correct laterality, and minimal reflection. Capture a broad orientation image before close detail when possible.",
          "Verify that the image saved to the correct patient chart and eye. Repeat blurred, clipped, or incorrectly exposed images before the patient leaves when feasible.",
        ],
      },
    ],
    practiceChecklist: [
      "Clean contact surfaces before positioning the patient",
      "Set patient height and ocular focus",
      "Use a consistent anterior-to-posterior survey",
      "Label image laterality and location correctly",
      "Return illumination and controls to a safe starting position",
    ],
    safetyNote:
      "Limit light exposure in highly photophobic patients and obtain clinician direction before manipulating an injured eye. Never force the lids open after trauma.",
  },
  {
    day: 5,
    introduction:
      "Retinal imaging is most useful when the scan is centered, free of artifact, correctly labeled, and reproducible enough to compare with prior studies.",
    sections: [
      {
        title: "Fundus and Ultra-Widefield Imaging",
        paragraphs: [
          "Explain fixation targets and blinking before capture. Align the pupil, optimize focus and exposure, and inspect the image for lashes, lids, media opacity, motion, and peripheral distortion.",
          "Ultra-widefield systems can document a much broader retinal area than standard fundus photography, but peripheral appearance may be distorted by projection. Images support the examination; they do not replace a clinically indicated dilated evaluation.",
        ],
      },
      {
        title: "OCT Acquisition",
        paragraphs: [
          "Optical coherence tomography uses reflected light to create cross-sectional images. Select the correct protocol, center the scan, maintain signal strength, and confirm segmentation boundaries before accepting the study.",
          "For macular scans, check centration on the fovea and review for motion, blink gaps, decentration, and segmentation error. For optic nerve studies, verify disc centration and scan-circle placement.",
        ],
        keyPoints: [
          "Correct patient, eye, and scan protocol",
          "Adequate signal strength",
          "Accurate centration and segmentation",
          "Comparable acquisition for follow-up studies",
        ],
      },
      {
        title: "Recognizing Artifact",
        paragraphs: [
          "Artifact can imitate disease or hide real change. Common causes include dry ocular surface, cataract, poor fixation, blinking, movement, high refractive error, and incorrect segmentation.",
          "When a result looks inconsistent with the live view or prior imaging, repeat the scan after correcting the cause and alert the clinician if reliable acquisition is not possible.",
        ],
      },
    ],
    practiceChecklist: [
      "Verify patient and laterality before capture",
      "Select the ordered scan protocol",
      "Inspect every scan for focus, motion, and segmentation",
      "Repeat correctable artifacts",
      "Document limitations that remain",
    ],
    safetyNote:
      "Do not reassure a patient that an image is normal or diagnose a finding from the acquisition screen. Image interpretation belongs to the clinician.",
  },
  {
    day: 6,
    introduction:
      "Visual field testing depends heavily on instruction, fixation, and patient reliability. A technically completed test may still be clinically unreliable.",
    sections: [
      {
        title: "Preparing the Patient",
        paragraphs: [
          "Explain that the patient should look at the central target, press only when a light is seen, blink normally, and expect some lights to be too dim to detect. Patch the non-tested eye without pressure and use the correct trial lens when required.",
          "Position the patient comfortably and monitor throughout the test. Re-instruct gently if fixation drifts, the patient begins guessing, or fatigue becomes apparent.",
        ],
      },
      {
        title: "Reliability Indicators",
        paragraphs: [
          "Fixation losses suggest the patient may not be maintaining central fixation. False positives indicate responses when no stimulus was presented or overly eager clicking. False negatives may reflect inattention, fatigue, or advanced field loss.",
          "Reliability indices must be interpreted in context. Technician observations about posture, fixation, interruptions, or understanding can be as important as the printed numbers.",
        ],
        keyPoints: [
          "Use the ordered strategy and eye",
          "Check near correction and lens position",
          "Monitor fixation and eyelid position",
          "Document coaching, restarts, and limitations",
        ],
      },
      {
        title: "Pattern Recognition Fundamentals",
        paragraphs: [
          "Glaucomatous defects often respect the horizontal meridian and may include nasal steps, arcuate defects, or paracentral loss. Neurologic defects may respect the vertical meridian. Retinal and media problems can create other localized or diffuse patterns.",
          "Technicians should recognize when a result is suspicious or inconsistent and bring it to the clinician, while avoiding independent diagnosis.",
        ],
      },
    ],
    practiceChecklist: [
      "Confirm test, eye, and correction",
      "Give standardized instructions",
      "Monitor fixation and eyelids",
      "Pause for fatigue or poor understanding",
      "Record reliability concerns and technician observations",
    ],
    safetyNote:
      "Do not repeat a long test indefinitely when the patient is exhausted or unable to understand it. Ask the clinician whether a different strategy or return visit is appropriate.",
  },
  {
    day: 7,
    introduction:
      "Advanced imaging and procedure support require strict adherence to device instructions, infection control, and the supervising clinician's protocol.",
    sections: [
      {
        title: "B-Scan Ultrasonography",
        paragraphs: [
          "B-scan ultrasound creates a two-dimensional view of intraocular and orbital structures and is especially valuable when the posterior segment cannot be visualized because of opaque media.",
          "Use the ordered probe orientation, coupling method, gain, and scan positions. Label orientation carefully and avoid excess pressure. The clinician interprets mobility, reflectivity, shape, and location.",
        ],
      },
      {
        title: "Corneal Topography and Tomography",
        paragraphs: [
          "Topography maps anterior corneal curvature; tomography evaluates anterior and posterior surfaces and corneal thickness. Accurate acquisition requires good fixation, a stable tear film, proper alignment, and minimal lid interference.",
          "Repeat scans with poor quality indicators. Contact lens wear can alter corneal shape, so follow the clinician's instructions regarding lens discontinuation before testing.",
        ],
        keyPoints: [
          "Center the patient and device precisely",
          "Check quality metrics before saving",
          "Avoid lid and lash artifact",
          "Confirm contact-lens preparation instructions",
        ],
      },
      {
        title: "Procedure and Surgical Support",
        paragraphs: [
          "Prepare the room from a standardized checklist, verify supplies and expiration dates, and maintain clean and sterile boundaries. Perform a deliberate time-out when required and document medications and materials according to policy.",
          "Never assume an unlabeled instrument or medication is correct. Stop and clarify discrepancies before the procedure continues.",
        ],
      },
    ],
    practiceChecklist: [
      "Verify the order and correct eye",
      "Inspect equipment and required supplies",
      "Use approved cleaning or sterile technique",
      "Label every image and specimen correctly",
      "Report equipment faults immediately",
    ],
    safetyNote:
      "Ultrasound pressure, medication handling, and sterile-field errors can harm a patient. Work only within demonstrated competency and direct supervision requirements.",
  },
  {
    day: 8,
    introduction:
      "Strong communication is a clinical skill. It improves cooperation, reduces misunderstandings, and helps patients feel respected even when the visit is stressful.",
    sections: [
      {
        title: "Therapeutic Communication",
        paragraphs: [
          "Use open-ended questions to begin and focused questions to clarify. Reflect the patient's concern, summarize what you heard, and use teach-back to confirm understanding.",
          "Avoid minimizing statements such as 'do not worry.' A more useful response acknowledges the concern and explains the next step: 'I can see why that feels alarming. I am going to bring this information to the clinician now.'",
        ],
      },
      {
        title: "De-escalating Conflict",
        paragraphs: [
          "Maintain a calm tone, provide physical space, listen without arguing, and identify the specific request. Set respectful boundaries when behavior becomes abusive while preserving the patient's access to appropriate clinical help.",
          "Offer realistic choices rather than promises you cannot keep. Involve a supervisor early when there is a safety concern, repeated escalation, or a request outside your authority.",
        ],
        keyPoints: [
          "Acknowledge emotion before solving",
          "Use neutral, specific language",
          "Do not mirror anger or sarcasm",
          "Document significant interactions objectively",
        ],
      },
      {
        title: "Accessibility and Cultural Humility",
        paragraphs: [
          "Use qualified interpreters when required rather than relying on children or untrained family members. Ask patients how they prefer information to be communicated and accommodate hearing, vision, mobility, or cognitive needs.",
          "Cultural humility means remaining curious and avoiding assumptions. Confirm preferences directly and preserve privacy and dignity throughout the examination.",
        ],
      },
    ],
    practiceChecklist: [
      "Introduce yourself and explain your role",
      "Use plain language and teach-back",
      "Offer qualified language assistance when needed",
      "Set respectful limits on abusive behavior",
      "Escalate safety or service-recovery concerns appropriately",
    ],
    safetyNote:
      "If a patient threatens harm, becomes physically unsafe, or appears medically unstable, follow the practice's emergency and workplace-safety procedures rather than attempting to manage the situation alone.",
  },
  {
    day: 9,
    introduction:
      "The medical record should allow another qualified professional to understand what the patient reported, what was measured, what was communicated, and what happened next.",
    sections: [
      {
        title: "Objective, Timely Documentation",
        paragraphs: [
          "Document as close to the encounter as possible. Distinguish patient statements from observed facts and avoid judgmental language. Record laterality, measurement method, units, medication concentration, and time when relevant.",
          "Do not copy forward information without verifying it. Correct errors through the approved amendment process rather than deleting or disguising the original entry.",
        ],
      },
      {
        title: "Privacy and Minimum Necessary Access",
        paragraphs: [
          "Access only the information needed for your work. Verify recipients before releasing information, protect screens and printed documents, and avoid discussing patients in public areas.",
          "Passwords must not be shared. Suspected misdirected messages, lost documents, or unauthorized access should be reported immediately through the practice's privacy and security process.",
        ],
        keyPoints: [
          "Correct patient and encounter",
          "Specific laterality and units",
          "Objective wording",
          "Approved abbreviations only",
          "Minimum necessary access",
        ],
      },
      {
        title: "Scribing and Order Accuracy",
        paragraphs: [
          "When scribing, enter information as directed and identify the author according to system policy. Do not independently create diagnoses, plans, prescriptions, or orders beyond authorized workflow.",
          "Read back unusual instructions and resolve discrepancies before signing or routing. The clinician remains responsible for reviewing and authenticating documentation according to policy.",
        ],
      },
    ],
    practiceChecklist: [
      "Confirm patient, eye, and encounter",
      "Document measurements with method and units",
      "Use objective, approved terminology",
      "Route urgent information promptly",
      "Lock the workstation when stepping away",
    ],
    safetyNote:
      "Never enter real patient information into unapproved training tools, public AI services, or personal devices. Follow the organization's HIPAA and information-security policies.",
  },
  {
    day: 10,
    introduction:
      "Professional development combines demonstrated competency, ethical practice, ongoing education, and an accurate understanding of what a certificate or credential represents.",
    sections: [
      {
        title: "Competency and Scope",
        paragraphs: [
          "Competency is task-specific. Observe the procedure, practice under supervision, demonstrate it consistently, and maintain the skill through use and review. Ask for help when a situation falls outside training or office protocol.",
          "Job titles, delegated duties, and regulatory requirements vary. Follow the supervising clinician, employer policy, and applicable law rather than assuming a course alone authorizes a procedure.",
        ],
      },
      {
        title: "Certification Pathways",
        paragraphs: [
          "Ophthalmic assisting credentials commonly progress from entry-level to more advanced certifications. Eligibility routes, examinations, continuing education, and renewal requirements can change.",
          "Use the official certifying organization's current materials when planning an application. This course supports foundational learning but does not itself award COA, COT, COMT, or another professional credential.",
        ],
        keyPoints: [
          "Verify current eligibility directly with the certifying body",
          "Maintain documentation of training and experience",
          "Use practice exams to identify weak areas",
          "Plan continuing education before renewal deadlines",
        ],
      },
      {
        title: "Career Growth Plan",
        paragraphs: [
          "Set specific goals for technical skills, communication, documentation, and certification. Ask a supervisor for measurable feedback and keep a competency log.",
          "Professional reliability includes punctuality, confidentiality, accurate work, respectful teamwork, and speaking up about safety concerns. These behaviors are as important as operating equipment.",
        ],
      },
    ],
    practiceChecklist: [
      "Review all ten module quizzes",
      "List three skills requiring supervised practice",
      "Create a 30-, 60-, and 90-day development plan",
      "Verify current certification information from official sources",
      "Print the course completion certificate after passing all modules",
    ],
    safetyNote:
      "The OptiTech Academy certificate documents completion of this educational course only. It is not licensure, board certification, JCAHPO certification, or proof of independent clinical competency.",
  },
];

export function getCourseContent(day: number): LessonContent | undefined {
  return courseContent.find((lesson) => lesson.day === day);
}
