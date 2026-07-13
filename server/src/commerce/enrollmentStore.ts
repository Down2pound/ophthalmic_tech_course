import type { VerifiedPurchaseRecord } from "./purchaseStore";
import type { StoreResult } from "./purchaseStore";
import type { PracticeSeatAssignmentRecord } from "./practiceSeatPackStore";

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
  provisionEnrollment(enrollment: EnrollmentRecord):
    | {
        created: boolean;
        enrollment: EnrollmentRecord;
      }
    | Promise<{
        created: boolean;
        enrollment: EnrollmentRecord;
      }>;
  listEnrollments(): StoreResult<EnrollmentRecord[]>;
  findEnrollmentsByEmail(email: string): StoreResult<EnrollmentRecord[]>;
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

export function createEnrollmentFromPracticeSeatAssignment(
  assignment: PracticeSeatAssignmentRecord
): EnrollmentRecord {
  return {
    enrollmentId: `enrollment_${assignment.assignmentId}`,
    checkoutSessionId: assignment.checkoutSessionId,
    offerId: assignment.offerId,
    learnerEmail: assignment.learnerEmail.trim().toLowerCase(),
    status: "active",
    accessStartedAt: assignment.accessStartedAt,
    accessExpiresAt: assignment.accessExpiresAt,
  };
}

export function createInMemoryEnrollmentStore(): EnrollmentStore {
  const enrollmentsById = new Map<string, EnrollmentRecord>();

  return {
    provisionEnrollment(enrollment) {
      const existing = enrollmentsById.get(enrollment.enrollmentId);

      if (existing) {
        return { created: false, enrollment: existing };
      }

      enrollmentsById.set(enrollment.enrollmentId, enrollment);

      return { created: true, enrollment };
    },
    listEnrollments() {
      return Array.from(enrollmentsById.values());
    },
    findEnrollmentsByEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return Array.from(enrollmentsById.values()).filter(
        enrollment => enrollment.learnerEmail === normalizedEmail
      );
    },
  };
}
