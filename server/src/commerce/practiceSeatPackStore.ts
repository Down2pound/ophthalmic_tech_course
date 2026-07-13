import type { VerifiedPurchaseRecord } from "./purchaseStore";
import type { StoreResult } from "./purchaseStore";

export type PracticeSeatPackStatus = "active" | "expired";
export type PracticeSeatAssignmentStatus = "active" | "revoked";

export interface PracticeSeatPackRecord {
  seatPackId: string;
  checkoutSessionId: string;
  offerId: string;
  purchaserEmail: string;
  totalSeats: number;
  assignedSeats: number;
  status: PracticeSeatPackStatus;
  accessStartedAt: string;
  accessExpiresAt: string;
}

export interface PracticeSeatAssignmentRecord {
  assignmentId: string;
  seatPackId: string;
  checkoutSessionId: string;
  offerId: string;
  learnerEmail: string;
  status: PracticeSeatAssignmentStatus;
  assignedAt: string;
  accessStartedAt: string;
  accessExpiresAt: string;
}

export interface PracticeSeatAssignmentInput {
  seatPackId: string;
  learnerEmail: string;
  assignedAt?: string;
}

export type PracticeSeatAssignmentResult =
  | {
      assigned: true;
      assignment: PracticeSeatAssignmentRecord;
      seatPack: PracticeSeatPackRecord;
    }
  | {
      assigned: false;
      reason: string;
    };

export interface PracticeSeatPackStore {
  provisionPracticeSeatPack(seatPack: PracticeSeatPackRecord):
    | {
        created: boolean;
        seatPack: PracticeSeatPackRecord;
      }
    | Promise<{
        created: boolean;
        seatPack: PracticeSeatPackRecord;
      }>;
  listPracticeSeatPacks(): StoreResult<PracticeSeatPackRecord[]>;
  findPracticeSeatPacksByPurchaserEmail(
    email: string
  ): StoreResult<PracticeSeatPackRecord[]>;
  assignPracticeSeat(
    input: PracticeSeatAssignmentInput
  ): StoreResult<PracticeSeatAssignmentResult>;
  listPracticeSeatAssignments(): StoreResult<PracticeSeatAssignmentRecord[]>;
}

function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + months);
  return nextDate;
}

export function createPracticeSeatPackFromPurchase(
  purchase: VerifiedPurchaseRecord
): PracticeSeatPackRecord | null {
  if (!purchase.seatCount) return null;

  const accessStartedAt = new Date(purchase.recordedAt);
  const accessExpiresAt = addMonths(accessStartedAt, purchase.accessMonths);

  return {
    seatPackId: `seatpack_${purchase.checkoutSessionId}`,
    checkoutSessionId: purchase.checkoutSessionId,
    offerId: purchase.offerId,
    purchaserEmail: purchase.purchaserEmail.trim().toLowerCase(),
    totalSeats: purchase.seatCount,
    assignedSeats: 0,
    status: "active",
    accessStartedAt: accessStartedAt.toISOString(),
    accessExpiresAt: accessExpiresAt.toISOString(),
  };
}

export function createInMemoryPracticeSeatPackStore(): PracticeSeatPackStore {
  const seatPacksByCheckoutSessionId = new Map<
    string,
    PracticeSeatPackRecord
  >();
  const seatPacksById = new Map<string, PracticeSeatPackRecord>();
  const assignmentsById = new Map<string, PracticeSeatAssignmentRecord>();

  function getAssignmentId(seatPackId: string, learnerEmail: string): string {
    const safeEmail = learnerEmail.replace(/[^a-z0-9]/g, "_");
    return `seat_${seatPackId}_${safeEmail}`;
  }

  return {
    provisionPracticeSeatPack(seatPack) {
      const existing = seatPacksByCheckoutSessionId.get(
        seatPack.checkoutSessionId
      );

      if (existing) {
        return { created: false, seatPack: existing };
      }

      seatPacksByCheckoutSessionId.set(seatPack.checkoutSessionId, seatPack);
      seatPacksById.set(seatPack.seatPackId, seatPack);
      return { created: true, seatPack };
    },
    listPracticeSeatPacks() {
      return Array.from(seatPacksByCheckoutSessionId.values());
    },
    findPracticeSeatPacksByPurchaserEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return Array.from(seatPacksByCheckoutSessionId.values()).filter(
        seatPack => seatPack.purchaserEmail === normalizedEmail
      );
    },
    assignPracticeSeat({
      seatPackId,
      learnerEmail,
      assignedAt = new Date().toISOString(),
    }) {
      const normalizedEmail = learnerEmail.trim().toLowerCase();
      const seatPack = seatPacksById.get(seatPackId);

      if (!seatPack) {
        return {
          assigned: false,
          reason: "Practice seat pack was not found.",
        };
      }

      if (seatPack.status !== "active") {
        return {
          assigned: false,
          reason: "Practice seat pack is not active.",
        };
      }

      const assignmentId = getAssignmentId(
        seatPack.seatPackId,
        normalizedEmail
      );
      const existing = assignmentsById.get(assignmentId);

      if (existing) {
        return { assigned: true, assignment: existing, seatPack };
      }

      if (seatPack.assignedSeats >= seatPack.totalSeats) {
        return {
          assigned: false,
          reason: "Practice seat pack has no seats remaining.",
        };
      }

      const assignment: PracticeSeatAssignmentRecord = {
        assignmentId,
        seatPackId: seatPack.seatPackId,
        checkoutSessionId: seatPack.checkoutSessionId,
        offerId: seatPack.offerId,
        learnerEmail: normalizedEmail,
        status: "active",
        assignedAt,
        accessStartedAt: seatPack.accessStartedAt,
        accessExpiresAt: seatPack.accessExpiresAt,
      };

      seatPack.assignedSeats += 1;
      assignmentsById.set(assignment.assignmentId, assignment);

      return { assigned: true, assignment, seatPack };
    },
    listPracticeSeatAssignments() {
      return Array.from(assignmentsById.values());
    },
  };
}
