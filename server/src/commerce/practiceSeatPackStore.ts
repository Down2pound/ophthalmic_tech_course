import type { VerifiedPurchaseRecord } from "./purchaseStore";

export type PracticeSeatPackStatus = "active" | "expired";

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

export interface PracticeSeatPackStore {
  provisionPracticeSeatPack(seatPack: PracticeSeatPackRecord): {
    created: boolean;
    seatPack: PracticeSeatPackRecord;
  };
  listPracticeSeatPacks(): PracticeSeatPackRecord[];
  findPracticeSeatPacksByPurchaserEmail(
    email: string
  ): PracticeSeatPackRecord[];
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

  return {
    provisionPracticeSeatPack(seatPack) {
      const existing = seatPacksByCheckoutSessionId.get(
        seatPack.checkoutSessionId
      );

      if (existing) {
        return { created: false, seatPack: existing };
      }

      seatPacksByCheckoutSessionId.set(seatPack.checkoutSessionId, seatPack);
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
  };
}
