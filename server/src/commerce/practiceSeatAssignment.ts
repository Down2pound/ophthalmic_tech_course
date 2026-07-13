import {
  createEnrollmentFromPracticeSeatAssignment,
  type EnrollmentRecord,
  type EnrollmentStore,
} from "./enrollmentStore";
import type {
  PracticeSeatAssignmentRecord,
  PracticeSeatPackRecord,
  PracticeSeatPackStore,
} from "./practiceSeatPackStore";

export type PracticeSeatAssignmentServiceResult =
  | {
      assigned: true;
      assignment: PracticeSeatAssignmentRecord;
      enrollment: EnrollmentRecord;
      enrollmentProvisioned: boolean;
      seatPack: PracticeSeatPackRecord;
    }
  | {
      assigned: false;
      reason: string;
    };

export interface AssignPracticeSeatToLearnerInput {
  seatPackId: string;
  learnerEmail: string;
  practiceSeatPackStore: PracticeSeatPackStore;
  enrollmentStore: EnrollmentStore;
  assignedAt?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function assignPracticeSeatToLearner({
  seatPackId,
  learnerEmail,
  practiceSeatPackStore,
  enrollmentStore,
  assignedAt,
}: AssignPracticeSeatToLearnerInput): PracticeSeatAssignmentServiceResult {
  const normalizedEmail = learnerEmail.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return {
      assigned: false,
      reason: "Learner email is required.",
    };
  }

  const assignmentResult = practiceSeatPackStore.assignPracticeSeat({
    seatPackId,
    learnerEmail: normalizedEmail,
    assignedAt,
  });

  if (!assignmentResult.assigned) {
    return assignmentResult;
  }

  const enrollment = createEnrollmentFromPracticeSeatAssignment(
    assignmentResult.assignment
  );
  const enrollmentResult = enrollmentStore.provisionEnrollment(enrollment);

  return {
    assigned: true,
    assignment: assignmentResult.assignment,
    enrollment: enrollmentResult.enrollment,
    enrollmentProvisioned: enrollmentResult.created,
    seatPack: assignmentResult.seatPack,
  };
}
