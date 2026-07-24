import { describe, expect, it } from "vitest";
import {
  createLearnerLeadFollowUpHref,
  createPracticeLeadFollowUpHref,
} from "./leadFollowUpMessages";

describe("lead follow-up messages", () => {
  it("creates a safe learner follow-up mailto", () => {
    const href = createLearnerLeadFollowUpHref({
      publicAppUrl: "https://academy.example.com",
      lead: {
        learnerName: "Future Tech",
        email: "learner@example.com",
        background: "Medical assistant",
        goal: "Learn ophthalmic vocabulary",
      },
    });
    const decoded = decodeURIComponent(href);

    expect(href).toContain("mailto:learner@example.com");
    expect(decoded).toContain("OptiTech Academy founding learner follow-up");
    expect(decoded).toContain("https://academy.example.com/preview");
    expect(decoded).toContain("https://academy.example.com/buyer-guide");
    expect(decoded).toContain("https://academy.example.com/checkout");
    expect(decoded).toContain("Paid enrollment may still be paused");
    expect(decoded).toContain("not certification");
    expect(decoded).not.toMatch(/guarantee/i);
    expect(decoded).not.toMatch(/certified technician/i);
  });

  it("creates a safe practice follow-up mailto", () => {
    const href = createPracticeLeadFollowUpHref({
      publicAppUrl: "https://academy.example.com",
      lead: {
        practiceName: "Example Eye",
        contactName: "Dr. Manager",
        contactEmail: "manager@example.com",
        estimatedLearnerCount: 8,
        targetTimeline: "Next hiring class",
      },
    });
    const decoded = decodeURIComponent(href);

    expect(href).toContain("mailto:manager@example.com");
    expect(decoded).toContain("OptiTech Academy practice onboarding follow-up");
    expect(decoded).toContain("Example Eye");
    expect(decoded).toContain("Estimated learners: 8");
    expect(decoded).toContain("https://academy.example.com/practice-packs");
    expect(decoded).toContain("Paid enrollment may still be paused");
    expect(decoded).toContain("hands-on competency signoff");
    expect(decoded).not.toMatch(/guarantee/i);
    expect(decoded).not.toMatch(/replaces? supervision/i);
  });

  it("can mark learner follow-up drafts as paid-enrollment ready", () => {
    const href = createLearnerLeadFollowUpHref({
      publicAppUrl: "https://academy.example.com",
      paidEnrollmentReady: true,
      lead: {
        learnerName: "Future Tech",
        email: "learner@example.com",
        background: "Medical assistant",
        goal: "Learn ophthalmic vocabulary",
      },
    });
    const decoded = decodeURIComponent(href);

    expect(decoded).toContain("Paid enrollment is open");
    expect(decoded).toContain("Individual access: https://academy.example.com/checkout");
  });

  it("falls back to a placeholder domain when the draft public URL is invalid", () => {
    const href = createLearnerLeadFollowUpHref({
      publicAppUrl: "not a url yet",
      lead: {
        learnerName: "Future Tech",
        email: "learner@example.com",
        background: "Student",
        goal: "Explore eye care",
      },
    });
    const decoded = decodeURIComponent(href);

    expect(decoded).toContain("https://your-real-domain.example/preview");
    expect(decoded).toContain("https://your-real-domain.example/checkout");
  });
});
