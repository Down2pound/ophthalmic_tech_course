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
