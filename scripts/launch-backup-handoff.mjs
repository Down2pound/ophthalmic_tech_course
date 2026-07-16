#!/usr/bin/env node
import { readFileSync } from "node:fs";
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
  "",
  "Upload the ZIP and bundle to the Google Drive handoff folder when GitHub push is blocked.",
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
