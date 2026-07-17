import { describe, expect, it, vi } from "vitest";
import {
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
