export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  if (response.status === 204) return undefined as T;

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;

  if (!response.ok) {
    throw new ApiError(response.status, payload.error ?? "The request could not be completed.");
  }

  return payload;
}

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
  role: "student" | "manager";
  organizationName?: string;
  managerId?: string;
  seatLimit: number;
  createdAt: string;
  progress: CourseProgress[];
  completedModules: number;
  certificateEligible: boolean;
}
