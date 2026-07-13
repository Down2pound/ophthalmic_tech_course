import {
  type CheckoutOffer,
  getCheckoutOfferById,
  isPracticePackOffer,
} from "../../../shared/commerce/offers";

export interface StripeCheckoutUrls {
  successUrl: string;
  cancelUrl: string;
}

export function buildCheckoutReturnUrls({
  baseUrl,
  offer,
}: {
  baseUrl: string;
  offer: CheckoutOffer;
}): StripeCheckoutUrls {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const isPracticePurchase = isPracticePackOffer(offer);
  const successPath = isPracticePurchase ? "/practice-packs" : "/learn";
  const cancelPath = isPracticePurchase ? "/practice-packs" : "/checkout";

  return {
    successUrl: `${normalizedBaseUrl}${successPath}?checkout=success&offer=${encodeURIComponent(
      offer.id
    )}`,
    cancelUrl: `${normalizedBaseUrl}${cancelPath}?checkout=cancelled&offer=${encodeURIComponent(
      offer.id
    )}`,
  };
}

export function buildStripeCheckoutParams(
  urls: StripeCheckoutUrls,
  customerEmail: string,
  offerId?: string
): URLSearchParams {
  const offer = getCheckoutOfferById(offerId);
  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("success_url", urls.successUrl);
  params.set("cancel_url", urls.cancelUrl);
  params.set("client_reference_id", offer.id);
  params.set("metadata[offer_id]", offer.id);
  params.set("metadata[access_months]", String(offer.accessMonths));
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", offer.currency);
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(offer.priceCents)
  );
  params.set("line_items[0][price_data][product_data][name]", offer.name);
  params.set(
    "line_items[0][price_data][product_data][description]",
    offer.description
  );

  if (isPracticePackOffer(offer)) {
    params.set("metadata[seat_count]", String(offer.seatCount));
  }

  params.set("customer_email", customerEmail);

  return params;
}

export function getCheckoutBaseUrl(origin?: string): string {
  return (
    process.env.PUBLIC_APP_URL ||
    process.env.APP_URL ||
    origin ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
