export interface CourseOffer {
  id: string;
  name: string;
  stripeLookupKey: string;
  priceCents: number;
  currency: "usd";
  accessMonths: number;
  description: string;
  includes: string[];
  limitations: string[];
}

export const foundingLearnerOffer: CourseOffer = {
  id: "founding-learner",
  name: "Founding Learner Access",
  stripeLookupKey: "optitech_founding_learner_199",
  priceCents: 19900,
  currency: "usd",
  accessMonths: 12,
  description:
    "Self-paced founding access to OptiTech Academy Ophthalmic Technician Foundations as published modules are released.",
  includes: [
    "Published Module 1 lessons and future modules released during the access period.",
    "Knowledge checks and module assessments for published content.",
    "Downloadable checklists and Skills Passport materials when available.",
    "Certificate of completion for finished published content after requirements are met.",
  ],
  limitations: [
    "Course completion is not certification.",
    "Online completion does not verify hands-on clinical competency.",
    "The course does not guarantee employment, exam eligibility, exam success, income, or promotion.",
    "Learners must follow employer policies, provider instructions, and applicable state or local rules.",
  ],
};

export function formatOfferPrice(offer: CourseOffer): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.priceCents / 100);
}
