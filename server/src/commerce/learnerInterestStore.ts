import { normalizeCheckoutEmail } from "../../../shared/commerce/checkoutEmail";
import { buyerSupportContact } from "../../../shared/commerce/policies";
import {
  sendTransactionalEmailMessage,
  type SendMagicLinkEmailResult,
  type TransactionalEmailMessage,
} from "../auth/magicLinkEmail";
import type { Queryable } from "../db/postgres";

type Fetcher = typeof fetch;

export type LearnerInterestStatus = "new" | "contacted" | "closed";

export interface LearnerInterestInput {
  learnerName: string;
  email: string;
  background: string;
  goal: string;
}

export interface LearnerInterestRecord extends LearnerInterestInput {
  interestId: string;
  email: string;
  status: LearnerInterestStatus;
  createdAt: string;
}

export interface LearnerInterestStore {
  recordLearnerInterest(
    interest: LearnerInterestRecord
  ): LearnerInterestRecord | Promise<LearnerInterestRecord>;
  listLearnerInterests():
    | LearnerInterestRecord[]
    | Promise<LearnerInterestRecord[]>;
}

export interface SendLearnerInterestNotificationInput {
  interest: LearnerInterestRecord;
  from: string;
  to?: string;
  apiUrl: string;
  apiKey: string;
  fetcher?: Fetcher;
}

interface LearnerInterestRow extends Record<string, unknown> {
  id: string;
  learner_name: string;
  email: string;
  background: string;
  goal: string;
  status: LearnerInterestStatus;
  created_at: Date | string;
}

function normalizeText(value: string, maxLength: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function createInterestId(email: string, createdAt: string): string {
  const safeEmail = email.replace(/[^a-z0-9]/g, "_");
  const safeTime = createdAt.replace(/[^0-9]/g, "").slice(0, 14);
  return `learner_interest_${safeTime}_${safeEmail}`;
}

function mapLearnerInterest(row: LearnerInterestRow): LearnerInterestRecord {
  return {
    interestId: row.id,
    learnerName: row.learner_name,
    email: row.email,
    background: row.background,
    goal: row.goal,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

export function prepareLearnerInterestRecord({
  interest,
  createdAt = new Date().toISOString(),
}: {
  interest: LearnerInterestInput;
  createdAt?: string;
}): LearnerInterestRecord {
  const email = normalizeCheckoutEmail(interest.email);
  const learnerName = normalizeText(interest.learnerName, 120);
  const background = normalizeText(interest.background, 160);
  const goal = normalizeText(interest.goal, 600);

  if (!learnerName) throw new Error("Learner name is required.");
  if (!email) throw new Error("A valid learner email is required.");
  if (!background) throw new Error("Learner background is required.");
  if (!goal) throw new Error("A short learning goal is required.");

  return {
    interestId: createInterestId(email, createdAt),
    learnerName,
    email,
    background,
    goal,
    status: "new",
    createdAt,
  };
}

export function createInMemoryLearnerInterestStore(): LearnerInterestStore {
  const interestsById = new Map<string, LearnerInterestRecord>();

  return {
    recordLearnerInterest(interest) {
      interestsById.set(interest.interestId, interest);
      return interest;
    },
    listLearnerInterests() {
      return Array.from(interestsById.values()).sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      );
    },
  };
}

export function createPostgresLearnerInterestStore(
  db: Queryable
): LearnerInterestStore {
  return {
    async recordLearnerInterest(interest) {
      const result = await db.query<LearnerInterestRow>(
        `
        INSERT INTO commerce_learner_interests (
          id, learner_name, email, background, goal, status, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          interest.interestId,
          interest.learnerName,
          interest.email,
          interest.background,
          interest.goal,
          interest.status,
          interest.createdAt,
        ]
      );

      return mapLearnerInterest(result.rows[0]);
    },
    async listLearnerInterests() {
      const result = await db.query<LearnerInterestRow>(
        "SELECT * FROM commerce_learner_interests ORDER BY created_at DESC"
      );

      return result.rows.map(mapLearnerInterest);
    },
  };
}

export function createLearnerInterestNotificationMessage({
  interest,
  from,
  to = buyerSupportContact.email,
}: {
  interest: LearnerInterestRecord;
  from: string;
  to?: string;
}): TransactionalEmailMessage {
  const subject = `OptiTech learner interest: ${interest.learnerName}`;
  const lines = [
    "New OptiTech Academy learner interest lead.",
    "",
    `Learner: ${interest.learnerName}`,
    `Email: ${interest.email}`,
    `Background: ${interest.background}`,
    `Interest ID: ${interest.interestId}`,
    "",
    "Recommended next step: send the learner the individual decision one-pager, confirm their goal, and invite them to founding access when paid enrollment opens.",
    "",
    "Learning goal:",
    interest.goal,
    "",
    "Safety reminder: do not ask for patient information, private employer details, passwords, payment card data, or raw sign-in links in follow-up notes.",
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

export function sendLearnerInterestNotification({
  interest,
  from,
  to,
  apiUrl,
  apiKey,
  fetcher,
}: SendLearnerInterestNotificationInput): Promise<SendMagicLinkEmailResult> {
  return sendTransactionalEmailMessage({
    message: createLearnerInterestNotificationMessage({ interest, from, to }),
    apiUrl,
    apiKey,
    fetcher,
    failureMessage: "Learner interest notification could not be sent.",
  });
}
