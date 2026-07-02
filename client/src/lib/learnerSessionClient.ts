type Fetcher = typeof fetch;

export type LearnerSessionAccess =
  | {
      authenticated: true;
      hasAccess: true;
      email: string;
      offerId: string;
      accessStartedAt: string;
      accessExpiresAt: string;
    }
  | {
      authenticated: true;
      hasAccess: false;
      email: string;
      reason: string;
    }
  | {
      authenticated: false;
      hasAccess: false;
      reason: string;
    };

interface LearnerSessionErrorResponse {
  error?: string;
}

export async function fetchLearnerSessionAccess({
  fetcher = fetch,
}: {
  fetcher?: Fetcher;
} = {}): Promise<LearnerSessionAccess> {
  const response = await fetcher("/api/auth/session", {
    credentials: "include",
  });
  const payload = (await response.json()) as
    | LearnerSessionAccess
    | LearnerSessionErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Learner access is unavailable right now."
    );
  }

  return payload as LearnerSessionAccess;
}
