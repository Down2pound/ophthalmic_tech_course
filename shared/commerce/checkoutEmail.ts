const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeCheckoutEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;

  const normalizedEmail = email.trim().toLowerCase();

  if (!emailPattern.test(normalizedEmail)) return null;

  return normalizedEmail;
}
