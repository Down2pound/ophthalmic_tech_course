import {
  bootcampNotebookLmUrl,
  bootcampSiteCourseDataUrl,
  bootcampSourceDays,
  bootcampSourceFolderUrl,
  getBootcampSourceAssetCount,
} from "../../../shared/course/bootcampSourceMap";

const githubRepoUrl =
  "https://github.com/Down2pound/ophthalmic_tech_course.git";

export interface BackupHandoffReportInput {
  branchName?: string;
  latestCommit?: string;
  sourceArchiveName?: string;
  bundleArchiveName?: string;
}

function valueOrPlaceholder(value: string | undefined, placeholder: string) {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : placeholder;
}

export function renderBackupHandoffReport({
  branchName,
  latestCommit,
  sourceArchiveName,
  bundleArchiveName,
}: BackupHandoffReportInput = {}): string {
  const safeBranchName = valueOrPlaceholder(
    branchName,
    "codex/optitech-product-spec"
  );
  const safeCommit = valueOrPlaceholder(latestCommit, "COMMIT");
  const safeSourceArchiveName = valueOrPlaceholder(
    sourceArchiveName,
    `optitech-academy-source-YYYY-MM-DD-${safeCommit}.zip`
  );
  const safeBundleArchiveName = valueOrPlaceholder(
    bundleArchiveName,
    `optitech-academy-branch-YYYY-MM-DD-${safeCommit}.bundle`
  );

  return [
    "# OptiTech Academy Backup Handoff",
    "",
    "Use this report before leaving a locked-down work computer or before continuing from a home PC.",
    "",
    "## GitHub",
    "",
    `- GitHub repo: ${githubRepoUrl}`,
    `- Current branch: ${safeBranchName}`,
    `- Latest local commit: ${safeCommit}`,
    "",
    "Push from a normal Git install with:",
    "",
    "```bash",
    `git push -u origin ${safeBranchName}`,
    "```",
    "",
    "If push fails on the work computer, use the portable backups below from a home PC.",
    "",
    "## Portable Backups",
    "",
    `- Source ZIP: ${safeSourceArchiveName}`,
    `- Git bundle: ${safeBundleArchiveName}`,
    "",
    "Upload the ZIP and bundle to the Google Drive handoff folder when GitHub push is blocked.",
    "",
    "## Production Host Settings",
    "",
    "Print the safe Render or host environment template with:",
    "",
    "```bash",
    "pnpm launch:env-template",
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
    "Set `PUBLIC_APP_URL` first so the links use the real production domain.",
    "",
    "## Course Source Trail",
    "",
    `- Bootcamp Drive folder: ${bootcampSourceFolderUrl}`,
    `- NotebookLM workspace: ${bootcampNotebookLmUrl}`,
    `- Older Bootcamp site course data: ${bootcampSiteCourseDataUrl}`,
    `- Bootcamp days mapped: ${bootcampSourceDays.length}`,
    `- Source assets mapped: ${getBootcampSourceAssetCount()}`,
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
}
