export interface CommercePolicy {
  slug:
    | "educational-limitations"
    | "refund-policy"
    | "privacy-summary"
    | "terms-summary"
    | "practice-pack-terms"
    | "support-expectations";
  title: string;
  body: string;
}

export interface BuyerSupportContact {
  email: string;
  subject: string;
  emailBody: string;
  safeDetails: string[];
  neverSend: string[];
  expectedUse: string;
}

export const buyerSupportContact: BuyerSupportContact = {
  email: "jeff.chapin@spindeleye.com",
  subject: "OptiTech Academy support request",
  emailBody: [
    "Hi Jeff,",
    "",
    "I need help with OptiTech Academy.",
    "",
    "Purchaser or learner email used at checkout:",
    "Request type: access / refund review / practice seats / course navigation / technical issue",
    "Approximate purchase date or Stripe receipt date:",
    "Public error message, if any:",
    "Short description:",
    "",
    "I understand I should not send patient information, card numbers, passwords, raw sign-in links, session cookies, or private employee details.",
  ].join("\n"),
  safeDetails: [
    "Purchaser or learner email used at checkout.",
    "Whether the request is about access, refund review, practice seats, or course navigation.",
    "Approximate purchase date or Stripe receipt email date.",
    "A short description of the public error message, if one appeared.",
  ],
  neverSend: [
    "Patient information or protected health information.",
    "Card numbers, Stripe secrets, passwords, raw sign-in links, or session cookies.",
    "Private employee performance details or private employer policy documents.",
  ],
  expectedUse:
    "Use support for account access, purchase questions, refund review, course navigation, and basic technical issues.",
};

export const commercePolicies: CommercePolicy[] = [
  {
    slug: "educational-limitations",
    title: "Educational Limitations",
    body: "OptiTech Academy is an educational program for foundational ophthalmic knowledge, vocabulary, clinic habits, and supervised practice preparation. Completion is not IJCAHPO certification, does not replace employer-supervised clinical training, and does not independently verify hands-on clinical competency. Learners should use Skills Passport materials with an employer, supervisor, or qualified clinical trainer.",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    body: "Founding learner purchases include a seven-day refund window starting at purchase, provided the learner has not completed more than one full module assessment. Refund requests should include the purchaser email and reason for the request. Practice or group purchases, custom training services, and downloaded materials may require a separate written agreement before purchase.",
  },
  {
    slug: "privacy-summary",
    title: "Privacy Summary",
    body: "OptiTech Academy collects only the information needed to provide access, learning progress, support, receipts, and course communication. Payment card details are handled by Stripe Checkout and are not stored by this application. Learners and managers should not enter patient information, protected health information, chart details, private employer data, or real clinical cases into course forms, quiz answers, support requests, or practice-seat notes.",
  },
  {
    slug: "terms-summary",
    title: "Terms Summary",
    body: "Course materials are for the enrolled learner or purchasing organization and may not be copied, resold, or represented as an official certification product. OptiTech Academy may update lessons, assessments, release schedules, and policies as the founding course improves, while keeping purchase terms visible before checkout.",
  },
  {
    slug: "practice-pack-terms",
    title: "Practice Pack Terms",
    body: "Practice packs provide the purchased number of learner seats for the access period shown at checkout. A seat should be assigned to one learner email and should not be shared across multiple employees. Practice managers remain responsible for local onboarding, supervision, job descriptions, clinical policies, patient safety procedures, and any required hands-on signoff. Custom implementation help, live training, private content, or practice-specific policy writing is not included unless a separate written agreement says so.",
  },
  {
    slug: "support-expectations",
    title: "Support Expectations",
    body: "Support is intended for account access, purchase questions, course navigation, and basic technical issues. Support does not replace clinical supervision, employer policy decisions, medical guidance, legal guidance, billing guidance, or emergency help. Learners should contact their supervisor for workplace procedures and should never send patient details when asking for support.",
  },
];
