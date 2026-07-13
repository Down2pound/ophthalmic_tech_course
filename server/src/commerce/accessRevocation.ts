import type { EnrollmentRecord, EnrollmentStore } from "./enrollmentStore";
import type {
  PracticeSeatAssignmentRecord,
  PracticeSeatPackRecord,
  PracticeSeatPackStore,
} from "./practiceSeatPackStore";

export type AccessRevocationTarget =
  | {
      type: "enrollment";
      enrollmentId: string;
    }
  | {
      type: "practice-seat-assignment";
      assignmentId: string;
    }
  | {
      type: "practice-seat-pack";
      seatPackId: string;
    };

export interface AccessRevocationStores {
  enrollmentStore: EnrollmentStore;
  practiceSeatPackStore: PracticeSeatPackStore;
}

export interface AccessRevocationResult {
  revoked: boolean;
  target: AccessRevocationTarget;
  enrollment?: EnrollmentRecord;
  expiredEnrollments: EnrollmentRecord[];
  assignment?: PracticeSeatAssignmentRecord;
  revokedAssignments: PracticeSeatAssignmentRecord[];
  seatPack?: PracticeSeatPackRecord;
  message: string;
}

function enrollmentIdFromAssignment(assignmentId: string): string {
  return `enrollment_${assignmentId}`;
}

export async function revokeAccess({
  target,
  stores,
}: {
  target: AccessRevocationTarget;
  stores: AccessRevocationStores;
}): Promise<AccessRevocationResult> {
  if (target.type === "enrollment") {
    const result = await stores.enrollmentStore.expireEnrollment(
      target.enrollmentId
    );

    return {
      revoked: result.expired,
      target,
      ...(result.enrollment ? { enrollment: result.enrollment } : {}),
      expiredEnrollments: result.enrollment ? [result.enrollment] : [],
      revokedAssignments: [],
      message: result.expired
        ? "Enrollment access was expired."
        : "Enrollment was not found.",
    };
  }

  if (target.type === "practice-seat-assignment") {
    const assignmentResult =
      await stores.practiceSeatPackStore.revokePracticeSeatAssignment(
        target.assignmentId
      );
    const enrollmentResult = assignmentResult.assignment
      ? await stores.enrollmentStore.expireEnrollment(
          enrollmentIdFromAssignment(assignmentResult.assignment.assignmentId)
        )
      : { expired: false };

    return {
      revoked: assignmentResult.revoked,
      target,
      ...(assignmentResult.assignment
        ? { assignment: assignmentResult.assignment }
        : {}),
      ...(assignmentResult.seatPack
        ? { seatPack: assignmentResult.seatPack }
        : {}),
      expiredEnrollments: enrollmentResult.enrollment
        ? [enrollmentResult.enrollment]
        : [],
      revokedAssignments: assignmentResult.assignment
        ? [assignmentResult.assignment]
        : [],
      message: assignmentResult.revoked
        ? "Practice seat assignment was revoked."
        : "Practice seat assignment was not found.",
    };
  }

  const seatPackResult =
    await stores.practiceSeatPackStore.expirePracticeSeatPack(
      target.seatPackId
    );
  const assignments =
    await stores.practiceSeatPackStore.listPracticeSeatAssignments();
  const revokedAssignments: PracticeSeatAssignmentRecord[] = [];
  const expiredEnrollments: EnrollmentRecord[] = [];

  for (const assignment of assignments.filter(
    item => item.seatPackId === target.seatPackId && item.status === "active"
  )) {
    const assignmentResult =
      await stores.practiceSeatPackStore.revokePracticeSeatAssignment(
        assignment.assignmentId
      );

    if (assignmentResult.assignment) {
      revokedAssignments.push(assignmentResult.assignment);
    }

    const enrollmentResult = await stores.enrollmentStore.expireEnrollment(
      enrollmentIdFromAssignment(assignment.assignmentId)
    );

    if (enrollmentResult.enrollment) {
      expiredEnrollments.push(enrollmentResult.enrollment);
    }
  }

  return {
    revoked: seatPackResult.expired,
    target,
    ...(seatPackResult.seatPack ? { seatPack: seatPackResult.seatPack } : {}),
    expiredEnrollments,
    revokedAssignments,
    message: seatPackResult.expired
      ? "Practice seat pack was expired and active assignments were revoked."
      : "Practice seat pack was not found.",
  };
}
