/**
 * Quiz data for all 10 modules
 * Each module has an end-of-module quiz to assess learning
 */

import type { QuizData } from "@/components/ModuleQuiz";

export const moduleQuizzes: QuizData[] = [
  {
    id: "quiz-entering-ophthalmic-care",
    title: "Module 1: Entering Ophthalmic Care",
    description:
      "Check your understanding of clinic roles, privacy, scope, and escalation.",
    day: 1,
    passingScore: 80,
    questions: [
      {
        id: "m1-q1",
        question: "A new ophthalmic technician should describe their role as:",
        type: "multiple-choice",
        options: [
          "The person who diagnoses the eye problem",
          "A clinical team member who gathers accurate information and performs starting tests",
          "The person who decides whether surgery is needed",
          "A billing specialist who schedules follow-up care",
        ],
        correctAnswer:
          "A clinical team member who gathers accurate information and performs starting tests",
        explanation:
          "Entry-level technicians support the eye-care team by gathering information, testing carefully, documenting, and escalating concerns.",
      },
      {
        id: "m1-q2",
        question:
          "If a patient asks whether their symptoms mean they have glaucoma, the safest beginner response is:",
        type: "multiple-choice",
        options: [
          "Yes, because blurry vision usually means glaucoma",
          "No, glaucoma never causes blurry vision",
          "That is a diagnosis question for the provider, and I will make sure they know your concern",
          "Search the internet with the patient",
        ],
        correctAnswer:
          "That is a diagnosis question for the provider, and I will make sure they know your concern",
        explanation:
          "The technician should acknowledge the concern, avoid diagnosis, and escalate the question to the provider.",
      },
      {
        id: "m1-q3",
        question:
          "Privacy means patient details should be discussed only with care team members who need the information for care.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Patient information should not be discussed casually or in public spaces.",
      },
      {
        id: "m1-q4",
        question: "Which situation should be escalated promptly?",
        type: "multiple-choice",
        options: [
          "A patient asks where the restroom is",
          "A patient reports sudden new flashes and floaters",
          "A patient asks for a printed appointment reminder",
          "A patient says the waiting room is cold",
        ],
        correctAnswer: "A patient reports sudden new flashes and floaters",
        explanation:
          "Sudden flashes and floaters can signal an urgent eye problem and should be brought to the provider or supervisor promptly.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-2",
    title: "Day 2: Refraction & Lensometry",
    description: "Assess your understanding of refraction principles and lensometry techniques",
    day: 2,
    passingScore: 70,
    questions: [
      {
        id: "q1-day2",
        question: "In minus cylinder notation, which of the following is a valid prescription?",
        type: "multiple-choice",
        options: ["+1.50 -0.50 x 090", "-1.50 -0.50 x 090", "-2.00 +1.50 x 180", "+0.75 +0.50 x 045"],
        correctAnswer: "-1.50 -0.50 x 090",
        explanation:
          "In minus cylinder notation, both the sphere and cylinder must be present, with the cylinder value being negative. This is the standard notation used in the United States.",
      },
      {
        id: "q2-day2",
        question: "What is the primary purpose of a lensometer?",
        type: "multiple-choice",
        options: [
          "To prescribe new glasses",
          "To measure the refractive power of lenses",
          "To perform eye surgery",
          "To diagnose refractive errors",
        ],
        correctAnswer: "To measure the refractive power of lenses",
        explanation:
          "A lensometer (or lensmeter) is an instrument that measures the refractive power of lenses in spectacles or contact lenses.",
      },
      {
        id: "q3-day2",
        question: "Hyperopia is another term for farsightedness.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Hyperopia is the condition where distant objects are seen clearly while near objects appear blurred.",
      },
      {
        id: "q4-day2",
        question: "Astigmatism is caused by an irregular curvature of the cornea or lens.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Astigmatism occurs when the cornea or lens has an irregular surface, causing blurred vision at all distances.",
      },
    ],
    timeLimit: 20,
  },
  {
    id: "quiz-day-3",
    title: "Day 3: Tonometry & Intraocular Pressure Measurement",
    description: "Master the principles and practice of measuring intraocular pressure",
    day: 3,
    passingScore: 70,
    questions: [
      {
        id: "q1-day3",
        question: "What is the normal range of intraocular pressure (IOP) in healthy eyes?",
        type: "multiple-choice",
        options: ["5-15 mmHg", "10-21 mmHg", "25-30 mmHg", "35-40 mmHg"],
        correctAnswer: "10-21 mmHg",
        explanation:
          "Normal IOP ranges from approximately 10-21 mmHg, though individual variation is significant.",
      },
      {
        id: "q2-day3",
        question: "Which tonometry method is considered the gold standard for IOP measurement?",
        type: "multiple-choice",
        options: [
          "Rebound tonometry",
          "Goldmann Applanation Tonometry",
          "Non-contact tonometry",
          "Palpation method",
        ],
        correctAnswer: "Goldmann Applanation Tonometry",
        explanation:
          "Goldmann Applanation Tonometry (GAT) is considered the gold standard because of its accuracy and reproducibility.",
      },
      {
        id: "q3-day3",
        question: "A patient's central corneal thickness affects IOP measurements.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Thinner corneas tend to give lower IOP readings, while thicker corneas give higher readings. Pachymetry can be used to correct for this.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-4",
    title: "Day 4: Slit Lamp Examination & Anterior Segment Imaging",
    description: "Evaluate your mastery of slit lamp techniques and anterior segment assessment",
    day: 4,
    passingScore: 70,
    questions: [
      {
        id: "q1-day4",
        question: "What are the three main components of the slit lamp?",
        type: "multiple-choice",
        options: [
          "Eyepiece, objective lens, and illumination system",
          "Microscope, stage, and focusing knob",
          "Lens, prism, and mirror",
          "Cornea, iris, and lens",
        ],
        correctAnswer: "Eyepiece, objective lens, and illumination system",
        explanation:
          "The slit lamp consists of these three main components that work together to provide magnified, illuminated views of the anterior segment.",
      },
      {
        id: "q2-day4",
        question: "Which of the following is NOT an anterior segment structure?",
        type: "multiple-choice",
        options: ["Cornea", "Iris", "Optic nerve", "Conjunctiva"],
        correctAnswer: "Optic nerve",
        explanation:
          "The optic nerve is a posterior segment structure. The cornea, iris, and conjunctiva are all part of the anterior segment.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-5",
    title: "Day 5: Retinal Imaging & OCT Interpretation",
    description: "Test your knowledge of retinal imaging techniques and OCT analysis",
    day: 5,
    passingScore: 70,
    questions: [
      {
        id: "q1-day5",
        question: "OCT stands for:",
        type: "multiple-choice",
        options: [
          "Optical Corneal Testing",
          "Optical Coherence Tomography",
          "Ocular Closure Technique",
          "Ophthalmic Coagulation Therapy",
        ],
        correctAnswer: "Optical Coherence Tomography",
        explanation:
          "OCT (Optical Coherence Tomography) is a non-invasive imaging technique that provides cross-sectional views of the retina.",
      },
      {
        id: "q2-day5",
        question: "What is the main advantage of ultra-widefield retinal imaging?",
        type: "multiple-choice",
        options: [
          "Higher resolution than standard imaging",
          "Ability to visualize up to 200 degrees of the retina",
          "Lower cost than traditional methods",
          "Faster image acquisition time",
        ],
        correctAnswer: "Ability to visualize up to 200 degrees of the retina",
        explanation:
          "Ultra-widefield imaging (like Optos) can capture approximately 200 degrees of retinal view without requiring pupil dilation, making it superior for peripheral retinal assessment.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-6",
    title: "Day 6: Visual Field Testing & Interpretation",
    description: "Assess your proficiency in visual field testing and defect identification",
    day: 6,
    passingScore: 70,
    questions: [
      {
        id: "q1-day6",
        question: "What is the blind spot in the visual field?",
        type: "multiple-choice",
        options: [
          "The natural physiologic area where the optic nerve exits the eye",
          "An area of reduced vision in patients with glaucoma",
          "The peripheral retina that has poor vision",
          "A defect caused by macular degeneration",
        ],
        correctAnswer: "The natural physiologic area where the optic nerve exits the eye",
        explanation:
          "The blind spot is the natural physiologic blind spot where the optic nerve exits the eye. It has no photoreceptors.",
      },
      {
        id: "q2-day6",
        question: "A scotoma is a blind spot in the visual field.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "A scotoma is any localized area of depressed or absent vision. It can be relative or absolute.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-7",
    title: "Day 7: Advanced Imaging & Specialized Procedures",
    description: "Evaluate your understanding of advanced imaging and procedural assistance",
    day: 7,
    passingScore: 70,
    questions: [
      {
        id: "q1-day7",
        question: "What does B-scan ultrasonography help visualize?",
        type: "multiple-choice",
        options: [
          "Anterior segment structures",
          "Posterior segment when media is opaque",
          "Corneal thickness",
          "Pupil size",
        ],
        correctAnswer: "Posterior segment when media is opaque",
        explanation:
          "B-scan ultrasound is valuable for imaging posterior structures when the view is obscured by dense cataracts, vitreous hemorrhage, or other opaque media.",
      },
      {
        id: "q2-day7",
        question: "Pentacam imaging is used primarily for anterior segment analysis.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Pentacam captures multiple images to create a detailed 3D map of the anterior segment, useful for corneal topography and keratoconus screening.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-8",
    title: "Day 8: Patient Communication & Soft Skills",
    description: "Test your mastery of therapeutic communication and patient interactions",
    day: 8,
    passingScore: 70,
    questions: [
      {
        id: "q1-day8",
        question: "Active listening involves:",
        type: "multiple-choice",
        options: [
          "Giving advice without asking questions",
          "Focusing on what the patient says while observing non-verbal cues",
          "Planning your response while the patient is speaking",
          "Interrupting to clarify misunderstandings",
        ],
        correctAnswer: "Focusing on what the patient says while observing non-verbal cues",
        explanation:
          "Active listening requires full attention to both verbal and non-verbal communication, without planning your response prematurely.",
      },
      {
        id: "q2-day8",
        question: "The SPIKES protocol is used for breaking bad news.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "SPIKES (Setting, Perception, Invitation, Knowledge, Emotions, Strategy) is a validated framework for delivering difficult medical information.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-9",
    title: "Day 9: Clinical Documentation & EHR Proficiency",
    description: "Assess your knowledge of medical documentation and EHR systems",
    day: 9,
    passingScore: 70,
    questions: [
      {
        id: "q1-day9",
        question: "HIPAA protects:",
        type: "multiple-choice",
        options: [
          "All medical information without exception",
          "Protected Health Information (PHI) of patients",
          "Only financial records",
          "Only imaging studies",
        ],
        correctAnswer: "Protected Health Information (PHI) of patients",
        explanation:
          "HIPAA (Health Insurance Portability and Accountability Act) protects the privacy and security of patient Protected Health Information.",
      },
      {
        id: "q2-day9",
        question: "Documentation should be completed as soon as possible after patient encounter.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Timely documentation ensures accuracy, completeness, and compliance with medical record standards.",
      },
    ],
    timeLimit: 15,
  },
  {
    id: "quiz-day-10",
    title: "Day 10: Professional Development & Career Pathways",
    description: "Test your knowledge of certification pathways and professional advancement",
    day: 10,
    passingScore: 70,
    questions: [
      {
        id: "q1-day10",
        question: "Which certification is the entry-level credential for ophthalmic professionals?",
        type: "multiple-choice",
        options: [
          "Certified Ophthalmic Technician (COT)",
          "Certified Ophthalmic Assistant (COA)",
          "Certified Ophthalmic Medical Technician (COMT)",
          "Certified Medical Assistant (CMA)",
        ],
        correctAnswer: "Certified Ophthalmic Assistant (COA)",
        explanation:
          "The COA is the entry-level certification, followed by COT, and then COMT for advanced practitioners.",
      },
      {
        id: "q2-day10",
        question: "JCAHPO is the organization that administers ophthalmic certifications.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "JCAHPO (Joint Commission on Allied Health Personnel in Ophthalmology) develops and administers the certification examinations.",
      },
      {
        id: "q3-day10",
        question: "Continuing education is required to maintain ophthalmic certifications.",
        type: "true-false",
        correctAnswer: "True",
        explanation:
          "Certified professionals must complete ongoing continuing education hours to maintain their certifications current.",
      },
    ],
    timeLimit: 20,
  },
];

export const getQuizByDay = (day: number): QuizData | undefined => {
  return moduleQuizzes.find((quiz) => quiz.day === day);
};

export const getQuizById = (quizId: string): QuizData | undefined => {
  return moduleQuizzes.find((quiz) => quiz.id === quizId);
};
