import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";

type Fetcher = typeof fetch;

export interface PracticeInquiryRequest {
  practiceName: string;
  contactName: string;
  contactEmail: string;
  estimatedLearnerCount?: number;
  targetTimeline: string;
  message: string;
}

interface PracticeInquiryResponse {
  inquiry?: {
    inquiryId: string;
    practiceName: string;
    contactEmail: string;
  };
  notification?: {
    attempted: boolean;
    sent: boolean;
  };
  error?: string;
}

function normalizeOptionalSeatCount(value?: number): number | undefined {
  if (!value || !Number.isInteger(value) || value <= 0) return undefined;
  return value;
}

export async function submitPracticeInquiry({
  inquiry,
  fetcher = fetch,
}: {
  inquiry: PracticeInquiryRequest;
  fetcher?: Fetcher;
}): Promise<{
  inquiryId: string;
  notificationSent: boolean;
}> {
  const contactEmail = normalizeCheckoutEmail(inquiry.contactEmail);

  if (!inquiry.practiceName.trim()) {
    throw new Error("Enter the practice name.");
  }

  if (!inquiry.contactName.trim()) {
    throw new Error("Enter the primary contact name.");
  }

  if (!contactEmail) {
    throw new Error("Enter a valid contact email.");
  }

  if (!inquiry.targetTimeline.trim()) {
    throw new Error("Enter the target onboarding timeline.");
  }

  if (!inquiry.message.trim()) {
    throw new Error("Enter a short note about the onboarding need.");
  }

  const response = await fetcher("/api/practice-inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...inquiry,
      contactEmail,
      estimatedLearnerCount: normalizeOptionalSeatCount(
        inquiry.estimatedLearnerCount
      ),
    }),
  });
  const payload = (await response.json()) as PracticeInquiryResponse;

  if (!response.ok || !payload.inquiry) {
    throw new Error(payload.error ?? "Practice inquiry could not be sent.");
  }

  return {
    inquiryId: payload.inquiry.inquiryId,
    notificationSent: Boolean(payload.notification?.sent),
  };
}
