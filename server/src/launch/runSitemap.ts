import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderLaunchSitemap } from "./sitemap";

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
