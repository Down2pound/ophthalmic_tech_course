export interface LearnerReadinessItem {
  id: string;
  label: string;
  whyItMatters: string;
}

export interface LearnerReadinessResult {
  checkedCount: number;
  totalCount: number;
  level: "strong-fit" | "possible-fit" | "pause-before-buying";
  title: string;
  guidance: string;
}

export const learnerReadinessItems: LearnerReadinessItem[] = [
  {
    id: "interested-in-eye-care",
    label: "I am interested in eye care or ophthalmic assisting.",
    whyItMatters:
      "The course is built for people exploring or starting in ophthalmic care.",
  },
  {
    id: "wants-foundations",
    label: "I want beginner-friendly foundations before deeper clinic work.",
    whyItMatters:
      "The founding course focuses on vocabulary, clinic flow, and safe starter concepts.",
  },
  {
    id: "accepts-not-certification",
    label: "I understand this is not certification.",
    whyItMatters:
      "Clear expectations protect learners from buying for the wrong reason.",
  },
  {
    id: "needs-supervision",
    label:
      "I understand hands-on clinical skills still need supervisor observation.",
    whyItMatters:
      "Online learning can prepare you, but it cannot sign off hands-on competency.",
  },
  {
    id: "has-learning-goal",
    label: "I have a learning goal for the next 30 days.",
    whyItMatters:
      "A clear goal makes self-paced learning easier to start and finish.",
  },
];

export function getLearnerReadinessResult(
  checkedItemIds: Iterable<string>
): LearnerReadinessResult {
  const selectedIds = new Set(checkedItemIds);
  const checkedCount = learnerReadinessItems.filter(item =>
    selectedIds.has(item.id)
  ).length;
  const totalCount = learnerReadinessItems.length;

  if (checkedCount >= 4) {
    return {
      checkedCount,
      totalCount,
      level: "strong-fit",
      title: "This looks like a strong fit",
      guidance:
        "You understand the course purpose, its limits, and how it can support beginner ophthalmic learning.",
    };
  }

  if (checkedCount >= 2) {
    return {
      checkedCount,
      totalCount,
      level: "possible-fit",
      title: "This may fit, but review the preview first",
      guidance:
        "Try the free preview and buyer guide before paying, especially if you are unsure about the course limits.",
    };
  }

  return {
    checkedCount,
    totalCount,
    level: "pause-before-buying",
    title: "Pause before buying",
    guidance:
      "This may not be the right purchase yet. Start with the free preview, ask a supervisor or mentor, or join the interest list.",
  };
}
