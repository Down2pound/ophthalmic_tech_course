import { describe, expect, it } from "vitest";
import { createDefaultAlertTemplates } from "./alertTemplates";

describe("createDefaultAlertTemplates", () => {
  it("creates editable ophthalmology alert templates with stable fields", () => {
    const templates = createDefaultAlertTemplates(() => "2026-07-02T12:00:00.000Z");

    expect(templates).toHaveLength(12);
    expect(templates[0]).toMatchObject({
      id: "oct-room-8",
      label: "OCT Room 8",
      message: "OCT is ready in Room 8.",
      category: "Imaging",
      urgency: "normal",
      room: "Room 8",
      sortOrder: 1,
      isActive: true,
      createdAt: "2026-07-02T12:00:00.000Z",
      updatedAt: "2026-07-02T12:00:00.000Z",
    });
  });
});
