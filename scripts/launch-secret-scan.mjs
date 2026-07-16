import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([
  ".cache",
  ".git",
  ".pnpm-store",
  "build",
  "coverage",
  "dist",
  "launch-evidence",
  "node_modules",
  "temp",
  "tmp",
]);

const ignoredExtensions = new Set([
  ".bundle",
  ".db",
  ".gif",
  ".ico",
  ".jpg",
  ".jpeg",
  ".lock",
  ".png",
  ".sqlite",
  ".sqlite3",
  ".webp",
  ".zip",
]);

const secretPatterns = [
  {
    name: "Stripe secret key",
    regex: /\bsk_(?:test|live)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "Stripe webhook secret",
    regex: /\bwhsec_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "Resend API key",
    regex: /\bre_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "PostgreSQL connection string with password",
    regex: /\bpostgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@[^\s]+/g,
  },
];

async function collectFiles(root) {
  const files = [];
  const entries = await readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await collectFiles(fullPath)));
      }
      continue;
    }

    if (!entry.isFile()) continue;
    if (ignoredExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    files.push(fullPath);
  }

  return files;
}

function scanTextForSecrets({ filePath, text }) {
  const findings = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    secretPatterns.forEach(pattern => {
      pattern.regex.lastIndex = 0;

      if (pattern.regex.test(line)) {
        findings.push({
          filePath,
          lineNumber: index + 1,
          patternName: pattern.name,
        });
      }
    });
  });

  return findings;
}

async function main() {
  const projectRoot = process.cwd();
  const files = await collectFiles(projectRoot);
  const findings = [];

  for (const file of files) {
    const fileStat = await stat(file);

    if (fileStat.size > 1_000_000) continue;

    const text = await readFile(file, "utf8").catch(() => null);

    if (text === null) continue;

    findings.push(
      ...scanTextForSecrets({
        filePath: path.relative(projectRoot, file).replace(/\\/g, "/"),
        text,
      })
    );
  }

  if (findings.length === 0) {
    console.log("Launch secret scan passed. No likely live secrets found.");
    return;
  }

  console.error("Launch secret scan found likely secret values:");
  findings.forEach(finding => {
    console.error(
      `- ${finding.filePath}:${finding.lineNumber} ${finding.patternName}`
    );
  });
  console.error("Remove the secret value and rotate it before launch.");
  process.exitCode = 1;
}

main().catch(error => {
  console.error(
    error instanceof Error ? error.message : "Launch secret scan failed."
  );
  process.exitCode = 1;
});
