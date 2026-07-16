import { renderBackupHandoffReport } from "./backupHandoffReport";

console.log(
  renderBackupHandoffReport({
    branchName: process.env.BACKUP_BRANCH_NAME,
    latestCommit: process.env.BACKUP_COMMIT,
    sourceArchiveName: process.env.BACKUP_SOURCE_ARCHIVE,
    bundleArchiveName: process.env.BACKUP_BUNDLE_ARCHIVE,
  })
);
