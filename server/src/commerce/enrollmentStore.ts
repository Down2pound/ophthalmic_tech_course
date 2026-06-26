import type { VerifiedPurchaseRecord } from "./purchaseStore";

export type EnrollmentStatus = "active" | "expired";

export interface EnrollmentRecord {
  enrollmentId: string;
  checkoutSessionId: string;
  offerId: string;
  learnerEmail: string;
  status: EnrollmentStatus;
  accessStartedAt: string;
  accessExpiresAt: string;
}

export interface EnrollmentStore {
  provisionEnrollment(
    enrollment: EnrollmentRecord
  ): { created: boolean; enrollment: EnrollmentRecord };
  listEnrollments(): EnrollmentRecord[];
  findEnrollmentsByEmail(email: string): EnrollmentRecord[];
}

function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + months);
  return nextDate;
}

export function createEnrollmentFromPurchase(
  purchase: VerifiedPurchaseRecord
): EnrollmentRecord {
  const accessStartedAt = new Date(purchase.recordedAt);
  const accessExpiresAt = addMonths(accessStartedAt, purchase.accessMonths);

  return {
    enrollmentId: `enrollment_${purchase.checkoutSessionId}`,
    checkoutSessionId: purchase.checkoutSessionId,
    offerId: purchase.offerId,
    learnerEmail: purchase.purchaserEmail.trim().toLowerCase(),
    status: "active",
    accessStartedAt: accessStartedAt.toISOString(),
    accessExpiresAt: accessExpiresAt.toISOString(),
  };
}

export function createInMemoryEnrollmentStore(): EnrollmentStore {
  const enrollmentsByCheckoutSessionId = new Map<string, EnrollmentRecord>();

  return {
    provisionEnrollment(enrollment) {
      const existing = enrollmentsByCheckoutSessionId.get(
        enrollment.checkoutSessionId
      );

      if (existing) {
        return { created: false, enrollment: existing };
      }

      enrollmentsByCheckoutSessionId.set(
        enrollment.checkoutSessionId,
        enrollment
      );

      return { created: true, enrollment };
    },
    listEnrollments() {
      return Array.from(enrollmentsByCheckoutSessionId.values());
    },
    findEnrollmentsByEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return Array.from(enrollmentsByCheckoutSessionId.values()).filter(
        (enrollment) => enrollment.learnerEmail === normalizedEmail
      );
    },
  };
}
