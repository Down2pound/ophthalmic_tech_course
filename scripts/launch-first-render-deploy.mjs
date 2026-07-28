#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const guidePath = path.join(
  projectRoot,
  "docs",
  "launch",
  "first-render-deploy-evidence.md"
);

console.log(readFileSync(guidePath, "utf8"));
