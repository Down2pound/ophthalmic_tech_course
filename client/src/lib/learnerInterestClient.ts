import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";

type Fetcher = typeof fetch;

export interface LearnerInterestRequest {
  learnerName: string;
  email: string;
  background: string;
  goal: string;
}

interface LearnerInterestResponse {
  interest?: {
    interestId: string;
    email: string;
  };
  notification?: {
    attempted: boolean;
    sent: boolean;
  };
  error?: string;
}

export async function submitLearnerInterest({
  interest,
  fetcher = fetch,
}: {
  interest: LearnerInterestRequest;
  fetcher?: Fetcher;
}): Promise<{
  interestId: string;
  notificationSent: boolean;
}> {
  const email = normalizeCheckoutEmail(interest.email);

  if (!interest.learnerName.trim()) {
    throw new Error("Enter your name.");
  }

  if (!email) {
    throw new Error("Enter a valid email.");
  }

  if (!interest.background.trim()) {
    throw new Error("Choose the background that fits you best.");
  }

  if (!interest.goal.trim()) {
    throw new Error("Enter a short note about what you want to learn.");
  }

  const response = await fetcher("/api/learner-interests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...interest,
      email,
    }),
  });
  const payload = (await response.json()) as LearnerInterestResponse;

  if (!response.ok || !payload.interest) {
    throw new Error(payload.error ?? "Learner interest could not be sent.");
  }

  return {
    interestId: payload.interest.interestId,
    notificationSent: Boolean(payload.notification?.sent),
  };
}
