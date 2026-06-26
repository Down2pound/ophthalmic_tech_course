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

export interface PracticePackOffer extends CourseOffer {
  seatCount: number;
  idealFor: string;
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

export const practicePackOffers: PracticePackOffer[] = [
  {
    id: "practice-five-seat-pack",
    name: "Five-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_5_seats_799",
    priceCents: 79900,
    currency: "usd",
    accessMonths: 12,
    seatCount: 5,
    idealFor: "Small practices training one hiring class or a few new team members.",
    description:
      "Practice onboarding access for up to five learners using the shared OptiTech Academy foundations course, Skills Passport, and career-readiness tools.",
    includes: [
      "Five learner seats with 12 months of access.",
      "Published course modules and future modules released during the access period.",
      "Skills Passport checklists for supervisor-led observation and signoff conversations.",
      "Career Toolkit materials learners can use for role-readiness conversations.",
    ],
    limitations: [
      "Online completion is not certification.",
      "OptiTech Academy does not independently verify hands-on competency.",
      "Supervisors remain responsible for practice-specific protocols, skill observation, and employment decisions.",
      "Practice-specific customization, live training, and implementation support require a separate agreement.",
    ],
  },
  {
    id: "practice-fifteen-seat-pack",
    name: "Fifteen-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_15_seats_1799",
    priceCents: 179900,
    currency: "usd",
    accessMonths: 12,
    seatCount: 15,
    idealFor:
      "Growing practices standardizing onboarding across multiple hires, locations, or supervisors.",
    description:
      "Expanded practice onboarding access for up to fifteen learners, designed to pair foundational online learning with supervisor-guided clinic training.",
    includes: [
      "Fifteen learner seats with 12 months of access.",
      "Shared onboarding language for clinic roles, scope, terminology, safety, and patient communication.",
      "Skills Passport materials for observed practice and supervisor feedback.",
      "Career and readiness tools that help learners discuss progress without overstating credentials.",
    ],
    limitations: [
      "Online completion is not certification.",
      "OptiTech Academy does not independently verify hands-on competency.",
      "The pack does not guarantee competency, retention, promotion, or staffing outcomes.",
      "Employer policies, provider instructions, and state or local requirements remain the practice's responsibility.",
    ],
  },
];

export function formatOfferPrice(offer: CourseOffer): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.priceCents / 100);
}
