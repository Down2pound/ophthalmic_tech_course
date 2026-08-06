import {
  foundingLearnerOffer,
  practicePackOffers,
  type CourseOffer,
  type PracticePackOffer,
} from "../../../shared/commerce/offers";
import { normalizeCheckoutEmail } from "../../../shared/commerce/checkoutEmail";
import {
  createCommerceFulfillmentService,
  type CommerceFulfillmentServiceOptions,
  type PurchaseFulfillmentResult,
} from "./commerceFulfillment";
import type { PurchaseEvent } from "./stripeWebhook";

export interface ManualPaymentFulfillmentInput {
  buyerEmail: string;
  offerId: string;
  paymentReference: string;
}

export interface ManualPaymentFulfillmentResult {
  purchaseEvent: PurchaseEvent;
  fulfillment: PurchaseFulfillmentResult;
}

const supportedOffers: Array<CourseOffer | PracticePackOffer> = [
  foundingLearnerOffer,
  ...practicePackOffers,
];

function getSupportedOffer(offerId: string) {
  return supportedOffers.find(offer => offer.id === offerId);
}

function safeReference(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 80);
}

function seatCountForOffer(offer: CourseOffer | PracticePackOffer) {
  return "seatCount" in offer ? offer.seatCount : undefined;
}

export async function fulfillManualPaymentLinkPurchase({
  buyerEmail,
  offerId,
  paymentReference,
  purchaseStore,
  enrollmentStore,
  practiceSeatPackStore,
  now,
}: ManualPaymentFulfillmentInput &
  CommerceFulfillmentServiceOptions): Promise<ManualPaymentFulfillmentResult> {
  const purchaserEmail = normalizeCheckoutEmail(buyerEmail);
  const offer = getSupportedOffer(offerId);
  const reference = safeReference(paymentReference);

  if (!purchaserEmail) {
    throw new Error("Buyer email is required for manual payment fulfillment.");
  }

  if (!offer) {
    throw new Error("Choose a supported manual payment offer.");
  }

  if (!reference) {
    throw new Error("Stripe payment or Payment Link reference is required.");
  }

  const purchaseEvent: PurchaseEvent = {
    stripeEventId: `manual_${reference}`,
    checkoutSessionId: `manual_${reference}`,
    offerId: offer.id,
    purchaserEmail,
    amountTotal: offer.priceCents,
    currency: offer.currency,
    accessMonths: offer.accessMonths,
    ...(seatCountForOffer(offer)
      ? { seatCount: seatCountForOffer(offer) }
      : {}),
  };
  const fulfillmentService = createCommerceFulfillmentService({
    purchaseStore,
    enrollmentStore,
    practiceSeatPackStore,
    now,
  });

  return {
    purchaseEvent,
    fulfillment: await fulfillmentService.fulfillPurchaseEvent(purchaseEvent),
  };
}
