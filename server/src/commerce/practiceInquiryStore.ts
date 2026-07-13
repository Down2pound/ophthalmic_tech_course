import { normalizeCheckoutEmail } from "../../../shared/commerce/checkoutEmail";
import { customPracticeInquiryOffer } from "../../../shared/commerce/offers";
import {
  sendTransactionalEmailMessage,
  type SendMagicLinkEmailResult,
  type TransactionalEmailMessage,
} from "../auth/magicLinkEmail";
import type { Queryable } from "../db/postgres";

type Fetcher = typeof fetch;

export type PracticeInquiryStatus = "new" | "contacted" | "closed";

export interface PracticeInquiryInput {
  practiceName: string;
  contactName: string;
  contactEmail: string;
  estimatedLearnerCount?: number;
  targetTimeline: string;
  message: string;
}

export interface PracticeInquiryRecord extends PracticeInquiryInput {
  inquiryId: string;
  contactEmail: string;
  status: PracticeInquiryStatus;
  createdAt: string;
}

export interface PracticeInquiryStore {
  recordPracticeInquiry(
    inquiry: PracticeInquiryRecord
  ): PracticeInquiryRecord | Promise<PracticeInquiryRecord>;
  listPracticeInquiries():
    | PracticeInquiryRecord[]
    | Promise<PracticeInquiryRecord[]>;
}

export interface SendPracticeInquiryNotificationInput {
  inquiry: PracticeInquiryRecord;
  from: string;
  to?: string;
  apiUrl: string;
  apiKey: string;
  fetcher?: Fetcher;
}

interface PracticeInquiryRow extends Record<string, unknown> {
  id: string;
  practice_name: string;
  contact_name: string;
  contact_email: string;
  estimated_learner_count: number | null;
  target_timeline: string;
  message: string;
  status: PracticeInquiryStatus;
  created_at: Date | string;
}

function normalizeText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeMessage(value: string): string {
  return value.trim().replace(/\r\n/g, "\n").slice(0, 1200);
}

function createInquiryId(contactEmail: string, createdAt: string): string {
  const safeEmail = contactEmail.replace(/[^a-z0-9]/g, "_");
  const safeTime = createdAt.replace(/[^0-9]/g, "").slice(0, 14);
  return `practice_inquiry_${safeTime}_${safeEmail}`;
}

function mapPracticeInquiry(row: PracticeInquiryRow): PracticeInquiryRecord {
  return {
    inquiryId: row.id,
    practiceName: row.practice_name,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    ...(row.estimated_learner_count
      ? { estimatedLearnerCount: row.estimated_learner_count }
      : {}),
    targetTimeline: row.target_timeline,
    message: row.message,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

export function preparePracticeInquiryRecord({
  inquiry,
  createdAt = new Date().toISOString(),
}: {
  inquiry: PracticeInquiryInput;
  createdAt?: string;
}): PracticeInquiryRecord {
  const contactEmail = normalizeCheckoutEmail(inquiry.contactEmail);
  const practiceName = normalizeText(inquiry.practiceName, 120);
  const contactName = normalizeText(inquiry.contactName, 120);
  const targetTimeline = normalizeText(inquiry.targetTimeline, 160);
  const message = normalizeMessage(inquiry.message);

  if (!practiceName) throw new Error("Practice name is required.");
  if (!contactName) throw new Error("Primary contact name is required.");
  if (!contactEmail) throw new Error("A valid contact email is required.");
  if (!targetTimeline) {
    throw new Error("Target onboarding timeline is required.");
  }
  if (!message) throw new Error("A short inquiry message is required.");

  return {
    inquiryId: createInquiryId(contactEmail, createdAt),
    practiceName,
    contactName,
    contactEmail,
    ...(inquiry.estimatedLearnerCount &&
    Number.isInteger(inquiry.estimatedLearnerCount) &&
    inquiry.estimatedLearnerCount > 0
      ? { estimatedLearnerCount: inquiry.estimatedLearnerCount }
      : {}),
    targetTimeline,
    message,
    status: "new",
    createdAt,
  };
}

export function createInMemoryPracticeInquiryStore(): PracticeInquiryStore {
  const inquiriesById = new Map<string, PracticeInquiryRecord>();

  return {
    recordPracticeInquiry(inquiry) {
      inquiriesById.set(inquiry.inquiryId, inquiry);
      return inquiry;
    },
    listPracticeInquiries() {
      return Array.from(inquiriesById.values()).sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      );
    },
  };
}

export function createPostgresPracticeInquiryStore(
  db: Queryable
): PracticeInquiryStore {
  return {
    async recordPracticeInquiry(inquiry) {
      const result = await db.query<PracticeInquiryRow>(
        `
        INSERT INTO commerce_practice_inquiries (
          id, practice_name, contact_name, contact_email,
          estimated_learner_count, target_timeline, message, status, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
          inquiry.inquiryId,
          inquiry.practiceName,
          inquiry.contactName,
          inquiry.contactEmail,
          inquiry.estimatedLearnerCount ?? null,
          inquiry.targetTimeline,
          inquiry.message,
          inquiry.status,
          inquiry.createdAt,
        ]
      );

      return mapPracticeInquiry(result.rows[0]);
    },
    async listPracticeInquiries() {
      const result = await db.query<PracticeInquiryRow>(
        "SELECT * FROM commerce_practice_inquiries ORDER BY created_at DESC"
      );

      return result.rows.map(mapPracticeInquiry);
    },
  };
}

export function createPracticeInquiryNotificationMessage({
  inquiry,
  from,
  to = customPracticeInquiryOffer.contactEmail,
}: {
  inquiry: PracticeInquiryRecord;
  from: string;
  to?: string;
}): TransactionalEmailMessage {
  const subject = `OptiTech practice inquiry: ${inquiry.practiceName}`;
  const lines = [
    "New OptiTech Academy practice onboarding inquiry.",
    "",
    `Practice: ${inquiry.practiceName}`,
    `Contact: ${inquiry.contactName}`,
    `Email: ${inquiry.contactEmail}`,
    `Estimated learners: ${inquiry.estimatedLearnerCount ?? "Not provided"}`,
    `Timeline: ${inquiry.targetTimeline}`,
    `Inquiry ID: ${inquiry.inquiryId}`,
    "",
    "Message:",
    inquiry.message,
    "",
    [
      "Safety reminder: keep patient information, private employee performance",
      "details, card data, passwords, and raw sign-in links out of follow-up notes.",
    ].join(" "),
  ];

  return {
    from,
    to,
    subject,
    text: lines.join("\n"),
    html: lines
      .map(line =>
        line
          ? `<p>${line
              .replaceAll("&", "&amp;")
              .replaceAll("<", "&lt;")
              .replaceAll(">", "&gt;")}</p>`
          : "<br />"
      )
      .join(""),
  };
}

export function sendPracticeInquiryNotification({
  inquiry,
  from,
  to,
  apiUrl,
  apiKey,
  fetcher,
}: SendPracticeInquiryNotificationInput): Promise<SendMagicLinkEmailResult> {
  return sendTransactionalEmailMessage({
    message: createPracticeInquiryNotificationMessage({ inquiry, from, to }),
    apiUrl,
    apiKey,
    fetcher,
    failureMessage: "Practice inquiry notification could not be sent.",
  });
}
