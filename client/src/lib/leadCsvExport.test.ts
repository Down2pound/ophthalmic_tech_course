import { describe, expect, it, vi } from "vitest";
import {
  buildBuyerSupportCsv,
  buildLearnerLeadCsv,
  buildPracticeLeadCsv,
  downloadCsvFile,
} from "./leadCsvExport";

describe("lead CSV export", () => {
  it("builds a practice lead CSV that spreadsheet tools can open safely", () => {
    const csv = buildPracticeLeadCsv([
      {
        inquiryId: "practice_inquiry_123",
        practiceName: 'Example "Eye", Care',
        contactName: "Dr. Manager",
        contactEmail: "manager@example.com",
        estimatedLearnerCount: 12,
        targetTimeline: "Next hiring class",
        message: "Need onboarding.\nNo patient details.",
        status: "new",
        createdAt: "2026-07-17T12:00:00.000Z",
        followUpPlan: {
          priority: "high",
          recommendedOffer: "Custom practice onboarding call",
          nextAction: "Reply within 1 business day.",
          talkingPoints: ["Confirm learner count."],
        },
      },
    ]);

    expect(csv).toContain('"Practice"');
    expect(csv).toContain('"high"');
    expect(csv).toContain('"Example ""Eye"", Care"');
    expect(csv).toContain('"Need onboarding. No patient details."');
    expect(csv).toContain('"practice_inquiry_123"');
  });

  it("builds a learner lead CSV with the recommended follow-up step", () => {
    const csv = buildLearnerLeadCsv([
      {
        interestId: "learner_interest_123",
        learnerName: "Future Tech",
        email: "learner@example.com",
        background: "Medical assistant",
        goal: "I want eye-care vocabulary.",
        status: "new",
        createdAt: "2026-07-17T12:00:00.000Z",
      },
    ]);

    expect(csv).toContain('"Future Tech"');
    expect(csv).toContain('"learner@example.com"');
    expect(csv).toContain("learner decision one-pager");
    expect(csv).toContain('"learner_interest_123"');
  });

  it("builds a buyer support CSV with safe record IDs and actions", () => {
    const csv = buildBuyerSupportCsv({
      email: "learner@example.com",
      purchases: [
        {
          checkoutSessionId: "cs_test_123",
          offerId: "founding-learner",
        },
      ],
      enrollments: [
        {
          enrollmentId: "enrollment_cs_test_123",
          offerId: "founding-learner",
          status: "active",
          accessExpiresAt: "2027-07-24T12:00:00.000Z",
        },
      ],
      practiceSeatPacks: [
        {
          seatPackId: "seatpack_cs_test_practice",
          offerId: "practice-five-seat-pack",
          totalSeats: 5,
          assignedSeats: 2,
          status: "active",
        },
      ],
      practiceSeatAssignments: [
        {
          assignmentId: "assignment_123",
          seatPackId: "seatpack_cs_test_practice",
          learnerEmail: "newtech@example.com",
          status: "active",
        },
      ],
      summary: {
        hasPurchase: true,
        hasActiveEnrollment: true,
        hasPracticeSeatPack: true,
        hasPracticeSeatAssignment: true,
        remainingPracticeSeats: 3,
      },
      recommendedActions: [
        "Ask the learner to request a fresh passwordless sign-in link.",
      ],
    });

    expect(csv).toContain('"cs_test_123"');
    expect(csv).toContain('"enrollment_cs_test_123"');
    expect(csv).toContain('"seatpack_cs_test_practice"');
    expect(csv).toContain('"assignment_123"');
    expect(csv).toContain("recommended-action");
    expect(csv).toContain("Do not save secrets");
    expect(csv).not.toContain("raw-sign-in-token");
  });

  it("downloads CSV without sending lead data to a server", () => {
    const click = vi.fn();
    const remove = vi.fn();
    const appendChild = vi.fn();
    const createElement = vi.fn(() => ({
      click,
      remove,
      style: {},
    }));
    const createObjectURL = vi.fn(() => "blob:lead-csv");
    const revokeObjectURL = vi.fn();

    downloadCsvFile({
      filename: "leads.csv",
      csv: '"Email"\n"learner@example.com"',
      documentRef: {
        createElement,
        body: { appendChild },
      } as unknown as Document,
      urlRef: { createObjectURL, revokeObjectURL },
    });

    expect(createElement).toHaveBeenCalledWith("a");
    expect(appendChild).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:lead-csv");
  });
});
