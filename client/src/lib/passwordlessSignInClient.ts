import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";

type Fetcher = typeof fetch;

interface PasswordlessSignInResponse {
  ok?: boolean;
  message?: string;
  error?: string;
}

export async function requestPasswordlessSignInLink({
  email,
  fetcher = fetch,
}: {
  email: string;
  fetcher?: Fetcher;
}): Promise<{ message: string }> {
  const normalizedEmail = normalizeCheckoutEmail(email);

  if (!normalizedEmail) {
    throw new Error("Enter the same email used for checkout.");
  }

  const response = await fetcher("/api/auth/passwordless/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail }),
  });
  const payload = (await response.json()) as PasswordlessSignInResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Sign-in link could not be sent.");
  }

  return {
    message:
      payload.message ??
      "If that email can access OptiTech Academy, a sign-in link will be sent.",
  };
}
