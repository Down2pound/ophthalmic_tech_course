import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const publicSitemapRoutes = [
  "/",
  "/preview",
  "/first-sale",
  "/buyer-guide",
  "/curriculum",
  "/checkout",
  "/practice-packs",
  "/policies",
  "/skills-passport",
  "/career-toolkit",
  "/certificate-preview",
  "/onboarding",
];

function isPlaceholderEnvironmentValue(variableName, value) {
  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.toLowerCase();

  if (
    normalizedValue.includes("replace_with") ||
    normalizedValue.includes("_replace_") ||
    normalizedValue.includes("your_") ||
    normalizedValue.includes("your-") ||
    normalizedValue.includes("example.com") ||
    normalizedValue.includes(".example")
  ) {
    return true;
  }

  if (
    variableName === "PUBLIC_APP_URL" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
      trimmedValue
    )
  ) {
    return true;
  }

  return false;
}

function normalizePublicAppUrl(publicAppUrl) {
  const trimmedUrl = publicAppUrl?.trim() ?? "";

  if (
    !trimmedUrl ||
    isPlaceholderEnvironmentValue("PUBLIC_APP_URL", trimmedUrl)
  ) {
    throw new Error(
      "Set PUBLIC_APP_URL to the real https production domain before generating sitemap.xml."
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error(
      "Set PUBLIC_APP_URL to the real https production domain before generating sitemap.xml."
    );
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      "Set PUBLIC_APP_URL to the real https production domain before generating sitemap.xml."
    );
  }

  return trimmedUrl.replace(/\/+$/, "");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderLaunchSitemap({
  publicAppUrl = process.env.PUBLIC_APP_URL,
  generatedAt = new Date().toISOString(),
} = {}) {
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

async function main() {
  const outputPath = path.resolve(
    process.cwd(),
    process.env.LAUNCH_SITEMAP_PATH || "dist/public/sitemap.xml"
  );
  const sitemap = renderLaunchSitemap();

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, sitemap);

  console.log(`Sitemap written to ${outputPath}`);
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Sitemap generation failed.";
  console.error(message);
  process.exitCode = 1;
});
