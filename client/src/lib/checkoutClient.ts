interface CheckoutResponse {
  url?: string;
  error?: string;
}

type Fetcher = typeof fetch;

export async function createCheckoutSession({
  email,
  fetcher = fetch,
}: {
  email?: string;
  fetcher?: Fetcher;
}): Promise<{ url: string }> {
  const response = await fetcher("/api/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
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
