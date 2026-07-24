#!/usr/bin/env node

const publicPaths = [
  "/",
  "/preview",
  "/buyer-guide",
  "/checkout",
  "/practice-packs",
  "/policies",
  "/curriculum",
  "/onboarding",
  "/skills-passport",
  "/career-toolkit",
  "/certificate-preview",
];

const requiredSecurityHeaders = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)"],
  ["Cross-Origin-Opener-Policy", "same-origin"],
];

const requiredRobotsRules = [
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /admin",
  "Disallow: /send",
  "Disallow: /practice-seat-admin",
  "Disallow: /launch-readiness",
];

function trimBaseUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

function renderUsage() {
  return [
    "# OptiTech Academy Owner Go/No-Go",
    "",
    "Set a production URL before running the live check:",
    "",
    "```bash",
    "LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:owner-go-no-go",
    "```",
    "",
    "Simple translation: this is a work-computer-safe traffic light. It reads the deployed site and tells you what is safe to share.",
    "",
    "It does not submit practice inquiries, create buyers, send email, run Stripe payments, or print secret values.",
    "",
  ].join("\n");
}

async function fetchText(url) {
  const response = await fetch(url);
  const text = await response.text().catch(() => "");

  return { response, text };
}

async function fetchJson(url) {
  const { response, text } = await fetchText(url);

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}.`);
  }

  return JSON.parse(text);
}

function listResult(label, ok, detail = "") {
  return `- ${label}: ${ok ? "ok" : "failed"}${detail ? ` (${detail})` : ""}`;
}

function getReadinessBlockers(readiness) {
  const staticBlockers = readiness?.staticSummary?.blockers;
  if (Array.isArray(staticBlockers)) return staticBlockers;

  const launchActions = readiness?.launchActions;
  if (Array.isArray(launchActions)) {
    return launchActions
      .filter(action => action?.status !== "complete")
      .map(action => action?.title)
      .filter(Boolean);
  }

  return [];
}

function getReadinessWarnings(readiness) {
  return Array.isArray(readiness?.warnings) ? readiness.warnings : [];
}

function renderDecision({ basicOk, readyForPaidLaunch, blockers, warnings }) {
  if (!basicOk) {
    return {
      preview: "NO-GO",
      practice: "NO-GO",
      paid: "NO-GO",
      summary:
        "Do not share the site yet. A basic public page, health, checkout availability, security header, or robots.txt check failed.",
      actions: [
        "Fix the failed deployed-site check.",
        "Keep ENABLE_PAID_ENROLLMENT=false.",
        "Rerun this command and the full smoke test from a home PC.",
      ],
    };
  }

  if (!readyForPaidLaunch) {
    return {
      preview: "GO",
      practice: "CAUTION",
      paid: "NO-GO",
      summary:
        "The public site appears shareable for review, but paid checkout links should stay closed.",
      actions: [
        "Share public preview, curriculum, policies, buyer guide, or practice inquiry links only.",
        "Clear the readiness blockers before sending paid checkout links.",
        "Run one internal live purchase after readiness turns green.",
      ],
    };
  }

  return {
    preview: "GO",
    practice: "GO",
    paid: "GO",
    summary:
      "The basic live-site checks and paid readiness are green. Use one controlled internal live purchase before broad outreach.",
    actions: [
      "Run pnpm launch:live-purchase-test.",
      "Confirm payment, webhook fulfillment, welcome email, sign-in, and Module 1 access.",
      "Use pnpm launch:first-week-sales and the sales trackers for controlled outreach.",
    ],
  };
}

function formatLink(label, url, status) {
  return `- ${label}: ${status} - ${url}`;
}

function renderShareableLinks({ baseUrl, decision }) {
  const previewStatus = decision.preview === "GO" ? "shareable" : "hold";
  const practiceStatus =
    decision.practice === "GO"
      ? "shareable"
      : decision.practice === "CAUTION"
        ? "review-only"
        : "hold";
  const paidStatus = decision.paid === "GO" ? "shareable" : "do not share";

  return [
    "## Shareable Link Buckets",
    "",
    "Public preview links:",
    "",
    formatLink("Preview", `${baseUrl}/preview`, previewStatus),
    formatLink("Curriculum", `${baseUrl}/curriculum`, previewStatus),
    formatLink("Buyer guide", `${baseUrl}/buyer-guide`, previewStatus),
    formatLink("Policies", `${baseUrl}/policies`, previewStatus),
    "",
    "Practice outreach links:",
    "",
    formatLink("Practice packs", `${baseUrl}/practice-packs`, practiceStatus),
    formatLink("Onboarding overview", `${baseUrl}/onboarding`, practiceStatus),
    formatLink("Skills passport", `${baseUrl}/skills-passport`, practiceStatus),
    "",
    "Paid checkout links:",
    "",
    formatLink("Individual checkout", `${baseUrl}/checkout`, paidStatus),
    formatLink("Practice pack checkout", `${baseUrl}/practice-packs`, paidStatus),
    "",
    decision.paid === "GO"
      ? "Paid links are marked shareable only because paid readiness is green. Still run one controlled internal live purchase before broad outreach."
      : "Paid links are listed for convenience, but they should not be sent to buyers until paid readiness is green and one internal live purchase works.",
    "",
  ];
}

async function run() {
  const baseUrl = trimBaseUrl(
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || ""
  );

  if (!baseUrl) {
    console.log(renderUsage());
    return 0;
  }

  const generatedAt = new Date().toISOString();
  const health = await fetchJson(`${baseUrl}/api/health`).catch(error => ({
    ok: false,
    error: error instanceof Error ? error.message : "Health check failed.",
  }));
  const readiness = await fetchJson(`${baseUrl}/api/launch/readiness`).catch(
    error => ({
      readFailed: true,
      readyForPaidLaunch: false,
      warnings: [
        error instanceof Error ? error.message : "Readiness check failed.",
      ],
      staticSummary: {
        blockers: ["Readiness endpoint could not be read."],
      },
    })
  );
  const checkoutAvailability = await fetchJson(
    `${baseUrl}/api/checkout/availability`
  ).catch(error => ({
    ready: null,
    error:
      error instanceof Error
        ? error.message
        : "Checkout availability check failed.",
  }));

  const pageResults = [];
  for (const path of publicPaths) {
    const result = await fetchText(`${baseUrl}${path}`).catch(error => ({
      response: { ok: false, status: "network" },
      text: error instanceof Error ? error.message : "",
    }));
    pageResults.push({
      path,
      ok: result.response.ok,
      status: result.response.status,
    });
  }

  const home = await fetchText(`${baseUrl}/`).catch(error => ({
    response: {
      ok: false,
      status: "network",
      headers: new Headers(),
    },
    text: error instanceof Error ? error.message : "",
  }));
  const securityHeaderResults = requiredSecurityHeaders.map(
    ([header, expected]) => {
      const actual = home.response.headers.get(header);
      return {
        header,
        expected,
        actual,
        ok: actual === expected,
      };
    }
  );

  const robots = await fetchText(`${baseUrl}/robots.txt`).catch(() => ({
    response: { ok: false, status: "network" },
    text: "",
  }));
  const robotRuleResults = requiredRobotsRules.map(rule => ({
    rule,
    ok: robots.text.includes(rule),
  }));

  const healthOk = health.ok === true;
  const readinessRead =
    Boolean(readiness) &&
    !readiness.readFailed &&
    Array.isArray(readiness.warnings);
  const checkoutAvailabilityOk =
    typeof checkoutAvailability.ready === "boolean";
  const publicPagesOk = pageResults.every(page => page.ok);
  const securityHeadersOk = securityHeaderResults.every(header => header.ok);
  const robotsOk =
    robots.response.ok && robotRuleResults.every(rule => rule.ok);
  const readyForPaidLaunch = readiness.readyForPaidLaunch === true;
  const basicOk =
    healthOk &&
    readinessRead &&
    checkoutAvailabilityOk &&
    publicPagesOk &&
    securityHeadersOk &&
    robotsOk;
  const blockers = getReadinessBlockers(readiness);
  const warnings = getReadinessWarnings(readiness);
  const decision = renderDecision({
    basicOk,
    readyForPaidLaunch,
    blockers,
    warnings,
  });

  const lines = [
    "# OptiTech Academy Owner Go/No-Go",
    "",
    `Generated at: ${generatedAt}`,
    `Deployment URL: ${baseUrl}`,
    "",
    "Simple translation: this tells you what you can safely share right now.",
    "",
    "## Decision",
    "",
    `- Public preview links: ${decision.preview}`,
    `- Practice inquiry links: ${decision.practice}`,
    `- Paid checkout links: ${decision.paid}`,
    "",
    decision.summary,
    "",
    ...renderShareableLinks({ baseUrl, decision }),
    "## Basic Evidence",
    "",
    listResult("Health endpoint", healthOk),
    listResult("Readiness endpoint", readinessRead),
    listResult("Checkout availability endpoint", checkoutAvailabilityOk),
    listResult("Public pages", publicPagesOk),
    listResult("Security headers", securityHeadersOk),
    listResult("Robots.txt rules", robotsOk, `HTTP ${robots.response.status}`),
    listResult("Paid launch readiness", readyForPaidLaunch ? true : false),
    "",
    "## Public Pages",
    "",
    ...pageResults.map(page =>
      listResult(page.path, page.ok, `HTTP ${page.status}`)
    ),
    "",
    "## Security Headers",
    "",
    ...securityHeaderResults.map(header =>
      listResult(
        header.header,
        header.ok,
        header.ok ? "" : `expected ${header.expected}, got ${header.actual ?? "missing"}`
      )
    ),
    "",
    "## Robots.txt",
    "",
    ...robotRuleResults.map(rule => listResult(rule.rule, rule.ok)),
    "",
    "## Readiness Blockers",
    "",
    ...(blockers.length > 0
      ? blockers.map(blocker => `- ${blocker}`)
      : ["- No readiness blockers reported."]),
    "",
    "## Warnings",
    "",
    ...(warnings.length > 0
      ? warnings.map(warning => `- ${warning}`)
      : ["- No warnings reported."]),
    "",
    "## Next Actions",
    "",
    ...decision.actions.map(action => `- ${action}`),
    "",
    "Do not paste secrets, tokens, card numbers, raw sign-in links, session cookies, patient information, protected health information, or private employee details into this report.",
    "",
  ];

  console.log(lines.join("\n"));

  return basicOk ? 0 : 1;
}

run()
  .then(exitCode => {
    process.exitCode = exitCode;
  })
  .catch(error => {
    console.error(
      error instanceof Error ? error.message : "Owner go/no-go check failed."
    );
    process.exitCode = 1;
  });
