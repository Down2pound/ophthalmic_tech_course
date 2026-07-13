import type { EnrollmentRecord, EnrollmentStore } from "./enrollmentStore";
import type {
  PracticeSeatAssignmentInput,
  PracticeSeatAssignmentRecord,
  PracticeSeatAssignmentResult,
  PracticeSeatPackRecord,
  PracticeSeatPackStore,
} from "./practiceSeatPackStore";
import type { PurchaseStore, VerifiedPurchaseRecord } from "./purchaseStore";
import type { Queryable, TransactionalQueryable } from "../db/postgres";

interface PurchaseRow extends Record<string, unknown> {
  id: string;
  stripe_event_id: string;
  checkout_session_id: string;
  offer_id: string;
  purchaser_email: string;
  amount_total: number;
  currency: string;
  access_months: number;
  seat_count: number | null;
  recorded_at: Date | string;
}

interface EnrollmentRow extends Record<string, unknown> {
  id: string;
  checkout_session_id: string;
  offer_id: string;
  learner_email: string;
  status: "active" | "expired";
  access_started_at: Date | string;
  access_expires_at: Date | string;
}

interface SeatPackRow extends Record<string, unknown> {
  id: string;
  checkout_session_id: string;
  offer_id: string;
  purchaser_email: string;
  total_seats: number;
  assigned_seats: number;
  status: "active" | "expired";
  access_started_at: Date | string;
  access_expires_at: Date | string;
}

interface SeatAssignmentRow extends Record<string, unknown> {
  id: string;
  seat_pack_id: string;
  checkout_session_id: string;
  offer_id: string;
  learner_email: string;
  status: "active" | "revoked";
  assigned_at: Date | string;
  access_started_at: Date | string;
  access_expires_at: Date | string;
}

function toIsoString(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function purchaseIdFromSession(checkoutSessionId: string): string {
  return `purchase_${checkoutSessionId}`;
}

function assignmentId(seatPackId: string, learnerEmail: string): string {
  return `seat_${seatPackId}_${learnerEmail.replace(/[^a-z0-9]/g, "_")}`;
}

function mapPurchase(row: PurchaseRow): VerifiedPurchaseRecord {
  return {
    stripeEventId: row.stripe_event_id,
    checkoutSessionId: row.checkout_session_id,
    offerId: row.offer_id,
    purchaserEmail: row.purchaser_email,
    amountTotal: row.amount_total,
    currency: row.currency,
    accessMonths: row.access_months,
    ...(row.seat_count ? { seatCount: row.seat_count } : {}),
    recordedAt: toIsoString(row.recorded_at),
  };
}

function mapEnrollment(row: EnrollmentRow): EnrollmentRecord {
  return {
    enrollmentId: row.id,
    checkoutSessionId: row.checkout_session_id,
    offerId: row.offer_id,
    learnerEmail: row.learner_email,
    status: row.status,
    accessStartedAt: toIsoString(row.access_started_at),
    accessExpiresAt: toIsoString(row.access_expires_at),
  };
}

function mapSeatPack(row: SeatPackRow): PracticeSeatPackRecord {
  return {
    seatPackId: row.id,
    checkoutSessionId: row.checkout_session_id,
    offerId: row.offer_id,
    purchaserEmail: row.purchaser_email,
    totalSeats: row.total_seats,
    assignedSeats: row.assigned_seats,
    status: row.status,
    accessStartedAt: toIsoString(row.access_started_at),
    accessExpiresAt: toIsoString(row.access_expires_at),
  };
}

function mapSeatAssignment(
  row: SeatAssignmentRow
): PracticeSeatAssignmentRecord {
  return {
    assignmentId: row.id,
    seatPackId: row.seat_pack_id,
    checkoutSessionId: row.checkout_session_id,
    offerId: row.offer_id,
    learnerEmail: row.learner_email,
    status: row.status,
    assignedAt: toIsoString(row.assigned_at),
    accessStartedAt: toIsoString(row.access_started_at),
    accessExpiresAt: toIsoString(row.access_expires_at),
  };
}

export function createPostgresPurchaseStore(db: Queryable): PurchaseStore {
  return {
    async recordPurchase(purchase) {
      const result = await db.query<PurchaseRow>(
        `
        INSERT INTO commerce_purchases (
          id, stripe_event_id, checkout_session_id, offer_id, purchaser_email,
          amount_total, currency, access_months, seat_count, recorded_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (stripe_event_id) DO NOTHING
        RETURNING *
        `,
        [
          purchaseIdFromSession(purchase.checkoutSessionId),
          purchase.stripeEventId,
          purchase.checkoutSessionId,
          purchase.offerId,
          purchase.purchaserEmail,
          purchase.amountTotal,
          purchase.currency,
          purchase.accessMonths,
          purchase.seatCount ?? null,
          purchase.recordedAt,
        ]
      );

      if (result.rows[0]) {
        return { created: true, purchase: mapPurchase(result.rows[0]) };
      }

      const existing = await db.query<PurchaseRow>(
        "SELECT * FROM commerce_purchases WHERE stripe_event_id = $1",
        [purchase.stripeEventId]
      );

      return { created: false, purchase: mapPurchase(existing.rows[0]) };
    },
    async listPurchases() {
      const result = await db.query<PurchaseRow>(
        "SELECT * FROM commerce_purchases ORDER BY recorded_at DESC"
      );

      return result.rows.map(mapPurchase);
    },
    async findPurchasesByEmail(email) {
      const result = await db.query<PurchaseRow>(
        "SELECT * FROM commerce_purchases WHERE purchaser_email = $1 ORDER BY recorded_at DESC",
        [email.trim().toLowerCase()]
      );

      return result.rows.map(mapPurchase);
    },
  };
}

export function createPostgresEnrollmentStore(db: Queryable): EnrollmentStore {
  return {
    async provisionEnrollment(enrollment) {
      const result = await db.query<EnrollmentRow>(
        `
        INSERT INTO commerce_enrollments (
          id, purchase_id, checkout_session_id, offer_id, learner_email,
          status, access_started_at, access_expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
        `,
        [
          enrollment.enrollmentId,
          purchaseIdFromSession(enrollment.checkoutSessionId),
          enrollment.checkoutSessionId,
          enrollment.offerId,
          enrollment.learnerEmail,
          enrollment.status,
          enrollment.accessStartedAt,
          enrollment.accessExpiresAt,
        ]
      );

      if (result.rows[0]) {
        return { created: true, enrollment: mapEnrollment(result.rows[0]) };
      }

      const existing = await db.query<EnrollmentRow>(
        "SELECT * FROM commerce_enrollments WHERE id = $1",
        [enrollment.enrollmentId]
      );

      return { created: false, enrollment: mapEnrollment(existing.rows[0]) };
    },
    async listEnrollments() {
      const result = await db.query<EnrollmentRow>(
        "SELECT * FROM commerce_enrollments ORDER BY created_at DESC"
      );

      return result.rows.map(mapEnrollment);
    },
    async findEnrollmentsByEmail(email) {
      const result = await db.query<EnrollmentRow>(
        "SELECT * FROM commerce_enrollments WHERE learner_email = $1 ORDER BY access_expires_at DESC",
        [email.trim().toLowerCase()]
      );

      return result.rows.map(mapEnrollment);
    },
    async expireEnrollment(enrollmentId) {
      const result = await db.query<EnrollmentRow>(
        `
        UPDATE commerce_enrollments
        SET status = 'expired', access_expires_at = NOW(), updated_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [enrollmentId]
      );
      const enrollment = result.rows[0];

      if (!enrollment) {
        return { expired: false };
      }

      return { expired: true, enrollment: mapEnrollment(enrollment) };
    },
  };
}

export function createPostgresPracticeSeatPackStore(
  db: TransactionalQueryable
): PracticeSeatPackStore {
  return {
    async provisionPracticeSeatPack(seatPack) {
      const result = await db.query<SeatPackRow>(
        `
        INSERT INTO commerce_practice_seat_packs (
          id, purchase_id, checkout_session_id, offer_id, purchaser_email,
          total_seats, assigned_seats, status, access_started_at, access_expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (checkout_session_id) DO NOTHING
        RETURNING *
        `,
        [
          seatPack.seatPackId,
          purchaseIdFromSession(seatPack.checkoutSessionId),
          seatPack.checkoutSessionId,
          seatPack.offerId,
          seatPack.purchaserEmail,
          seatPack.totalSeats,
          seatPack.assignedSeats,
          seatPack.status,
          seatPack.accessStartedAt,
          seatPack.accessExpiresAt,
        ]
      );

      if (result.rows[0]) {
        return { created: true, seatPack: mapSeatPack(result.rows[0]) };
      }

      const existing = await db.query<SeatPackRow>(
        "SELECT * FROM commerce_practice_seat_packs WHERE checkout_session_id = $1",
        [seatPack.checkoutSessionId]
      );

      return { created: false, seatPack: mapSeatPack(existing.rows[0]) };
    },
    async listPracticeSeatPacks() {
      const result = await db.query<SeatPackRow>(
        "SELECT * FROM commerce_practice_seat_packs ORDER BY created_at DESC"
      );

      return result.rows.map(mapSeatPack);
    },
    async findPracticeSeatPacksByPurchaserEmail(email) {
      const result = await db.query<SeatPackRow>(
        "SELECT * FROM commerce_practice_seat_packs WHERE purchaser_email = $1 ORDER BY created_at DESC",
        [email.trim().toLowerCase()]
      );

      return result.rows.map(mapSeatPack);
    },
    async expirePracticeSeatPack(seatPackId) {
      const result = await db.query<SeatPackRow>(
        `
        UPDATE commerce_practice_seat_packs
        SET status = 'expired', access_expires_at = NOW(), updated_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [seatPackId]
      );
      const seatPack = result.rows[0];

      if (!seatPack) {
        return { expired: false };
      }

      return { expired: true, seatPack: mapSeatPack(seatPack) };
    },
    async assignPracticeSeat({
      seatPackId,
      learnerEmail,
      assignedAt = new Date().toISOString(),
    }): Promise<PracticeSeatAssignmentResult> {
      const normalizedEmail = learnerEmail.trim().toLowerCase();
      const client = await db.connect();

      try {
        await client.query("BEGIN");
        const seatPackResult = await client.query<SeatPackRow>(
          "SELECT * FROM commerce_practice_seat_packs WHERE id = $1 FOR UPDATE",
          [seatPackId]
        );
        const seatPackRow = seatPackResult.rows[0];

        if (!seatPackRow) {
          await client.query("ROLLBACK");
          return {
            assigned: false,
            reason: "Practice seat pack was not found.",
          };
        }

        const existingAssignment = await client.query<SeatAssignmentRow>(
          `
          SELECT a.*, p.checkout_session_id, p.offer_id, p.access_started_at, p.access_expires_at
          FROM commerce_practice_seat_assignments a
          JOIN commerce_practice_seat_packs p ON p.id = a.seat_pack_id
          WHERE a.seat_pack_id = $1 AND a.learner_email = $2
          `,
          [seatPackId, normalizedEmail]
        );

        if (existingAssignment.rows[0]) {
          await client.query("COMMIT");
          return {
            assigned: true,
            assignment: mapSeatAssignment(existingAssignment.rows[0]),
            seatPack: mapSeatPack(seatPackRow),
          };
        }

        if (seatPackRow.status !== "active") {
          await client.query("ROLLBACK");
          return {
            assigned: false,
            reason: "Practice seat pack is not active.",
          };
        }

        if (seatPackRow.assigned_seats >= seatPackRow.total_seats) {
          await client.query("ROLLBACK");
          return {
            assigned: false,
            reason: "Practice seat pack has no seats remaining.",
          };
        }

        const assignmentResult = await client.query<SeatAssignmentRow>(
          `
          INSERT INTO commerce_practice_seat_assignments (
            id, seat_pack_id, learner_email, status, assigned_at
          )
          VALUES ($1, $2, $3, 'active', $4)
          RETURNING id, seat_pack_id, learner_email, status, assigned_at,
            $5::text AS checkout_session_id,
            $6::text AS offer_id,
            $7::timestamptz AS access_started_at,
            $8::timestamptz AS access_expires_at
          `,
          [
            assignmentId(seatPackId, normalizedEmail),
            seatPackId,
            normalizedEmail,
            assignedAt,
            seatPackRow.checkout_session_id,
            seatPackRow.offer_id,
            seatPackRow.access_started_at,
            seatPackRow.access_expires_at,
          ]
        );
        const updatedSeatPack = await client.query<SeatPackRow>(
          `
          UPDATE commerce_practice_seat_packs
          SET assigned_seats = assigned_seats + 1, updated_at = NOW()
          WHERE id = $1
          RETURNING *
          `,
          [seatPackId]
        );

        await client.query("COMMIT");

        return {
          assigned: true,
          assignment: mapSeatAssignment(assignmentResult.rows[0]),
          seatPack: mapSeatPack(updatedSeatPack.rows[0]),
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
    async listPracticeSeatAssignments() {
      const result = await db.query<SeatAssignmentRow>(
        `
        SELECT a.*, p.checkout_session_id, p.offer_id, p.access_started_at, p.access_expires_at
        FROM commerce_practice_seat_assignments a
        JOIN commerce_practice_seat_packs p ON p.id = a.seat_pack_id
        ORDER BY a.assigned_at DESC
        `
      );

      return result.rows.map(mapSeatAssignment);
    },
    async revokePracticeSeatAssignment(assignmentId) {
      const client = await db.connect();

      try {
        await client.query("BEGIN");
        const assignmentResult = await client.query<SeatAssignmentRow>(
          `
          SELECT a.*, p.checkout_session_id, p.offer_id, p.access_started_at, p.access_expires_at
          FROM commerce_practice_seat_assignments a
          JOIN commerce_practice_seat_packs p ON p.id = a.seat_pack_id
          WHERE a.id = $1
          FOR UPDATE
          `,
          [assignmentId]
        );
        const assignment = assignmentResult.rows[0];

        if (!assignment) {
          await client.query("ROLLBACK");
          return { revoked: false };
        }

        const updatedAssignment = await client.query<SeatAssignmentRow>(
          `
          UPDATE commerce_practice_seat_assignments
          SET status = 'revoked', updated_at = NOW()
          WHERE id = $1
          RETURNING id, seat_pack_id, learner_email, status, assigned_at,
            $2::text AS checkout_session_id,
            $3::text AS offer_id,
            $4::timestamptz AS access_started_at,
            NOW() AS access_expires_at
          `,
          [
            assignmentId,
            assignment.checkout_session_id,
            assignment.offer_id,
            assignment.access_started_at,
          ]
        );
        const updatedSeatPack = await client.query<SeatPackRow>(
          `
          UPDATE commerce_practice_seat_packs
          SET assigned_seats = GREATEST(assigned_seats - 1, 0), updated_at = NOW()
          WHERE id = $1 AND $2 <> 'revoked'
          RETURNING *
          `,
          [assignment.seat_pack_id, assignment.status]
        );
        const seatPack =
          updatedSeatPack.rows[0] ??
          (
            await client.query<SeatPackRow>(
              "SELECT * FROM commerce_practice_seat_packs WHERE id = $1",
              [assignment.seat_pack_id]
            )
          ).rows[0];

        await client.query("COMMIT");

        return {
          revoked: true,
          assignment: mapSeatAssignment(updatedAssignment.rows[0]),
          seatPack: seatPack ? mapSeatPack(seatPack) : undefined,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
