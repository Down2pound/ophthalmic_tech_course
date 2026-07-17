import { describe, expect, it } from "vitest";
import { injectPublicAppUrlMetadata } from "./indexHtmlMetadata";

describe("injectPublicAppUrlMetadata", () => {
  it("injects the production public app url into storefront metadata", () => {
    const html = injectPublicAppUrlMetadata({
      html: '<meta property="og:url" content="__PUBLIC_APP_URL__/" /><meta property="og:image" content="__PUBLIC_APP_URL__/social-preview.svg" />',
      publicAppUrl: "https://academy.spindeleye.com/",
    });

    expect(html).toContain('content="https://academy.spindeleye.com/"');
    expect(html).toContain(
      'content="https://academy.spindeleye.com/social-preview.svg"'
    );
  });

  it("removes placeholder domains when the production url is not safe yet", () => {
    const html = injectPublicAppUrlMetadata({
      html: '<link rel="canonical" href="__PUBLIC_APP_URL__/" /><meta property="og:image" content="__PUBLIC_APP_URL__/social-preview.svg" />',
      publicAppUrl: "https://your-real-domain.example",
    });

    expect(html).toContain('href="/"');
    expect(html).toContain('content="/social-preview.svg"');
    expect(html).not.toContain("__PUBLIC_APP_URL__");
    expect(html).not.toContain("your-real-domain.example");
  });
});
