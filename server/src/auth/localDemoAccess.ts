import type { EnrollmentRecord } from "../commerce/enrollmentStore";

export interface LocalDemoAccessInput {
  env: Record<string, string | undefined>;
  host: string | undefined;
}

export interface LocalDemoEnrollmentInput {
  email: string;
  now?: string;
}

function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + months);
  return nextDate;
}

function isLocalHost(host: string | undefined): boolean {
  const normalizedHost = host?.trim().toLowerCase().replace(/:\d+$/, "");
  return (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    normalizedHost === "[::1]" ||
    normalizedHost === "::1"
  );
}

function safeEmailId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function isLocalDemoAccessAllowed({
  env,
  host,
}: LocalDemoAccessInput): boolean {
  return env.ENABLE_LOCAL_COURSE_DEMO === "true" && isLocalHost(host);
}

export function createLocalDemoEnrollment({
  email,
  now = new Date().toISOString(),
}: LocalDemoEnrollmentInput): EnrollmentRecord {
  const normalizedEmail = email.trim().toLowerCase();
  const startedAt = new Date(now);

  return {
    enrollmentId: `demo_enrollment_${safeEmailId(normalizedEmail)}`,
    checkoutSessionId: "cs_demo_local_course",
    offerId: "founding-learner",
    learnerEmail: normalizedEmail,
    status: "active",
    accessStartedAt: startedAt.toISOString(),
    accessExpiresAt: addMonths(startedAt, 12).toISOString(),
  };
}
