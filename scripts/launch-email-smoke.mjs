#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath =
  "launch-evidence/passwordless-email-smoke-report.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function normalizeBaseUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(
      "Set LAUNCH_BASE_URL or PUBLIC_APP_URL to the deployed https site."
    );
  }

  let url;
  try {
    url = new URL(trimmedValue);
  } catch {
    throw new Error(
      "Use a full deployed URL like https://your-domain.example."
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function looksLikeRawSignInLink(value) {
  return /\/api\/auth\/callback\?token=|token=[a-z0-9_-]{16,}/i.test(value);
}

function safeText(value) {
  const text = typeof value === "string" ? value : "";
  if (looksLikeRawSignInLink(text)) return "[redacted unsafe sign-in link]";
  return text;
}

function renderReport({ baseUrl, email, status, payload, ok, generatedAt }) {
  const responseText = JSON.stringify(payload ?? {});
  const unsafeTokenExposed = looksLikeRawSignInLink(responseText);

  return [
    "# OptiTech Academy Passwordless Email Smoke Test",
    "",
    `Generated at: ${generatedAt}`,
    `Production URL: ${baseUrl}`,
    `Test email: ${email}`,
    "",
    "Simple translation: this proves the deployed app accepted a request to send a sign-in email. Check the inbox next, but do not save the raw sign-in link.",
    "",
    "## Result",
    "",
    `- Request accepted: ${ok ? "yes" : "no"}`,
    `- HTTP status: ${status}`,
    `- Public message: ${safeText(payload?.message) || "none"}`,
    `- Public error: ${safeText(payload?.error) || "none"}`,
    `- Raw sign-in link exposed by API response: ${unsafeTokenExposed ? "yes - fix before launch" : "no"}`,
    "",
    "## Manual Inbox Checks",
    "",
    "- [ ] Email arrived in inbox, spam, or quarantine review.",
    "- [ ] Sender matches the verified production sender.",
    "- [ ] Link opens the deployed production domain.",
    "- [ ] Link opens `/learn` and creates a learner session.",
    "- [ ] The same link cannot be reused.",
    "",
    "Do not paste raw sign-in links, tokens, cookies, email API keys, database passwords, card numbers, patient information, protected health information, or private learner details into this report.",
    "",
  ].join("\n");
}

async function main() {
  const rawBaseUrl =
    getArgValue("url") ||
    process.argv[2] ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    "";
  const email = normalizeEmail(
    getArgValue("email") || process.env.LAUNCH_TEST_EMAIL || ""
  );

  if (!email || !email.includes("@")) {
    throw new Error(
      `Set LAUNCH_TEST_EMAIL or pass --email=internal.test@example.com. To save proof, set LAUNCH_EMAIL_SMOKE_REPORT_PATH=${recommendedReportPath}.`
    );
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const generatedAt = new Date().toISOString();
  const response = await fetch(`${baseUrl}/api/auth/passwordless/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const payload = await response.json().catch(() => ({}));
  const report = renderReport({
    baseUrl,
    email,
    status: response.status,
    payload,
    ok: response.ok,
    generatedAt,
  });

  console.log(report);

  if (process.env.LAUNCH_EMAIL_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_EMAIL_SMOKE_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, report, "utf8");
    console.log(`Report written: ${reportPath}`);
  }

  process.exitCode = response.ok ? 0 : 1;
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Passwordless email smoke test failed."
  );
  process.exitCode = 1;
});
