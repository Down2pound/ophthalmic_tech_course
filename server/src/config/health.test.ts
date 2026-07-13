import { describe, expect, it } from "vitest";
import { getHealthReport } from "./health";

describe("getHealthReport", () => {
  it("returns a safe deployment health payload", () => {
    expect(
      getHealthReport({
        env: { NODE_ENV: "production" },
        uptime: () => 12.4,
      })
    ).toEqual({
      ok: true,
      service: "optitech-academy",
      environment: "production",
      uptimeSeconds: 12,
    });
  });
});
