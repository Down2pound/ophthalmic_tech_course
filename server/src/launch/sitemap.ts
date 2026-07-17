import { isUnsafeLaunchEnvironmentValue } from "../config/environment";

export const publicSitemapRoutes = [
  "/",
  "/preview",
  "/buyer-guide",
  "/curriculum",
  "/checkout",
  "/practice-packs",
  "/policies",
  "/skills-passport",
  "/career-toolkit",
  "/onboarding",
] as const;

export interface LaunchSitemapInput {
  publicAppUrl?: string;
  generatedAt?: string;
}

function normalizePublicAppUrl(publicAppUrl?: string): string {
  const trimmedUrl = publicAppUrl?.trim() ?? "";

  if (
    !trimmedUrl ||
    isUnsafeLaunchEnvironmentValue("PUBLIC_APP_URL", trimmedUrl)
  ) {
    throw new Error(
      "Set PUBLIC_APP_URL to the real https production domain before generating sitemap.xml."
    );
  }

  return trimmedUrl.replace(/\/+$/, "");
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderLaunchSitemap({
  publicAppUrl = process.env.PUBLIC_APP_URL,
  generatedAt = new Date().toISOString(),
}: LaunchSitemapInput = {}): string {
  const normalizedPublicAppUrl = normalizePublicAppUrl(publicAppUrl);
  const lastModifiedDate = generatedAt.slice(0, 10);

  const urls = publicSitemapRoutes
    .map(route => {
      const location = `${normalizedPublicAppUrl}${route === "/" ? "" : route}`;

      return [
        "  <url>",
        `    <loc>${escapeXml(location)}</loc>`,
        `    <lastmod>${lastModifiedDate}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        route === "/"
          ? "    <priority>1.0</priority>"
          : "    <priority>0.8</priority>",
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}
