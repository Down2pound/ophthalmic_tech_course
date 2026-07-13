import { describe, expect, it } from "vitest";
import { fetchModuleOneCertificateEligibility } from "./certificateEligibilityClient";

function createResponse(payload: unknown, ok = true) {
  return {
    ok,
    async json() {
      return payload;
    },
  } as Response;
}

const eligibility = {
  eligible: false,
  learnerEmail: "learner@example.com",
  moduleId: "entering-ophthalmic-care",
  certificateTitle: "Certificate of Completion",
  certificateSubtitle: "OptiTech Academy Ophthalmic Technician Foundations",
  completionStatement: "Completion statement",
  limitationStatement: "Limitation statement",
  requirements: [
    { id: "lessons-complete", label: "Complete lessons", met: false },
  ],
};

describe("fetchModuleOneCertificateEligibility", () => {
  it("fetches protected certificate eligibility", async () => {
    const calls: string[] = [];
    const fetcher = async (url: string | URL | Request) => {
      calls.push(String(url));
      return createResponse({ eligibility });
    };

    await expect(
      fetchModuleOneCertificateEligibility(fetcher as typeof fetch)
    ).resolves.toEqual(eligibility);
    expect(calls).toEqual(["/api/learn/module-one/certificate/eligibility"]);
  });

  it("surfaces protected eligibility errors", async () => {
    await expect(
      fetchModuleOneCertificateEligibility((async () =>
        createResponse(
          { error: "No active session found." },
          false
        )) as typeof fetch)
    ).rejects.toThrow("No active session found.");
  });
});
