#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const checklistPath = path.join(
  projectRoot,
  "docs",
  "launch",
  "bootcamp-content-migration-checklist.md"
);
const checklist = readFileSync(checklistPath, "utf8");
const sectionStart = checklist.indexOf("## Latest Drive Refresh Intake");
const sectionEnd = checklist.indexOf(
  "## Day-By-Day Migration Queue",
  sectionStart
);

if (sectionStart === -1 || sectionEnd === -1) {
  throw new Error(
    "Bootcamp refresh intake section is missing from the migration checklist."
  );
}

const intakeSection = checklist.slice(sectionStart, sectionEnd).trim();

const lines = [
  "# OptiTech Academy Bootcamp Drive Intake",
  "",
  "Use this before turning newly added Drive files into paid course content.",
  "",
  "Simple translation: this is the new-file waiting room. Nothing here becomes part of the course until it is checked, approved, and mapped.",
  "",
  intakeSection,
  "",
  "## Safe Next Steps",
  "",
  "1. Capture the Google Drive file ID for each unmapped item.",
  "2. Decide whether each item is public course, practice-only onboarding, newsletter/internal, duplicate, or excluded.",
  "3. Resolve duplicates before replacing mapped assets.",
  "4. Get clinical review before publishing learner-facing medical claims.",
  "5. Add captions, transcripts, alt text, or readable PDF text before release.",
  "6. Update `shared/course/bootcampSourceMap.ts` only after review is complete.",
  "",
  "Do not paste patient information, staff-private details, Stripe keys, email API keys, database passwords, raw sign-in links, or private employer details into this queue.",
  "",
].join("\n");

console.log(lines);
