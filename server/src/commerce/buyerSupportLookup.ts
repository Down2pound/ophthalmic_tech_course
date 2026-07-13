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
      remainingPracticeSeats: getRemainingPracticeSeats(practiceSeatPacks),
    },
  };
}
