import type { PurchaseEvent } from "./stripeWebhook";

export interface VerifiedPurchaseRecord extends PurchaseEvent {
  recordedAt: string;
}

export interface PurchaseStore {
  recordPurchase(
    purchase: VerifiedPurchaseRecord
  ): { created: boolean; purchase: VerifiedPurchaseRecord };
  listPurchases(): VerifiedPurchaseRecord[];
  findPurchasesByEmail(email: string): VerifiedPurchaseRecord[];
}

export function createVerifiedPurchaseRecord(
  purchaseEvent: PurchaseEvent,
  recordedAt = new Date().toISOString()
): VerifiedPurchaseRecord {
  return {
    ...purchaseEvent,
    purchaserEmail: purchaseEvent.purchaserEmail.trim().toLowerCase(),
    recordedAt,
  };
}

export function createInMemoryPurchaseStore(): PurchaseStore {
  const purchasesByEventId = new Map<string, VerifiedPurchaseRecord>();

  return {
    recordPurchase(purchase) {
      const existing = purchasesByEventId.get(purchase.stripeEventId);
      if (existing) {
        return { created: false, purchase: existing };
      }

      purchasesByEventId.set(purchase.stripeEventId, purchase);
      return { created: true, purchase };
    },
    listPurchases() {
      return Array.from(purchasesByEventId.values());
    },
    findPurchasesByEmail(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return Array.from(purchasesByEventId.values()).filter(
        (purchase) => purchase.purchaserEmail === normalizedEmail
      );
    },
  };
}
