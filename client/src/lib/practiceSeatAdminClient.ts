export interface PracticeSeatPackSummary {
  seatPackId: string;
  checkoutSessionId: string;
  offerId: string;
  purchaserEmail: string;
  totalSeats: number;
  assignedSeats: number;
  status: string;
  accessStartedAt: string;
  accessExpiresAt: string;
}

export interface PracticeSeatAssignmentSummary {
  assignmentId: string;
  seatPackId: string;
  checkoutSessionId: string;
  offerId: string;
  learnerEmail: string;
  status: string;
  assignedAt: string;
  accessStartedAt: string;
  accessExpiresAt: string;
}

export interface PracticeSeatPackListResponse {
  seatPacks: PracticeSeatPackSummary[];
  assignments: PracticeSeatAssignmentSummary[];
}

export interface PracticeInquiryFollowUpPlan {
  priority: "high" | "medium" | "standard";
  recommendedOffer: string;
  nextAction: string;
  talkingPoints: string[];
}

export interface PracticeInquirySummary {
  inquiryId: string;
  practiceName: string;
  contactName: string;
  contactEmail: string;
  estimatedLearnerCount?: number;
  targetTimeline: string;
  message: string;
  status: string;
  createdAt: string;
  followUpPlan: PracticeInquiryFollowUpPlan;
}

export interface LearnerInterestSummary {
  interestId: string;
  learnerName: string;
  email: string;
  background: string;
  goal: string;
  status: string;
  createdAt: string;
}

export interface PracticeInquiryListResponse {
  inquiries: PracticeInquirySummary[];
  learnerInterests: LearnerInterestSummary[];
}

export interface BuyerSupportProfile {
  email: string;
  purchases: Array<{ checkoutSessionId: string; offerId?: string }>;
  enrollments: Array<{
    enrollmentId: string;
    offerId?: string;
    status?: string;
    accessExpiresAt?: string;
  }>;
  practiceSeatPacks: Array<{
    seatPackId: string;
    offerId?: string;
    totalSeats?: number;
    assignedSeats?: number;
    status?: string;
  }>;
  practiceSeatAssignments: Array<{
    assignmentId: string;
    seatPackId: string;
    learnerEmail?: string;
    status?: string;
  }>;
  summary: {
    hasPurchase: boolean;
    hasActiveEnrollment: boolean;
    hasPracticeSeatPack: boolean;
    hasPracticeSeatAssignment: boolean;
    remainingPracticeSeats: number;
  };
  recommendedActions: string[];
}

export interface PracticeSeatAssignmentResponse {
  assignment: PracticeSeatAssignmentSummary;
  enrollmentProvisioned: boolean;
  seatPack: PracticeSeatPackSummary;
}

type Fetcher = typeof fetch;

interface ApiErrorResponse {
  error?: string;
}

function getAdminHeaders(adminToken: string) {
  return {
    "Content-Type": "application/json",
    "x-admin-token": adminToken,
  };
}

export async function fetchPracticeSeatPacks({
  adminToken,
  fetcher = fetch,
}: {
  adminToken: string;
  fetcher?: Fetcher;
}): Promise<PracticeSeatPackListResponse> {
  const response = await fetcher("/api/practice-seat-packs", {
    headers: getAdminHeaders(adminToken),
  });
  const payload = (await response.json()) as
    | PracticeSeatPackListResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Practice seat packs could not be loaded."
    );
  }

  return payload as PracticeSeatPackListResponse;
}

export async function fetchPracticeInquiries({
  adminToken,
  fetcher = fetch,
}: {
  adminToken: string;
  fetcher?: Fetcher;
}): Promise<PracticeInquiryListResponse> {
  const response = await fetcher("/api/support/practice-inquiries", {
    headers: getAdminHeaders(adminToken),
  });
  const payload = (await response.json()) as
    | PracticeInquiryListResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Practice inquiries could not be loaded."
    );
  }

  return payload as PracticeInquiryListResponse;
}

export async function lookupBuyerSupportProfile({
  adminToken,
  email,
  fetcher = fetch,
}: {
  adminToken: string;
  email: string;
  fetcher?: Fetcher;
}): Promise<BuyerSupportProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await fetcher(
    `/api/support/buyer-lookup?email=${encodeURIComponent(normalizedEmail)}`,
    {
      headers: getAdminHeaders(adminToken),
    }
  );
  const payload = (await response.json()) as
    | BuyerSupportProfile
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Buyer support profile could not be loaded."
    );
  }

  return payload as BuyerSupportProfile;
}

export async function assignPracticeSeat({
  adminToken,
  seatPackId,
  learnerEmail,
  fetcher = fetch,
}: {
  adminToken: string;
  seatPackId: string;
  learnerEmail: string;
  fetcher?: Fetcher;
}): Promise<PracticeSeatAssignmentResponse> {
  const response = await fetcher(
    `/api/practice-seat-packs/${encodeURIComponent(seatPackId)}/assignments`,
    {
      method: "POST",
      headers: getAdminHeaders(adminToken),
      body: JSON.stringify({ learnerEmail }),
    }
  );
  const payload = (await response.json()) as
    | PracticeSeatAssignmentResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Practice seat could not be assigned."
    );
  }

  return payload as PracticeSeatAssignmentResponse;
}
