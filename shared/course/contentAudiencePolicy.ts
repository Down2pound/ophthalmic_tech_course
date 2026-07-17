export type CourseContentAudience =
  | "public-optitech-course"
  | "spindel-technician-onboarding"
  | "exclude-from-learner-course";

const doctorProtocolPatterns = [
  /\bdoctor\b/i,
  /\bprovider\b/i,
  /\bprotocol\b/i,
  /\bworkup\b/i,
  /\bstanding order\b/i,
  /\bpost-?op\b/i,
  /\bpre-?op\b/i,
  /\bFarahani\b/i,
  /\bRamsey\b/i,
  /\bO'?Block\b/i,
  /\bGuenena\b/i,
  /\bNguyen\b/i,
  /\bSlentz\b/i,
  /\bSpindel\b/i,
  /\bSEA\b/i,
];

export function isDoctorSpecificProtocolSource(filenameOrTitle: string) {
  return doctorProtocolPatterns.some(pattern => pattern.test(filenameOrTitle));
}

export function classifyCourseSourceAudience(
  filenameOrTitle: string
): CourseContentAudience {
  const normalized = filenameOrTitle.trim();

  if (!normalized) return "exclude-from-learner-course";

  if (/project detailing/i.test(normalized)) {
    return "exclude-from-learner-course";
  }

  if (isDoctorSpecificProtocolSource(normalized)) {
    return "spindel-technician-onboarding";
  }

  return "public-optitech-course";
}

export const spindelDoctorProtocolStorageRoot =
  "spindel-onboarding/doctor-protocols";
