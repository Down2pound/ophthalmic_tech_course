import { normalizeCheckoutEmail } from "../../../shared/commerce/checkoutEmail";
import type { EnrollmentRecord, EnrollmentStore } from "./enrollmentStore";
import type {
  PracticeSeatAssignmentRecord,
  PracticeSeatPackRecord,
  PracticeSeatPackStore,
} from "./practiceSeatPackStore";
import type { PurchaseStore, VerifiedPurchaseRecord } from "./purchaseStore";

export interface BuyerSupportLookupStores {
  purchaseStore: PurchaseStore;
  enrollmentStore: EnrollmentStore;
  practiceSeatPackStore: PracticeSeatPackStore;
}

export interface BuyerSupportLookupResult {
  email: string;
  purchases: VerifiedPurchaseRecord[];
  enrollments: EnrollmentRecord[];
  practiceSeatPacks: PracticeSeatPackRecord[];
  practiceSeatAssignments: PracticeSeatAssignmentRecord[];
  summary: {
    hasPurchase: boolean;
    hasActiveEnrollment: boolean;
    hasPracticeSeatPack: boolean;
    hasPracticeSeatAssignment: boolean;
    remainingPracticeSeats: number;
  };
  recommendedActions: string[];
}

function getRemainingPracticeSeats(
  practiceSeatPacks: PracticeSeatPackRecord[]
): number {
  return practiceSeatPacks.reduce(
    (total, seatPack) =>
      total + Math.max(seatPack.totalSeats - seatPack.assignedSeats, 0),
    0
  );
}

function hasActiveEnrollment(enrollments: EnrollmentRecord[]): boolean {
  const now = Date.now();

  return enrollments.some(
    enrollment =>
      enrollment.status === "active" &&
      new Date(enrollment.accessExpiresAt).getTime() > now
  );
}

function getRecommendedSupportActions({
  purchases,
  enrollments,
  practiceSeatPacks,
  practiceSeatAssignments,
  remainingPracticeSeats,
}: {
  purchases: VerifiedPurchaseRecord[];
  enrollments: EnrollmentRecord[];
  practiceSeatPacks: PracticeSeatPackRecord[];
  practiceSeatAssignments: PracticeSeatAssignmentRecord[];
  remainingPracticeSeats: number;
}): string[] {
  const activeEnrollment = hasActiveEnrollment(enrollments);
  const actions: string[] = [];

  if (purchases.length === 0 && practiceSeatAssignments.length === 0) {
    actions.push(
      "No app-side purchase or assigned seat was found for this email. Check Stripe using the buyer email or Checkout session ID."
    );
  }

  if (
    purchases.length > 0 &&
    enrollments.length === 0 &&
    practiceSeatPacks.length === 0
  ) {
    actions.push(
      "A purchase exists, but no enrollment or practice seat pack was found. Check Stripe webhook delivery and fulfillment logs before retrying."
    );
  }

  if (enrollments.length > 0 && !activeEnrollment) {
    actions.push(
      "Enrollment records exist, but none are active. Check access expiration, refund/revocation history, and offer access dates."
    );
  }

  if (activeEnrollment) {
    actions.push(
      "Active enrollment exists. Ask the learner to request a fresh passwordless sign-in link with this same email."
    );
  }

  if (practiceSeatPacks.length > 0 && remainingPracticeSeats > 0) {
    actions.push(
      "Practice seat pack has remaining seats. Collect learner emails and assign seats through the protected practice-seat admin workflow."
    );
  }

  if (practiceSeatPacks.length > 0 && remainingPracticeSeats === 0) {
    actions.push(
      "Practice seat pack has no remaining seats. Confirm assigned learners before selling or creating another pack."
    );
  }

  if (practiceSeatAssignments.length > 0 && !activeEnrollment) {
    actions.push(
      "A practice-seat assignment exists without active learner access. Check assignment enrollment provisioning before changing records."
    );
  }

  return actions;
}

export async function lookupBuyerSupportProfile({
  email,
  stores,
}: {
  email: string;
  stores: BuyerSupportLookupStores;
}): Promise<BuyerSupportLookupResult> {
  const normalizedEmail = normalizeCheckoutEmail(email);

  if (!normalizedEmail) {
    throw new Error("A valid buyer or learner email is required.");
  }

  const [
    purchases,
    enrollments,
    practiceSeatPacks,
    allPracticeSeatAssignments,
  ] = await Promise.all([
    stores.purchaseStore.findPurchasesByEmail(normalizedEmail),
    stores.enrollmentStore.findEnrollmentsByEmail(normalizedEmail),
    stores.practiceSeatPackStore.findPracticeSeatPacksByPurchaserEmail(
      normalizedEmail
    ),
    stores.practiceSeatPackStore.listPracticeSeatAssignments(),
  ]);
  const practiceSeatAssignments = allPracticeSeatAssignments.filter(
    assignment => assignment.learnerEmail === normalizedEmail
  );
  const remainingPracticeSeats = getRemainingPracticeSeats(practiceSeatPacks);

  return {
    email: normalizedEmail,
    purchases,
    enrollments,
    practiceSeatPacks,
    practiceSeatAssignments,
    summary: {
      hasPurchase: purchases.length > 0,
      hasActiveEnrollment: hasActiveEnrollment(enrollments),
      hasPracticeSeatPack: practiceSeatPacks.length > 0,
      hasPracticeSeatAssignment: practiceSeatAssignments.length > 0,
      remainingPracticeSeats,
    },
    recommendedActions: getRecommendedSupportActions({
      purchases,
      enrollments,
      practiceSeatPacks,
      practiceSeatAssignments,
      remainingPracticeSeats,
    }),
  };
}
