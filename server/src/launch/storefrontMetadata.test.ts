import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { foundingLearnerOffer } from "../../../shared/commerce/offers";

function extractStructuredData(html: string): unknown[] {
  const matches = html.matchAll(
    /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g
  );

  return Array.from(matches, match => JSON.parse(match[1]));
}

describe("storefront metadata", () => {
  it("publishes safe social sharing metadata without localhost or admin links", async () => {
    const html = await readFile(
      path.resolve(process.cwd(), "client/index.html"),
      "utf8"
    );

    expect(html).toContain('rel="canonical"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('name="twitter:image"');
    expect(html).toContain("/social-preview.svg");
    expect(html).not.toContain("localhost");
    expect(html).not.toContain("/practice-seat-admin");
    expect(html).not.toContain("/api/");
  });

  it("publishes course structured data aligned with the founding offer", async () => {
    const html = await readFile(
      path.resolve(process.cwd(), "client/index.html"),
      "utf8"
    );

    const structuredData = extractStructuredData(html);
    const course = structuredData.find(item => {
      const metadata =
        typeof item === "object" && item !== null
          ? (item as Record<string, unknown>)
          : null;

      return (
        metadata !== null &&
        "@type" in metadata &&
        metadata["@type"] === "Course"
      );
    });

    expect(course).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Course",
      provider: {
        "@type": "Organization",
        name: "OptiTech Academy",
      },
      offers: {
        "@type": "Offer",
        name: foundingLearnerOffer.name,
        price: (foundingLearnerOffer.priceCents / 100).toFixed(2),
        priceCurrency: foundingLearnerOffer.currency.toUpperCase(),
      },
      isAccessibleForFree: false,
    });
  });
});
