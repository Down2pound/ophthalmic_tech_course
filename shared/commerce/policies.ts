export interface CommercePolicy {
  slug:
    | "educational-limitations"
    | "refund-policy"
    | "privacy-summary"
    | "terms-summary";
  title: string;
  body: string;
}

export const commercePolicies: CommercePolicy[] = [
  {
    slug: "educational-limitations",
    title: "Educational Limitations",
    body:
      "OptiTech Academy is an educational program for foundational ophthalmic knowledge, vocabulary, clinic habits, and supervised practice preparation. Completion is not IJCAHPO certification, does not replace employer-supervised clinical training, and does not independently verify hands-on clinical competency. Learners should use Skills Passport materials with an employer, supervisor, or qualified clinical trainer.",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    body:
      "Founding learner purchases include a seven-day refund window starting at purchase, provided the learner has not completed more than one full module assessment. Refund requests should include the purchaser email and reason for the request. Practice or group purchases, custom training services, and downloaded materials may require a separate written agreement before purchase.",
  },
  {
    slug: "privacy-summary",
    title: "Privacy Summary",
    body:
      "OptiTech Academy collects only the information needed to provide access, learning progress, support, receipts, and course communication. Payment card details are handled by Stripe Checkout and are not stored by this application. Learners should not enter patient information, protected health information, or private employer data into course forms or support requests.",
  },
  {
    slug: "terms-summary",
    title: "Terms Summary",
    body:
      "Course materials are for the enrolled learner or purchasing organization and may not be copied, resold, or represented as an official certification product. OptiTech Academy may update lessons, assessments, release schedules, and policies as the founding course improves, while keeping purchase terms visible before checkout.",
  },
];
