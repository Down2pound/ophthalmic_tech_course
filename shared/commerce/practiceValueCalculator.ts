import { practicePackOffers, type PracticePackOffer } from "./offers";

export interface PracticeValueEstimateInput {
  learnerCount: number;
  supervisorHourlyCost: number;
  estimatedHoursSavedPerLearner: number;
}

export interface PracticeValueEstimate {
  learnerCount: number;
  recommendedOffer?: PracticePackOffer;
  needsCustomConversation: boolean;
  estimatedSupervisorTimeValue: number;
  estimatedNetPlanningValue: number;
  estimatedValueMultiple: number | null;
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function getRecommendedPracticePack(
  learnerCount: number
): PracticePackOffer | undefined {
  const normalizedLearnerCount = Math.ceil(clampNumber(learnerCount, 1, 500));

  return practicePackOffers.find(offer => {
    return normalizedLearnerCount <= offer.seatCount;
  });
}

export function calculatePracticeValueEstimate({
  learnerCount,
  supervisorHourlyCost,
  estimatedHoursSavedPerLearner,
}: PracticeValueEstimateInput): PracticeValueEstimate {
  const normalizedLearnerCount = Math.ceil(clampNumber(learnerCount, 1, 500));
  const normalizedHourlyCost = clampNumber(supervisorHourlyCost, 0, 500);
  const normalizedHoursSaved = clampNumber(
    estimatedHoursSavedPerLearner,
    0,
    80
  );
  const recommendedOffer = getRecommendedPracticePack(normalizedLearnerCount);
  const estimatedSupervisorTimeValue =
    normalizedLearnerCount * normalizedHourlyCost * normalizedHoursSaved;
  const offerPrice = recommendedOffer ? recommendedOffer.priceCents / 100 : 0;
  const estimatedNetPlanningValue = recommendedOffer
    ? estimatedSupervisorTimeValue - offerPrice
    : estimatedSupervisorTimeValue;
  const estimatedValueMultiple =
    recommendedOffer && offerPrice > 0
      ? estimatedSupervisorTimeValue / offerPrice
      : null;

  return {
    learnerCount: normalizedLearnerCount,
    recommendedOffer,
    needsCustomConversation: !recommendedOffer,
    estimatedSupervisorTimeValue,
    estimatedNetPlanningValue,
    estimatedValueMultiple,
  };
}

export function formatPracticeValueCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
