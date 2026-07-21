interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function baseUrl(): string {
  return (process.env.PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function businessName(): string {
  return process.env.BUSINESS_NAME?.trim() || "OptiTech Academy";
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    console.warn(`Email not sent because RESEND_API_KEY or EMAIL_FROM is missing: ${message.subject}`);
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(message.idempotencyKey ? { "Idempotency-Key": message.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: process.env.SUPPORT_EMAIL?.trim() || undefined,
    }),
  });

  if (!response.ok) {
    console.error("Transactional email failed", await response.text());
    return false;
  }

  return true;
}

export async function sendActivationEmail(input: {
  email: string;
  firstName: string;
  token: string;
  checkoutSessionId: string;
}): Promise<boolean> {
  const name = businessName();
  const activationUrl = `${baseUrl()}/enrollment/activate?token=${encodeURIComponent(input.token)}`;
  const safeFirstName = escapeHtml(input.firstName);
  const safeName = escapeHtml(name);

  return sendEmail({
    to: input.email,
    subject: `Activate your ${name} course access`,
    idempotencyKey: `activation-${input.checkoutSessionId}`,
    text: `Hi ${input.firstName}, your payment was received. Create your course password here: ${activationUrl}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a"><h1>${safeName}</h1><p>Hi ${safeFirstName},</p><p>Your payment was received. Use the secure button below to create your password and begin the course.</p><p style="margin:28px 0"><a href="${activationUrl}" style="background:#2563eb;color:white;text-decoration:none;padding:14px 22px;border-radius:8px;display:inline-block">Activate Course Access</a></p><p>This link expires after 30 days. If you did not make this purchase, contact support.</p></div>`,
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  firstName: string;
  token: string;
  userId: string;
}): Promise<boolean> {
  const name = businessName();
  const resetUrl = `${baseUrl()}/reset-password?token=${encodeURIComponent(input.token)}`;

  return sendEmail({
    to: input.email,
    subject: `Reset your ${name} password`,
    idempotencyKey: `password-reset-${input.userId}-${Date.now()}`,
    text: `Hi ${input.firstName}, reset your password here: ${resetUrl}. This link expires in one hour.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a"><h1>${escapeHtml(name)}</h1><p>Hi ${escapeHtml(input.firstName)},</p><p>Use the secure button below to reset your password.</p><p style="margin:28px 0"><a href="${resetUrl}" style="background:#2563eb;color:white;text-decoration:none;padding:14px 22px;border-radius:8px;display:inline-block">Reset Password</a></p><p>This link expires in one hour. If you did not request a reset, you can ignore this email.</p></div>`,
  });
}

export async function sendSaleNotification(input: {
  email: string;
  enrollmentType: string;
  seats: number;
  checkoutSessionId: string;
}): Promise<boolean> {
  const recipient = process.env.SALES_NOTIFICATION_EMAIL?.trim();
  if (!recipient) return false;

  return sendEmail({
    to: recipient,
    subject: `${businessName()} sale: ${input.seats} seat${input.seats === 1 ? "" : "s"}`,
    idempotencyKey: `sale-${input.checkoutSessionId}`,
    text: `Paid enrollment received from ${input.email}. Type: ${input.enrollmentType}. Seats: ${input.seats}. Stripe session: ${input.checkoutSessionId}.`,
    html: `<div style="font-family:Arial,sans-serif"><h2>New paid enrollment</h2><p><strong>Customer:</strong> ${escapeHtml(input.email)}</p><p><strong>Enrollment:</strong> ${escapeHtml(input.enrollmentType)}</p><p><strong>Seats:</strong> ${input.seats}</p><p><strong>Stripe session:</strong> ${escapeHtml(input.checkoutSessionId)}</p></div>`,
  });
}

export async function sendSupportMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const recipient = process.env.SUPPORT_EMAIL?.trim();
  if (!recipient) return false;

  return sendEmail({
    to: recipient,
    subject: `[Course Support] ${input.subject}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    html: `<div style="font-family:Arial,sans-serif"><p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p><p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p></div>`,
  });
}
