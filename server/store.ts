import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export interface CourseProgress {
  day: number;
  score: number;
  passed: boolean;
  updatedAt: string;
  completedAt?: string;
}

export interface CourseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: "student" | "manager";
  organizationName?: string;
  managerId?: string;
  seatLimit: number;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  accessRevoked?: boolean;
  createdAt: string;
  progress: CourseProgress[];
}

export interface PracticeInvite {
  code: string;
  managerId: string;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
}

export interface CoursePurchase {
  checkoutSessionId: string;
  paymentIntentId?: string;
  email: string;
  firstName: string;
  lastName: string;
  enrollmentType: "individual" | "practice";
  organizationName?: string;
  seats: number;
  activationTokenHash: string;
  activationExpiresAt: string;
  createdAt: string;
  emailSentAt?: string;
  activatedAt?: string;
  activatedUserId?: string;
}

export interface PasswordReset {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface ProcessedStripeEvent {
  id: string;
  processedAt: string;
}

export interface CourseDatabase {
  users: CourseUser[];
  invites: PracticeInvite[];
  purchases: CoursePurchase[];
  passwordResets: PasswordReset[];
  processedStripeEvents: ProcessedStripeEvent[];
}

const dataFile = process.env.DATA_FILE?.trim() || path.resolve(process.cwd(), "data", "course-data.json");
const emptyDatabase: CourseDatabase = {
  users: [],
  invites: [],
  purchases: [],
  passwordResets: [],
  processedStripeEvents: [],
};
let mutationQueue: Promise<unknown> = Promise.resolve();

function normalizeDatabase(value: unknown): CourseDatabase {
  if (!value || typeof value !== "object") return structuredClone(emptyDatabase);
  const candidate = value as Partial<CourseDatabase>;
  return {
    users: Array.isArray(candidate.users) ? candidate.users : [],
    invites: Array.isArray(candidate.invites) ? candidate.invites : [],
    purchases: Array.isArray(candidate.purchases) ? candidate.purchases : [],
    passwordResets: Array.isArray(candidate.passwordResets) ? candidate.passwordResets : [],
    processedStripeEvents: Array.isArray(candidate.processedStripeEvents)
      ? candidate.processedStripeEvents
      : [],
  };
}

export async function readDatabase(): Promise<CourseDatabase> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return normalizeDatabase(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(emptyDatabase);
    }
    throw error;
  }
}

async function writeDatabase(database: CourseDatabase): Promise<void> {
  await mkdir(path.dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(database, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporaryFile, dataFile);
}

export function mutateDatabase<T>(
  mutator: (database: CourseDatabase) => T | Promise<T>,
): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const database = await readDatabase();
    const result = await mutator(database);
    await writeDatabase(database);
    return result;
  });

  mutationQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}
