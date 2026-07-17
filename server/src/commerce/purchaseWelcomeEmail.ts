import { buyerSupportContact } from "../../../shared/commerce/policies";
import {
  sendTransactionalEmailMessage,
  type SendMagicLinkEmailResult,
  type TransactionalEmailMessage,
} from "../auth/magicLinkEmail";
import type { PurchaseEvent } from "./stripeWebhook";

type Fetcher = typeof fetch;

export interface CreatePurchaseWelcomeEmailMessageInput {
  purchase: PurchaseEvent;
  from: string;
  publicAppUrl: string;
}

export interface SendPurchaseWelcomeEmailInput
  extends CreatePurchaseWelcomeEmailMessageInput {
  apiUrl: string;
  apiKey: string;
  fetcher?: Fetcher;
}

function buildPublicUrl(publicAppUrl: string, path: string): string {
  return new URL(path, publicAppUrl).toString();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderParagraphs(paragraphs: string[]): string {
  return paragraphs
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function getSupportReference(purchase: PurchaseEvent): string {
  return [
    `Offer: ${purchase.offerId}`,
    `Checkout session: ${purchase.checkoutSessionId}`,
    `Stripe event: ${purchase.stripeEventId}`,
  ].join(" | ");
}

export function createPurchaseWelcomeEmailMessage({
  purchase,
  from,
  publicAppUrl,
}: CreatePurchaseWelcomeEmailMessageInput): TransactionalEmailMessage {
  const isPracticePack = Boolean(purchase.seatCount);
  const learnUrl = buildPublicUrl(publicAppUrl, "/learn");
  const policiesUrl = buildPublicUrl(publicAppUrl, "/policies");
  const checkoutUrl = buildPublicUrl(publicAppUrl, "/checkout");
  const buyerGuideUrl = buildPublicUrl(publicAppUrl, "/buyer-guide");
  const practicePacksUrl = buildPublicUrl(publicAppUrl, "/practice-packs");
  const practiceSeatAdminUrl = buildPublicUrl(
    publicAppUrl,
    "/practice-seat-admin"
  );

  const subject = isPracticePack
    ? "Your OptiTech Academy practice seats are ready"
    : "Welcome to OptiTech Academy";
  const opening = isPracticePack
    ? "Thank you for purchasing an OptiTech Academy practice onboarding pack."
    : "Thank you for joining OptiTech Academy as a founding learner.";
  const accessLine = isPracticePack
    ? `Practice seat setup starts here: ${practiceSeatAdminUrl}`
    : `Start learning here: ${learnUrl}`;
  const emailLine = isPracticePack
    ? `Use this purchase email when managing the seat pack: ${purchase.purchaserEmail}`
    : `Use this same email to request your sign-in link: ${purchase.purchaserEmail}`;
  const nextStepLine = isPracticePack
    ? `Next step: choose the learner emails you want to assign first, then use the practice setup workflow or contact support if you need help. Practice pack details: ${practicePacksUrl}`
    : `Next step: open the learning page, request a passwordless sign-in link with your checkout email, then start Module 1. If you are still deciding how to use the course, review the buyer guide: ${buyerGuideUrl}`;
  const scopeLine = isPracticePack
    ? "Practice managers remain responsible for local protocols, supervision, hands-on competency signoff, and employment decisions."
    : "The course is foundational education. It does not replace certification, employment decisions, or hands-on clinical competency signoff.";
  const supportReferenceLine = `Support reference: ${getSupportReference(purchase)}`;
  const supportLine = `For help, contact ${buyerSupportContact.email}. Include your checkout email and support reference. Do not send patient information, card numbers, passwords, raw sign-in links, or private employee details.`;

  const paragraphs = [
    opening,
    emailLine,
    accessLine,
    nextStepLine,
    `Course policies and support expectations: ${policiesUrl}`,
    isPracticePack
      ? "Seat assignments should use one learner email per seat. Seats should not be shared across multiple employees."
      : `If you need to request help or review enrollment later, start from the checkout page: ${checkoutUrl}`,
    scopeLine,
    supportReferenceLine,
    supportLine,
  ];

  return {
    from,
    to: purchase.purchaserEmail,
    subject,
    text: paragraphs.join("\n\n"),
    html: renderParagraphs(paragraphs),
  };
}

export function sendPurchaseWelcomeEmail({
  purchase,
  from,
  publicAppUrl,
  apiUrl,
  apiKey,
  fetcher,
}: SendPurchaseWelcomeEmailInput): Promise<SendMagicLinkEmailResult> {
  return sendTransactionalEmailMessage({
    message: createPurchaseWelcomeEmailMessage({
      purchase,
      from,
      publicAppUrl,
    }),
    apiUrl,
    apiKey,
    fetcher,
    failureMessage: "Welcome email could not be sent.",
  });
}
