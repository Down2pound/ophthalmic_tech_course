import { Buffer } from "node:buffer";
import { describe, expect, it } from "vitest";
import { renderLaunchSecrets } from "./launchSecrets";

describe("renderLaunchSecrets", () => {
  it("renders strong launch secret environment values without placeholders", () => {
    let fillByte = 1;
    const report = renderLaunchSecrets({
      randomBytesProvider: size => Buffer.alloc(size, fillByte++),
    });

    expect(report).toContain("# OptiTech Academy Launch Secrets");
    expect(report).toContain("AUTH_SESSION_SECRET=");
    expect(report).toContain("PRACTICE_SEAT_ADMIN_TOKEN=");
    expect(report).toContain("Do not commit them to Git");
    expect(report).not.toContain("replace_with");
    expect(report).not.toContain("example.com");

    const values = report
      .split("\n")
      .filter(line => line.includes("="))
      .map(line => line.split("=")[1]);

    expect(values).toHaveLength(2);
    expect(values.every(value => value.length >= 32)).toBe(true);
    expect(new Set(values).size).toBe(2);
  });
});
