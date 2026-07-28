#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const templatePath = path.join(
  projectRoot,
  "docs",
  "launch",
  "clinical-review-request-template.md"
);

console.log(readFileSync(templatePath, "utf8"));
