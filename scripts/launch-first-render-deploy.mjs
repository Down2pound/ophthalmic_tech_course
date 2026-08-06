#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const deployLink =
  "https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FDown2pound%2Fophthalmic_tech_course%2Ftree%2Fcodex%2Foptitech-product-spec";
const recommendedReportPath = "launch-evidence/first-render-deploy-evidence.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_FIRST_RENDER_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function getBaseUrl() {
  return (
    getArgValue("base-url") ||
    process.argv.find(arg => !arg.startsWith("--") && /^https?:\/\//i.test(arg)) ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    "https://your-real-domain.example"
  ).replace(/\/+$/, "");
}

async function readTextIfExists(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function getGitInfo() {
  const dotGitPath = path.join(projectRoot, ".git");
  const dotGitContent = await readTextIfExists(dotGitPath);
  const gitDir = dotGitContent.startsWith("gitdir:")
    ? path.resolve(projectRoot, dotGitContent.replace("gitdir:", "").trim())
    : dotGitPath;
  const head = (await readTextIfExists(path.join(gitDir, "HEAD"))).trim();

  if (!head) {
    return { branch: "[unknown branch]", commit: "[unknown commit]" };
  }

  if (!head.startsWith("ref:")) {
    return { branch: "[detached head]", commit: head.slice(0, 7) };
  }

  const ref = head.replace("ref:", "").trim();
  const branch = ref.replace("refs/heads/", "");
  const commit = (await readTextIfExists(path.join(gitDir, ref))).trim();

  return {
    branch,
    commit: commit ? commit.slice(0, 7) : "[unknown commit]",
  };
}

function renderPacket({ baseUrl, branch, commit, generatedDate }) {
  return [
    "# OptiTech Academy First Render Deploy Evidence",
    "",
    "Use this card when opening Render for the first hosted deploy.",
    "",
    "Simple translation: this is the receipt that says the code was checked before you put the store online. It also tells you what to check after Render gives you the public website link.",
    "",
    "Do not paste `.env`, Stripe secret keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, protected health information, or private learner details into this file.",
    "",
    "## Current Code Label",
    "",
    `- Branch: \`${branch}\``,
    `- Commit to deploy: \`${commit}\``,
    `- Packet generated: \`${generatedDate}\``,
    "",
    "## Preflight Proof",
    "",
    "Run this immediately before clicking deploy, then keep the passing terminal result with launch evidence:",
    "",
    "```bash",
    "pnpm launch:preflight",
    "```",
    "",
    "Record the result here after it passes:",
    "",
    "- Preflight date: [fill date]",
    "- TypeScript check: [passed / not passed yet]",
    "- Test suite: [passed / not passed yet]",
    "- Secret scan: [passed / not passed yet]",
    "- Offer audit: [passed / not passed yet]",
    "- Deployment audit: [passed / not passed yet]",
    "- Production build: [passed / not passed yet]",
    "- Local course smoke: [passed / not passed yet]",
    "- Launch evidence bundle: [regenerated / not regenerated yet]",
    "",
    "## Render Deploy Link",
    "",
    "Use the branch-specific deploy link so Render opens the correct copy:",
    "",
    "```text",
    deployLink,
    "```",
    "",
    "## First Deploy Safety Settings",
    "",
    "Keep these values closed for the first hosted deploy:",
    "",
    "```text",
    "ENABLE_PAID_ENROLLMENT=false",
    "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false",
    "```",
    "",
    "Beginner translation: put the website online first, but keep the cash register locked until clinical review, Stripe, email, database, and live-purchase proof are finished.",
    "",
    "## After Render Gives You A URL",
    "",
    "Write the public URL here:",
    "",
    "```text",
    `PUBLIC_APP_URL=${baseUrl}`,
    "```",
    "",
    "Then check these pages in the browser:",
    "",
    "```text",
    `${baseUrl}/api/health`,
    `${baseUrl}/api/launch/readiness`,
    `${baseUrl}/api/checkout/availability`,
    `${baseUrl}/first-sale`,
    `${baseUrl}/preview`,
    `${baseUrl}/practice-packs`,
    "```",
    "",
    "## First Smoke Test",
    "",
    "Run this while paid enrollment is still closed. It also saves a Markdown smoke report in `launch-evidence/first-render-smoke-report.md`:",
    "",
    "```powershell",
    '$env:LAUNCH_SMOKE_ALLOW_NOT_READY="true"',
    `$env:LAUNCH_BASE_URL="${baseUrl}"`,
    `$env:LAUNCH_EXPECTED_COMMIT="${commit}"`,
    '$env:LAUNCH_SMOKE_REPORT_PATH="launch-evidence/first-render-smoke-report.md"',
    "pnpm launch:smoke",
    "```",
    "",
    "Expected result: the deployed site and public buyer pages load, but paid launch readiness can still say `not ready`.",
    "",
    "After it passes, save `launch-evidence/first-render-smoke-report.md` with the rest of the launch evidence backup.",
    "",
    "## Next URL-Specific Commands",
    "",
    "```bash",
    `pnpm launch:live-url ${baseUrl}`,
    `LAUNCH_ENV_TEMPLATE_REPORT_PATH=launch-evidence/host-dashboard-env-template.md pnpm launch:env-template ${baseUrl}`,
    `LAUNCH_BASE_URL=${baseUrl} LAUNCH_EXPECTED_COMMIT=${commit} pnpm launch:smoke`,
    `LAUNCH_BASE_URL=${baseUrl} pnpm launch:readiness-snapshot ${baseUrl}`,
    "```",
    "",
    "## Before Taking Real Money",
    "",
    "Do not set `ENABLE_PAID_ENROLLMENT=true` until all of these are true:",
    "",
    "- Module 1 clinical review is approved and recorded.",
    "- Render PostgreSQL is connected and `pnpm db:setup` has run.",
    "- Stripe live checkout and webhook are configured.",
    "- Passwordless email is configured and tested.",
    "- Practice-seat and alert admin tokens are set.",
    "- `/api/launch/readiness` reports `readyForPaidLaunch: true`.",
    "- Final smoke test passes without `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.",
    "- One low-risk internal live purchase works end to end.",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl = getBaseUrl();
  const reportPath = getReportPath();
  const { branch, commit } = await getGitInfo();
  const generatedDate = new Date().toISOString().slice(0, 10);
  const packet = renderPacket({ baseUrl, branch, commit, generatedDate });

  console.log(packet);

  if (reportPath) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, packet, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "First Render deploy packet could not be created."
  );
  process.exitCode = 1;
});
