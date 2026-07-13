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
}: AssignPracticeSeatToLearnerInput):
  | PracticeSeatAssignmentServiceResult
  | Promise<PracticeSeatAssignmentServiceResult> {
  const normalizedEmail = learnerEmail.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return {
      assigned: false,
      reason: "Learner email is required.",
    };
  }

  return Promise.resolve(
    practiceSeatPackStore.assignPracticeSeat({
      seatPackId,
      learnerEmail: normalizedEmail,
      assignedAt,
    })
  ).then(async assignmentResult => {
    if (!assignmentResult.assigned) {
      return assignmentResult;
    }

    const enrollment = createEnrollmentFromPracticeSeatAssignment(
      assignmentResult.assignment
    );
    const enrollmentResult =
      await enrollmentStore.provisionEnrollment(enrollment);

    return {
      assigned: true,
      assignment: assignmentResult.assignment,
      enrollment: enrollmentResult.enrollment,
      enrollmentProvisioned: enrollmentResult.created,
      seatPack: assignmentResult.seatPack,
    };
  });
}
