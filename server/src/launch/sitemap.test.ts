import { describe, expect, it } from "vitest";
import { publicSitemapRoutes, renderLaunchSitemap } from "./sitemap";

describe("renderLaunchSitemap", () => {
  it("renders public buyer-facing routes with the production domain", () => {
    const sitemap = renderLaunchSitemap({
      publicAppUrl: "https://academy.spindeleye.com/",
      generatedAt: "2026-07-13T12:00:00.000Z",
    });

    expect(sitemap).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(sitemap).toContain("<loc>https://academy.spindeleye.com</loc>");
    expect(sitemap).toContain(
      "<loc>https://academy.spindeleye.com/practice-packs</loc>"
    );
    expect(sitemap).toContain("<lastmod>2026-07-13</lastmod>");
    expect(sitemap).not.toContain("/api/");
    expect(sitemap).not.toContain("/practice-seat-admin");
    expect(sitemap).not.toContain("/launch-readiness");

    for (const route of publicSitemapRoutes) {
      const location =
        route === "/"
          ? "https://academy.spindeleye.com"
          : `https://academy.spindeleye.com${route}`;

      expect(sitemap).toContain(`<loc>${location}</loc>`);
    }
  });

  it("rejects placeholder, localhost, and non-https app URLs", () => {
    expect(() =>
      renderLaunchSitemap({ publicAppUrl: "https://your-site.example.com" })
    ).toThrow("Set PUBLIC_APP_URL");
    expect(() =>
      renderLaunchSitemap({ publicAppUrl: "http://localhost:3000" })
    ).toThrow("Set PUBLIC_APP_URL");
    expect(() =>
      renderLaunchSitemap({ publicAppUrl: "http://academy.spindeleye.com" })
    ).toThrow("Set PUBLIC_APP_URL");
  });
});
