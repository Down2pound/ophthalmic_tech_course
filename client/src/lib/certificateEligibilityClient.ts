export interface CertificateRequirementStatus {
  id: string;
  label: string;
  met: boolean;
}

export interface CertificateEligibility {
  eligible: boolean;
  learnerEmail: string;
  moduleId: string;
  certificateTitle: string;
  certificateSubtitle: string;
  completionStatement: string;
  limitationStatement: string;
  requirements: CertificateRequirementStatus[];
}

export interface CertificateEligibilityResponse {
  eligibility: CertificateEligibility;
}

export async function fetchModuleOneCertificateEligibility(
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher(
    "/api/learn/module-one/certificate/eligibility"
  );
  const payload = (await response.json()) as
    | CertificateEligibilityResponse
    | { error?: string };

  if (response.ok && "eligibility" in payload) {
    return payload.eligibility;
  }

  throw new Error(
    "error" in payload && payload.error
      ? payload.error
      : "Certificate eligibility is unavailable."
  );
}
