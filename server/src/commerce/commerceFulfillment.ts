import {
  createEnrollmentFromPurchase,
  type EnrollmentRecord,
  type EnrollmentStore,
} from "./enrollmentStore";
import {
  createPracticeSeatPackFromPurchase,
  type PracticeSeatPackRecord,
  type PracticeSeatPackStore,
} from "./practiceSeatPackStore";
import {
  createVerifiedPurchaseRecord,
  type PurchaseStore,
  type VerifiedPurchaseRecord,
} from "./purchaseStore";
import type { PurchaseEvent } from "./stripeWebhook";

export interface CommerceFulfillmentStore {
  recordPurchase(purchase: VerifiedPurchaseRecord): {
    created: boolean;
    purchase: VerifiedPurchaseRecord;
  };
  provisionEnrollment(enrollment: EnrollmentRecord): {
    created: boolean;
    enrollment: EnrollmentRecord;
  };
  provisionPracticeSeatPack?(seatPack: PracticeSeatPackRecord): {
    created: boolean;
    seatPack: PracticeSeatPackRecord;
  };
}

export interface CommerceFulfillmentServiceOptions {
  store?: CommerceFulfillmentStore;
  purchaseStore?: PurchaseStore;
  enrollmentStore?: EnrollmentStore;
  practiceSeatPackStore?: PracticeSeatPackStore;
  now?: () => string;
}

export interface PurchaseFulfillmentResult {
  purchaseRecorded: boolean;
  enrollmentProvisioned: boolean;
  practiceSeatPackProvisioned: boolean;
}

function resolveStore({
  store,
  purchaseStore,
  enrollmentStore,
  practiceSeatPackStore,
}: CommerceFulfillmentServiceOptions): CommerceFulfillmentStore {
  if (store) return store;

  if (!purchaseStore || !enrollmentStore) {
    throw new Error(
      "Commerce fulfillment requires either a store or both purchase and enrollment stores."
    );
  }

  return {
    recordPurchase: purchaseStore.recordPurchase,
    provisionEnrollment: enrollmentStore.provisionEnrollment,
    provisionPracticeSeatPack: practiceSeatPackStore?.provisionPracticeSeatPack,
  };
}

export function createCommerceFulfillmentService(
  options: CommerceFulfillmentServiceOptions
) {
  const store = resolveStore(options);
  const now = options.now ?? (() => new Date().toISOString());

  return {
    fulfillPurchaseEvent(
      purchaseEvent: PurchaseEvent
    ): PurchaseFulfillmentResult {
      const verifiedPurchase = createVerifiedPurchaseRecord(
        purchaseEvent,
        now()
      );
      const purchaseResult = store.recordPurchase(verifiedPurchase);

      if (!purchaseResult.created) {
        return {
          purchaseRecorded: false,
          enrollmentProvisioned: false,
          practiceSeatPackProvisioned: false,
        };
      }

      const practiceSeatPack = createPracticeSeatPackFromPurchase(
        purchaseResult.purchase
      );

      if (practiceSeatPack) {
        const seatPackResult =
          store.provisionPracticeSeatPack?.(practiceSeatPack);

        return {
          purchaseRecorded: true,
          enrollmentProvisioned: false,
          practiceSeatPackProvisioned: Boolean(seatPackResult?.created),
        };
      }

      const enrollmentResult = store.provisionEnrollment(
        createEnrollmentFromPurchase(purchaseResult.purchase)
      );

      return {
        purchaseRecorded: true,
        enrollmentProvisioned: enrollmentResult.created,
        practiceSeatPackProvisioned: false,
      };
    },
  };
}
