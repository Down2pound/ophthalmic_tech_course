#!/usr/bin/env node

const rawUrl =
  process.argv[2]?.trim() ||
  process.env.LAUNCH_BASE_URL?.trim() ||
  process.env.PUBLIC_APP_URL?.trim() ||
  "https://your-real-domain.example";

function normalizeBaseUrl(value) {
  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.replace(/\/+$/, "");
  }
}

function getWarnings(value) {
  const warnings = [];

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (url.protocol !== "https:") {
      warnings.push("Use an https URL before sending links to buyers.");
    }

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      warnings.push("Do not use localhost for Stripe, email, sitemap, or buyers.");
    }

    if (hostname.endsWith(".example") || hostname === "example.com") {
      warnings.push("Replace the example URL with the real Render or custom domain.");
    }
  } catch {
    warnings.push("The URL could not be parsed. Use a full URL like https://your-domain.com.");
  }

  return warnings;
}

const baseUrl = normalizeBaseUrl(rawUrl);
const warnings = getWarnings(baseUrl);

const buyerLinks = [
  ["First-buyer overview", "/first-sale"],
  ["Individual checkout or interest list", "/checkout"],
  ["Practice packs", "/practice-packs"],
  ["Free lesson preview", "/preview"],
  ["Buyer guide", "/buyer-guide"],
  ["Curriculum", "/curriculum"],
  ["Policies", "/policies"],
  ["Sitemap", "/sitemap.xml"],
  ["Robots", "/robots.txt"],
];

const endpointLinks = [
  ["Health", "/api/health"],
  ["Launch readiness", "/api/launch/readiness"],
  ["Checkout availability", "/api/checkout/availability"],
];

function link(path) {
  return `${baseUrl}${path}`;
}

const lines = [
  "# OptiTech Academy Live URL Command Card",
  "",
  `Production URL: ${baseUrl}`,
  "",
  "Simple translation: this turns your live website address into the exact checks and links you need before sending the course to buyers.",
  "",
  "Do not paste Stripe secret keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, or protected health information into this card.",
  "",
  "## URL Warnings",
  "",
  ...(warnings.length > 0
    ? warnings.map(warning => `- ${warning}`)
    : ["- No obvious URL warning found."]),
  "",
  "## Browser Checks",
  "",
  ...endpointLinks.map(([label, path]) => `- ${label}: ${link(path)}`),
  ...buyerLinks.map(([label, path]) => `- ${label}: ${link(path)}`),
  "",
  "## PowerShell Commands",
  "",
  "```powershell",
  `$env:LAUNCH_BASE_URL="${baseUrl}"`,
  '$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"',
  "pnpm launch:smoke",
  '$env:PUBLIC_APP_URL=$env:LAUNCH_BASE_URL',
  "pnpm launch:sitemap",
  "pnpm launch:owner-go-no-go",
  "pnpm launch:first-sales",
  "pnpm launch:first-buyer",
  "```",
  "",
  "## Bash Commands",
  "",
  "```bash",
  `LAUNCH_BASE_URL=${baseUrl} LAUNCH_SMOKE_ALLOW_NOT_READY=true pnpm launch:smoke`,
  `PUBLIC_APP_URL=${baseUrl} pnpm launch:sitemap`,
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:owner-go-no-go`,
  `PUBLIC_APP_URL=${baseUrl} pnpm launch:first-sales`,
  `PUBLIC_APP_URL=${baseUrl} pnpm launch:first-buyer`,
  "```",
  "",
  "## Final Paid Launch Commands",
  "",
  "Use these only after clinical review, database, Stripe, email, admin tokens, and test-mode proof are done:",
  "",
  "```bash",
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:smoke`,
  `LAUNCH_BASE_URL=${baseUrl} pnpm launch:go-no-go`,
  "pnpm launch:live-purchase-test",
  "```",
  "",
  "If anything fails after paid enrollment opens, run:",
  "",
  "```bash",
  "pnpm launch:emergency-stop",
  "```",
  "",
];

console.log(lines.join("\n"));
