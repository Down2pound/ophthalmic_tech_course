#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const handoffPath = path.join(
  projectRoot,
  "docs",
  "launch",
  "post-0716-workspace-handoff.md"
);

console.log(readFileSync(handoffPath, "utf8"));
