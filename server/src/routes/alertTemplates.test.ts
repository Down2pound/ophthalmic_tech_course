import { describe, expect, it } from "vitest";
import { isAlertAdminRequestAuthorized } from "./alertTemplates";

describe("isAlertAdminRequestAuthorized", () => {
  it("denies admin access when no token is configured", () => {
    expect(isAlertAdminRequestAuthorized(undefined, undefined)).toBe(false);
    expect(isAlertAdminRequestAuthorized("", "secret")).toBe(false);
  });

  it("requires a matching admin token when one is configured", () => {
    expect(isAlertAdminRequestAuthorized("secret", undefined)).toBe(false);
    expect(isAlertAdminRequestAuthorized("secret", "wrong")).toBe(false);
    expect(isAlertAdminRequestAuthorized("secret", "secret")).toBe(true);
    expect(isAlertAdminRequestAuthorized(" secret ", "secret")).toBe(true);
  });
});
