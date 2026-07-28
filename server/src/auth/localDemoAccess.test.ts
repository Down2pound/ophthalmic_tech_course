import { describe, expect, it } from "vitest";
import {
  createLocalDemoEnrollment,
  isLocalDemoAccessAllowed,
} from "./localDemoAccess";

describe("local demo course access", () => {
  it("only allows demo learner access when the flag and localhost host are present", () => {
    expect(
      isLocalDemoAccessAllowed({
        env: { ENABLE_LOCAL_COURSE_DEMO: "true" },
        host: "localhost:3000",
      })
    ).toBe(true);

    expect(
      isLocalDemoAccessAllowed({
        env: { ENABLE_LOCAL_COURSE_DEMO: "false" },
        host: "localhost:3000",
      })
    ).toBe(false);

    expect(
      isLocalDemoAccessAllowed({
        env: { ENABLE_LOCAL_COURSE_DEMO: "true" },
        host: "optitech-academy.example.com",
      })
    ).toBe(false);
  });

  it("creates an active founding learner enrollment for the demo email", () => {
    const enrollment = createLocalDemoEnrollment({
      email: " Jeff.Test@Example.com ",
      now: "2026-07-28T12:00:00.000Z",
    });

    expect(enrollment).toMatchObject({
      enrollmentId: "demo_enrollment_jeff_test_example_com",
      checkoutSessionId: "cs_demo_local_course",
      offerId: "founding-learner",
      learnerEmail: "jeff.test@example.com",
      status: "active",
      accessStartedAt: "2026-07-28T12:00:00.000Z",
    });
    expect(new Date(enrollment.accessExpiresAt).getTime()).toBeGreaterThan(
      new Date("2026-07-28T12:00:00.000Z").getTime()
    );
  });
});
