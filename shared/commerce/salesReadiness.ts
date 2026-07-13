export interface BuyerPathSection {
  title: string;
  items: string[];
}

export const individualLearnerSalesPath: BuyerPathSection[] = [
  {
    title: "Best fit",
    items: [
      "Career changers exploring ophthalmic assisting or technician work.",
      "Medical assistants who want eye-care vocabulary before changing roles.",
      "New technicians who need a safer way to learn clinic flow before hands-on practice.",
    ],
  },
  {
    title: "What learners can expect",
    items: [
      "Plain-language lessons for ophthalmic terms, clinic habits, and patient communication.",
      "Knowledge checks that help learners see what they understand and what needs review.",
      "Skills Passport language for future supervisor-observed practice.",
    ],
  },
  {
    title: "After payment",
    items: [
      "Stripe confirms payment and the app creates course access for the buyer email.",
      "The learner requests a passwordless sign-in link using the same email.",
      "Module 1 can be started right away when launch gates are enabled.",
    ],
  },
];

export const practiceBuyerSalesPath: BuyerPathSection[] = [
  {
    title: "Best fit",
    items: [
      "Practice managers onboarding more than one new technician.",
      "Supervisors who want every new hire to hear the same foundation first.",
      "Clinics that need online learning paired with local hands-on observation.",
    ],
  },
  {
    title: "What practices can expect",
    items: [
      "Seat packs for assigning access to multiple learner emails.",
      "Shared language for scope, safety, patient communication, and clinic readiness.",
      "Skills Passport materials that support supervisor feedback without replacing local signoff.",
    ],
  },
  {
    title: "After payment",
    items: [
      "Stripe confirms payment and the app creates the purchased seat pack.",
      "A manager uses the protected practice-seat tool to assign learner emails.",
      "Each assigned learner signs in with their own email and starts the course.",
    ],
  },
];

export function getSalesPathItemCount(sections: BuyerPathSection[]): number {
  return sections.reduce((count, section) => count + section.items.length, 0);
}
