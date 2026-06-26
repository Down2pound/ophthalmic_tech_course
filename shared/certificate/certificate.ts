export interface CertificatePreview {
  title: string;
  subtitle: string;
  completionStatement: string;
  limitationStatement: string;
  requirements: string[];
}

export const certificatePreview: CertificatePreview = {
  title: "Certificate of Completion",
  subtitle: "OptiTech Academy Ophthalmic Technician Foundations",
  completionStatement:
    "This recognizes completion of published OptiTech Academy learning requirements for the selected course content.",
  limitationStatement:
    "This certificate of completion is not certification, licensure, employment verification, permission to sit for an outside credentialing exam, or proof of independent clinical competency. Online completion does not verify hands-on clinical skills.",
  requirements: [
    "Complete all published required lessons for the selected course content.",
    "Pass required knowledge checks or assessments for published modules.",
    "Review educational limitations, scope boundaries, and supervised practice expectations.",
    "Use the Skills Passport separately for supervisor-observed hands-on practice.",
  ],
};

export function getCertificateDisplayName(name: string): string {
  return name.trim() || "Learner Name";
}
