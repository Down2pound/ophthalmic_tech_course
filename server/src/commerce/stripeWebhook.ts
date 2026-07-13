import { createHmac, timingSafeEqual } from "node:crypto";
import { normalizeCheckoutEmail } from "../../../shared/commerce/checkoutEmail";

export interface StripeWebhookVerificationInput {
  payload: string;
  signatureHeader: string | undefined;
  secret: string;
  nowSeconds?: number;
  toleranceSeconds?: number;
}

export interface StripeCheckoutCompletedEvent {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      customer_email?: string | null;
      customer_details?: {
        email?: string | null;
      } | null;
      metadata?: Record<string, string>;
      amount_total?: number | null;
      currency?: string | null;
    };
  };
}

export interface PurchaseEvent {
  stripeEventId: string;
  checkoutSessionId: string;
  offerId: string;
  purchaserEmail: string;
  amountTotal: number;
  currency: string;
  accessMonths: number;
  seatCount?: number;
}

function parseStripeSignatureHeader(signatureHeader: string) {
  return signatureHeader
    .split(",")
    .reduce<Record<string, string[]>>((parts, pair) => {
      const [key, value] = pair.split("=");
      if (!key || !value) return parts;
      parts[key] = [...(parts[key] ?? []), value];
      return parts;
    }, {});
}

export function verifyStripeWebhookSignature({
  payload,
  signatureHeader,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
}: StripeWebhookVerificationInput): boolean {
  if (!signatureHeader || !secret) return false;

  const parts = parseStripeSignatureHeader(signatureHeader);
  const timestamp = Number(parts.t?.[0]);
  const signatures = parts.v1 ?? [];

  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) return false;

  const expectedSignature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature);

  return signatures.some(signature => {
    const signatureBuffer = Buffer.from(signature);
    return (
      signatureBuffer.length === expectedBuffer.length &&
      timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });
}

export function createPurchaseEventFromStripeEvent(
  event: StripeCheckoutCompletedEvent
): PurchaseEvent | null {
  if (event.type !== "checkout.session.completed") return null;

  const session = event.data.object;
  const offerId = session.metadata?.offer_id;
  const accessMonths = Number(session.metadata?.access_months);
  const purchaserEmail = normalizeCheckoutEmail(
    session.customer_email ?? session.customer_details?.email
  );
  const seatCount = session.metadata?.seat_count
    ? Number(session.metadata.seat_count)
    : undefined;

  if (
    !session.id ||
    !offerId ||
    !purchaserEmail ||
    !session.amount_total ||
    !session.currency ||
    !Number.isFinite(accessMonths) ||
    (seatCount !== undefined &&
      (!Number.isInteger(seatCount) || seatCount <= 0))
  ) {
    return null;
  }

  return {
    stripeEventId: event.id,
    checkoutSessionId: session.id,
    offerId,
    purchaserEmail,
    amountTotal: session.amount_total,
    currency: session.currency,
    accessMonths,
    ...(seatCount ? { seatCount } : {}),
  };
}
