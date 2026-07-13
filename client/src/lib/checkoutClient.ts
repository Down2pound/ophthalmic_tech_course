import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";

interface CheckoutResponse {
  url?: string;
  error?: string;
}

type Fetcher = typeof fetch;

export async function createCheckoutSession({
  email,
  offerId,
  fetcher = fetch,
}: {
  email: string;
  offerId?: string;
  fetcher?: Fetcher;
}): Promise<{ url: string }> {
  const normalizedEmail = normalizeCheckoutEmail(email);

  if (!normalizedEmail) {
    throw new Error(
      "Enter a valid email so we can send your receipt and course access."
    );
  }

  const response = await fetcher("/api/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, offerId }),
  });

  const payload = (await response.json()) as CheckoutResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Checkout is unavailable right now.");
  }

  if (!payload.url) {
    throw new Error("Checkout did not return a redirect URL.");
  }

  return { url: payload.url };
}
