import type { QuizData } from "@/components/ModuleQuiz";

export const moduleQuizzes: QuizData[] = [
  {
    id: "quiz-day-1",
    title: "Day 1: Ophthalmic Foundations & Patient Communication",
    description: "Review ocular anatomy, history taking, and urgent symptom recognition.",
    day: 1,
    passingScore: 70,
    questions: [
      {
        id: "q1-day1",
        question: "Which structure provides most of the eye's refractive power?",
        type: "multiple-choice",
        options: ["Cornea", "Crystalline lens", "Retina", "Pupil"],
        correctAnswer: "Cornea",
        explanation:
          "The cornea provides most of the eye's refractive power. The crystalline lens fine-tunes focus and changes shape for accommodation.",
      },
      {
        id: "q2-day1",
        question: "The optic nerve carries visual signals from the retina toward the brain.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Retinal ganglion cell axons form the optic nerve, which transmits visual information toward central visual pathways.",
      },
      {
        id: "q3-day1",
        question: "Which symptom should be escalated promptly according to emergency triage protocol?",
        type: "multiple-choice",
        options: [
          "Stable mild itching for several months",
          "A sudden curtain or field defect",
          "A routine request for a glasses copy",
          "Long-standing stable floaters",
        ],
        correctAnswer: "A sudden curtain or field defect",
        explanation:
          "A sudden curtain, field defect, flashes with new floaters, or acute vision loss can indicate a time-sensitive ocular problem.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-2",
    title: "Day 2: Refraction & Lensometry",
    description: "Review prescription notation, lensometry, and transposition.",
    day: 2,
    passingScore: 70,
    questions: [
      {
        id: "q1-day2",
        question: "Which prescription is written in minus-cylinder notation?",
        type: "multiple-choice",
        options: [
          "+1.50 -0.50 x 090",
          "-1.50 +0.50 x 090",
          "-2.00 +1.50 x 180",
          "+0.75 +0.50 x 045",
        ],
        correctAnswer: "+1.50 -0.50 x 090",
        explanation:
          "Minus-cylinder notation uses a negative cylinder value. The sphere may be positive, negative, or plano.",
      },
      {
        id: "q2-day2",
        question: "What is the primary purpose of a lensometer?",
        type: "multiple-choice",
        options: [
          "Measure the optical power of a lens",
          "Measure intraocular pressure",
          "Photograph the retina",
          "Measure corneal thickness",
        ],
        correctAnswer: "Measure the optical power of a lens",
        explanation:
          "A lensometer measures sphere, cylinder, axis, add, and prism when present in spectacle lenses.",
      },
      {
        id: "q3-day2",
        question: "Which step is part of spherocylinder transposition?",
        type: "multiple-choice",
        options: [
          "Add the sphere and cylinder, reverse the cylinder sign, and rotate the axis 90 degrees",
          "Reverse only the sphere sign",
          "Double the cylinder and leave the axis unchanged",
          "Remove the cylinder and keep only the sphere",
        ],
        correctAnswer:
          "Add the sphere and cylinder, reverse the cylinder sign, and rotate the axis 90 degrees",
        explanation:
          "Transposition preserves the same optical power while changing between plus- and minus-cylinder notation.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-3",
    title: "Day 3: Tonometry & Intraocular Pressure Measurement",
    description: "Review IOP measurement technique and common sources of error.",
    day: 3,
    passingScore: 70,
    questions: [
      {
        id: "q1-day3",
        question: "Which range is commonly used as a population reference for IOP?",
        type: "multiple-choice",
        options: ["1-5 mmHg", "10-21 mmHg", "25-35 mmHg", "40-50 mmHg"],
        correctAnswer: "10-21 mmHg",
        explanation:
          "Approximately 10-21 mmHg is a common reference range, but diagnosis and risk assessment require more than a single cutoff.",
      },
      {
        id: "q2-day3",
        question: "Which method is traditionally considered the clinical reference standard for IOP measurement?",
        type: "multiple-choice",
        options: [
          "Goldmann applanation tonometry",
          "Confrontation testing",
          "Lensometry",
          "Keratometry",
        ],
        correctAnswer: "Goldmann applanation tonometry",
        explanation:
          "Goldmann applanation tonometry is widely used as the reference standard when technique and corneal conditions permit.",
      },
      {
        id: "q3-day3",
        question: "Corneal thickness and biomechanics can influence applanation readings.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Pachymetry provides useful context, but a simple correction formula should not replace clinical interpretation.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-4",
    title: "Day 4: Slit Lamp Examination & Anterior Segment Imaging",
    description: "Review slit lamp setup, examination sequence, and imaging quality.",
    day: 4,
    passingScore: 70,
    questions: [
      {
        id: "q1-day4",
        question: "Which systems work together during a standard slit lamp examination?",
        type: "multiple-choice",
        options: [
          "Binocular microscope, illumination system, and patient positioning assembly",
          "Retinoscope, lensometer, and keratometer",
          "Tonometer, pachymeter, and perimeter",
          "Camera, indirect ophthalmoscope, and trial frame",
        ],
        correctAnswer:
          "Binocular microscope, illumination system, and patient positioning assembly",
        explanation:
          "A slit lamp examination coordinates binocular observation, controlled illumination, and stable patient positioning.",
      },
      {
        id: "q2-day4",
        question: "Which structure is not part of the anterior segment?",
        type: "multiple-choice",
        options: ["Cornea", "Iris", "Conjunctiva", "Optic nerve"],
        correctAnswer: "Optic nerve",
        explanation:
          "The optic nerve is a posterior structure. The cornea, iris, and conjunctiva are anterior segment structures.",
      },
      {
        id: "q3-day4",
        question: "A slit lamp examination should generally begin with high illumination and maximum magnification.",
        type: "true-false",
        correctAnswer: "False",
        explanation:
          "Begin with low illumination and lower magnification for orientation and patient comfort, then increase as needed.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-5",
    title: "Day 5: Retinal Imaging & OCT Interpretation",
    description: "Review image acquisition, OCT quality, and artifact recognition.",
    day: 5,
    passingScore: 70,
    questions: [
      {
        id: "q1-day5",
        question: "OCT stands for:",
        type: "multiple-choice",
        options: [
          "Optical coherence tomography",
          "Ocular corneal testing",
          "Optic contrast therapy",
          "Ophthalmic color tracing",
        ],
        correctAnswer: "Optical coherence tomography",
        explanation:
          "OCT uses reflected light to create cross-sectional images of ocular structures.",
      },
      {
        id: "q2-day5",
        question: "Which statement about ultra-widefield imaging is correct?",
        type: "multiple-choice",
        options: [
          "It can document a broad retinal area but does not replace every dilated examination",
          "It eliminates all peripheral distortion",
          "It always provides a complete diagnosis without clinician review",
          "It is used only for anterior segment photography",
        ],
        correctAnswer:
          "It can document a broad retinal area but does not replace every dilated examination",
        explanation:
          "Ultra-widefield imaging expands retinal documentation, but image limitations and clinical indications still matter.",
      },
      {
        id: "q3-day5",
        question: "A segmentation error can create a misleading OCT thickness result.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Technicians should inspect centration, signal strength, motion, blink gaps, and segmentation before accepting a scan.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-6",
    title: "Day 6: Visual Field Testing & Interpretation",
    description: "Review patient instruction, reliability, and field patterns.",
    day: 6,
    passingScore: 70,
    questions: [
      {
        id: "q1-day6",
        question: "What produces the normal physiologic blind spot?",
        type: "multiple-choice",
        options: [
          "The optic nerve head has no photoreceptors",
          "The fovea has no cones",
          "The lens blocks peripheral light",
          "The iris covers the nasal retina",
        ],
        correctAnswer: "The optic nerve head has no photoreceptors",
        explanation:
          "The physiologic blind spot corresponds to the optic nerve head, where there are no rods or cones.",
      },
      {
        id: "q2-day6",
        question: "Frequent responses when no stimulus is presented are recorded as:",
        type: "multiple-choice",
        options: ["False positives", "False negatives", "Fixation targets", "Threshold values"],
        correctAnswer: "False positives",
        explanation:
          "High false positives may indicate guessing or overly eager responses and can make the field appear artificially good.",
      },
      {
        id: "q3-day6",
        question: "Neurologic visual field defects may respect the vertical meridian.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Defects related to chiasmal or retrochiasmal pathways often show vertical-meridian patterns, though clinician interpretation is required.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-7",
    title: "Day 7: Advanced Imaging & Specialized Procedures",
    description: "Review B-scan, corneal tomography, and procedural safety.",
    day: 7,
    passingScore: 70,
    questions: [
      {
        id: "q1-day7",
        question: "When is B-scan ultrasonography especially useful?",
        type: "multiple-choice",
        options: [
          "When opaque media prevents a clear posterior view",
          "When measuring a spectacle prescription",
          "When performing a color vision test",
          "When checking near acuity",
        ],
        correctAnswer: "When opaque media prevents a clear posterior view",
        explanation:
          "B-scan can image posterior structures when cataract, hemorrhage, or other media opacity blocks direct visualization.",
      },
      {
        id: "q2-day7",
        question: "Corneal tomography evaluates both corneal surfaces and pachymetric information.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Tomography provides three-dimensional anterior segment data, including anterior and posterior corneal surfaces and thickness distribution.",
      },
      {
        id: "q3-day7",
        question: "What should a technician do when an instrument or medication label does not match the planned procedure?",
        type: "multiple-choice",
        options: [
          "Stop and clarify before proceeding",
          "Assume the room was prepared correctly",
          "Use the item and document later",
          "Ask the patient to decide",
        ],
        correctAnswer: "Stop and clarify before proceeding",
        explanation:
          "Discrepancies should be resolved before the procedure continues. Never rely on assumptions with medications or sterile supplies.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-8",
    title: "Day 8: Patient Communication & Soft Skills",
    description: "Review active listening, teach-back, and de-escalation.",
    day: 8,
    passingScore: 70,
    questions: [
      {
        id: "q1-day8",
        question: "Active listening includes:",
        type: "multiple-choice",
        options: [
          "Listening to words and observing nonverbal cues",
          "Interrupting quickly to save time",
          "Planning a response while the patient speaks",
          "Avoiding clarification questions",
        ],
        correctAnswer: "Listening to words and observing nonverbal cues",
        explanation:
          "Active listening includes attention, reflection, clarification, and awareness of nonverbal communication.",
      },
      {
        id: "q2-day8",
        question: "Teach-back asks the patient to explain instructions in their own words.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Teach-back checks how clearly information was communicated rather than testing or embarrassing the patient.",
      },
      {
        id: "q3-day8",
        question: "Which response is appropriate when a patient becomes verbally abusive?",
        type: "multiple-choice",
        options: [
          "Set a calm boundary and involve a supervisor when needed",
          "Respond with the same tone",
          "Promise any outcome requested",
          "Discuss the patient with others in a public area",
        ],
        correctAnswer: "Set a calm boundary and involve a supervisor when needed",
        explanation:
          "Respectful boundaries protect staff and patients while preserving access to appropriate clinical assistance.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-9",
    title: "Day 9: Clinical Documentation & EHR Proficiency",
    description: "Review objective charting, privacy, and secure EHR use.",
    day: 9,
    passingScore: 70,
    questions: [
      {
        id: "q1-day9",
        question: "HIPAA privacy and security protections apply to:",
        type: "multiple-choice",
        options: [
          "Protected health information",
          "Only eyeglass prescriptions",
          "Only insurance payments",
          "Only paper records",
        ],
        correctAnswer: "Protected health information",
        explanation:
          "Protected health information can exist in electronic, paper, or verbal form and must be handled according to policy and law.",
      },
      {
        id: "q2-day9",
        question: "Which documentation approach is best?",
        type: "multiple-choice",
        options: [
          "Timely, objective, specific documentation",
          "Copying a prior note without verification",
          "Using judgmental descriptions",
          "Deleting an error without following amendment policy",
        ],
        correctAnswer: "Timely, objective, specific documentation",
        explanation:
          "The record should clearly distinguish reported symptoms, observed facts, measurements, and actions taken.",
      },
      {
        id: "q3-day9",
        question: "It is acceptable to share an EHR password with a coworker during a busy clinic.",
        type: "true-false",
        correctAnswer: "False",
        explanation:
          "Each user must use an individual account so access is secure and activity can be accurately audited.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-10",
    title: "Day 10: Professional Development & Career Pathways",
    description: "Review competency, certification scope, and career planning.",
    day: 10,
    passingScore: 70,
    questions: [
      {
        id: "q1-day10",
        question: "Which statement about ophthalmic certification is correct?",
        type: "multiple-choice",
        options: [
          "Current eligibility and renewal requirements should be verified with the official certifying organization",
          "Completing this course automatically awards COA certification",
          "A course certificate is the same as state licensure",
          "Certification requirements never change",
        ],
        correctAnswer:
          "Current eligibility and renewal requirements should be verified with the official certifying organization",
        explanation:
          "Eligibility routes, exams, and renewal requirements can change, so official current information should be used.",
      },
      {
        id: "q2-day10",
        question: "The OptiTech Academy certificate is a certificate of course completion, not a professional credential.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "The certificate documents completion of the educational program only and does not establish independent clinical competency.",
      },
      {
        id: "q3-day10",
        question: "Clinical competency is best described as:",
        type: "multiple-choice",
        options: [
          "Task-specific knowledge and performance demonstrated under appropriate supervision",
          "A skill assumed after reading about it once",
          "Permission to work outside office protocol",
          "A substitute for clinician oversight",
        ],
        correctAnswer:
          "Task-specific knowledge and performance demonstrated under appropriate supervision",
        explanation:
          "Competency should be observed, practiced, demonstrated, documented, and maintained within the applicable scope and protocol.",
      },
    ],
    timeLimit: 15,
  },
];

export const getQuizByDay = (day: number): QuizData | undefined =>
  moduleQuizzes.find((quiz) => quiz.day === day);

export const getQuizById = (quizId: string): QuizData | undefined =>
  moduleQuizzes.find((quiz) => quiz.id === quizId);
