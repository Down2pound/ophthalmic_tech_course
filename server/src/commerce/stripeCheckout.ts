import { foundingLearnerOffer } from "../../../shared/commerce/offers";

export interface StripeCheckoutUrls {
  successUrl: string;
  cancelUrl: string;
}

export function buildStripeCheckoutParams(
  urls: StripeCheckoutUrls,
  customerEmail?: string
): URLSearchParams {
  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("success_url", urls.successUrl);
  params.set("cancel_url", urls.cancelUrl);
  params.set("client_reference_id", foundingLearnerOffer.id);
  params.set("metadata[offer_id]", foundingLearnerOffer.id);
  params.set("metadata[access_months]", String(foundingLearnerOffer.accessMonths));
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", foundingLearnerOffer.currency);
  params.set(
    "line_items[0][price_data][unit_amount]",
    String(foundingLearnerOffer.priceCents)
  );
  params.set(
    "line_items[0][price_data][product_data][name]",
    foundingLearnerOffer.name
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    foundingLearnerOffer.description
  );

  if (customerEmail) {
    params.set("customer_email", customerEmail);
  }

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
