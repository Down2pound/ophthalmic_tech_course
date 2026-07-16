import { describe, expect, it } from "vitest";
import { getHealthReport } from "./health";

describe("getHealthReport", () => {
  it("returns a safe deployment health payload", () => {
    expect(
      getHealthReport({
        env: {
          NODE_ENV: "production",
          RENDER_GIT_BRANCH: "main",
          RENDER_GIT_COMMIT: "1234567890abcdef1234567890abcdef12345678",
          RENDER_SERVICE_NAME: "optitech-academy",
          RENDER_EXTERNAL_URL: "https://learn.example.com",
        },
        uptime: () => 12.4,
      })
    ).toEqual({
      ok: true,
      service: "optitech-academy",
      environment: "production",
      uptimeSeconds: 12,
      release: {
        branch: "main",
        commit: "1234567",
        host: "render",
        serviceName: "optitech-academy",
        url: "https://learn.example.com",
      },
    });
  });

  it("omits release fields that the host does not provide", () => {
    expect(
      getHealthReport({
        env: { NODE_ENV: "test" },
        uptime: () => 0,
      }).release
    ).toEqual({
      host: "local",
    });
  });
});
