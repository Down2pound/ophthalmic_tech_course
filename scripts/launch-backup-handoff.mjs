#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const sourceMapPath = path.join(
  projectRoot,
  "shared",
  "course",
  "bootcampSourceMap.ts"
);

const sourceMapText = readFileSync(sourceMapPath, "utf8");

const githubRepoUrl =
  "https://github.com/Down2pound/ophthalmic_tech_course.git";
const bootcampSourceFolderUrl =
  "https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q";
const bootcampNotebookLmUrl =
  "https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1";
const bootcampSiteCourseDataUrl =
  "https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI";

function valueOrPlaceholder(value, placeholder) {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : placeholder;
}

function countMatches(pattern) {
  return sourceMapText.match(pattern)?.length ?? 0;
}

function readProjectFilenames() {
  try {
    return readdirSync(projectRoot);
  } catch {
    return [];
  }
}

function readTextFile(filePath) {
  try {
    return readFileSync(filePath, "utf8").trim();
  } catch {
    return "";
  }
}

function readGitHead() {
  return readTextFile(path.join(projectRoot, ".git", "HEAD"));
}

function detectGitBranch(headText) {
  const refPrefix = "ref: refs/heads/";
  return headText.startsWith(refPrefix) ? headText.slice(refPrefix.length) : "";
}

function detectGitCommit(headText) {
  const refPrefix = "ref: ";
  if (!headText.startsWith(refPrefix)) {
    return headText.slice(0, 7);
  }

  const refPath = headText.slice(refPrefix.length);
  const refCommit = readTextFile(path.join(projectRoot, ".git", refPath));
  return refCommit.slice(0, 7);
}

function findBackupFile(filenames, prefix, extension, commit) {
  return (
    filenames.find(
      filename =>
        filename.startsWith(prefix) &&
        filename.endsWith(`${commit}${extension}`)
    ) || ""
  );
}

function formatBackupStatus(filename) {
  return filename && existsSync(path.join(projectRoot, filename))
    ? `found: ${filename}`
    : "missing";
}

const gitHead = readGitHead();
const branchName = valueOrPlaceholder(
  process.env.BACKUP_BRANCH_NAME,
  valueOrPlaceholder(detectGitBranch(gitHead), "codex/optitech-product-spec")
);
const latestCommit = valueOrPlaceholder(
  process.env.BACKUP_COMMIT,
  valueOrPlaceholder(detectGitCommit(gitHead), "COMMIT")
);
const sourceArchiveName = valueOrPlaceholder(
  process.env.BACKUP_SOURCE_ARCHIVE,
  `optitech-academy-source-YYYY-MM-DD-${latestCommit}.zip`
);
const bundleArchiveName = valueOrPlaceholder(
  process.env.BACKUP_BUNDLE_ARCHIVE,
  `optitech-academy-branch-YYYY-MM-DD-${latestCommit}.bundle`
);
const bootcampDayCount = countMatches(/^\s*day:\s*\d+,/gm);
const sourceAssetCount = countMatches(/^\s*storageKey:/gm);
const projectFilenames = readProjectFilenames();
const detectedSourceBackup = findBackupFile(
  projectFilenames,
  "optitech-academy-source-",
  ".zip",
  latestCommit
);
const detectedBundleBackup = findBackupFile(
  projectFilenames,
  "optitech-academy-branch-",
  ".bundle",
  latestCommit
);
const restoreBundleName = detectedBundleBackup || bundleArchiveName;

const report = [
  "# OptiTech Academy Backup Handoff",
  "",
  "Use this report before leaving a locked-down work computer or before continuing from a home PC.",
  "",
  "## GitHub",
  "",
  `- GitHub repo: ${githubRepoUrl}`,
  `- Current branch: ${branchName}`,
  `- Latest local commit: ${latestCommit}`,
  "",
  "Push from a normal Git install with:",
  "",
  "```bash",
  `git push -u origin ${branchName}`,
  "```",
  "",
  "If push fails on the work computer, use the portable backups below from a home PC.",
  "",
  "## Portable Backups",
  "",
  `- Source ZIP: ${sourceArchiveName}`,
  `- Git bundle: ${bundleArchiveName}`,
  `- Source ZIP status: ${formatBackupStatus(detectedSourceBackup)}`,
  `- Git bundle status: ${formatBackupStatus(detectedBundleBackup)}`,
  "",
  "Upload the ZIP and bundle to the Google Drive handoff folder when GitHub push is blocked.",
  "",
  "## Restore The Git Bundle On A Home PC",
  "",
  "If GitHub does not have this branch yet, restore the bundle with:",
  "",
  "```bash",
  `git clone ${restoreBundleName} ophthalmic_tech_course --branch ${branchName}`,
  "cd ophthalmic_tech_course",
  `git remote set-url origin ${githubRepoUrl}`,
  `git push -u origin ${branchName}`,
  "```",
  "",
  "## Home PC Validation Commands",
  "",
  "After restoring or cloning the project on a home PC, run:",
  "",
  "```bash",
  "pnpm install",
  "pnpm check",
  "pnpm test",
  "pnpm launch:secret-scan",
  "pnpm build",
  "pnpm launch:bundle",
  "```",
  "",
  "After those pass once, use the full preflight command before deploying:",
  "",
  "```bash",
  "pnpm launch:preflight",
  "```",
  "",
  "## Production Host Settings",
  "",
  "Print the safe Render or host environment template with:",
  "",
  "```bash",
  "pnpm launch:env-template",
  "```",
  "",
  "Print the practice-seat and alert admin token setup checklist with:",
  "",
  "```bash",
  "pnpm launch:admin-tokens",
  "```",
  "",
  "Print the managed PostgreSQL setup and verification checklist with:",
  "",
  "```bash",
  "pnpm launch:database-setup",
  "```",
  "",
  "Print the Render Blueprint deployment order and live URL checks with:",
  "",
  "```bash",
  "pnpm launch:render-setup",
  "```",
  "",
  "Print the passwordless sign-in email setup and test checklist with:",
  "",
  "```bash",
  "pnpm launch:email-setup",
  "```",
  "",
  "Print the Stripe product, price, lookup-key, and webhook checklist with:",
  "",
  "```bash",
  "pnpm launch:stripe-products",
  "```",
  "",
  "Fill real secret values only inside the production host dashboard.",
  "",
  "## First Sales Links",
  "",
  "After deployment, print buyer links and starter outreach messages with:",
  "",
  "```bash",
  "pnpm launch:first-sales",
  "```",
  "",
  "Create starter CSV trackers for leads, purchases, support, practice seats, and weekly revenue with:",
  "",
  "```bash",
  "pnpm launch:sales-tracker",
  "```",
  "",
  "Print the final internal live-purchase rehearsal checklist with:",
  "",
  "```bash",
  "pnpm launch:live-purchase-test",
  "```",
  "",
  "Print the controlled first-10-customer outreach plan with:",
  "",
  "```bash",
  "pnpm launch:first-10-customers",
  "```",
  "",
  "Set `PUBLIC_APP_URL` first so the links use the real production domain.",
  "",
  "## Course Source Trail",
  "",
  `- Bootcamp Drive folder: ${bootcampSourceFolderUrl}`,
  `- NotebookLM workspace: ${bootcampNotebookLmUrl}`,
  `- Older Bootcamp site course data: ${bootcampSiteCourseDataUrl}`,
  `- Bootcamp days mapped: ${bootcampDayCount}`,
  `- Source assets mapped: ${sourceAssetCount}`,
  "",
  "Repository source metadata:",
  "",
  "- `shared/course/sourceInventory.ts`",
  "- `shared/course/bootcampSourceMap.ts`",
  "- `docs/content/google-drive-source-inventory.md`",
  "",
  "Do not copy `.env`, Stripe keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, or protected health information into GitHub or Google Drive.",
  "",
].join("\n");

console.log(report);
