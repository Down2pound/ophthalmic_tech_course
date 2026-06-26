import type { VerifiedPurchaseRecord } from "./purchaseStore";

export interface LearnerEntitlementInput {
  email: string;
  purchases: VerifiedPurchaseRecord[];
  now?: string;
}

export type LearnerEntitlement =
  | {
      hasAccess: true;
      offerId: string;
      accessStartedAt: string;
      accessExpiresAt: string;
    }
  | {
      hasAccess: false;
      reason: string;
    };

function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + months);
  return nextDate;
}

export function getLearnerEntitlement({
  email,
  purchases,
  now = new Date().toISOString(),
}: LearnerEntitlementInput): LearnerEntitlement {
  const normalizedEmail = email.trim().toLowerCase();
  const matchingPurchases = purchases
    .filter((purchase) => purchase.purchaserEmail === normalizedEmail)
    .sort(
      (left, right) =>
        new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime()
    );

  if (matchingPurchases.length === 0) {
    return {
      hasAccess: false,
      reason: "No verified purchase found.",
    };
  }

  const purchase = matchingPurchases[0];
  const accessStartedAt = new Date(purchase.recordedAt);
  const accessExpiresAt = addMonths(accessStartedAt, purchase.accessMonths);

  if (new Date(now).getTime() > accessExpiresAt.getTime()) {
    return {
      hasAccess: false,
      reason: "Verified purchase access has expired.",
    };
  }

  return {
    hasAccess: true,
    offerId: purchase.offerId,
    accessStartedAt: accessStartedAt.toISOString(),
    accessExpiresAt: accessExpiresAt.toISOString(),
  };
}
