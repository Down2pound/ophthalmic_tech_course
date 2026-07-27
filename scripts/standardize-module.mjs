#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const schemaPath = path.join(
  repositoryRoot,
  "docs",
  "module-data",
  "MODULE_DATA_SCHEMA.json",
);

function usage() {
  console.error(
    "Usage: node scripts/standardize-module.mjs <de-identified-module.json> [--dry-run]",
  );
}

function extractOutputText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  const text = Array.isArray(response.output)
    ? response.output
        .flatMap((item) => (Array.isArray(item?.content) ? item.content : []))
        .filter((item) => item?.type === "output_text" && typeof item.text === "string")
        .map((item) => item.text)
        .join("")
    : "";

  if (!text.trim()) {
    throw new Error("OpenAI returned no structured module output.");
  }
  return text;
}

function validateModuleShape(module) {
  const required = [
    "id",
    "order",
    "slug",
    "title",
    "audience",
    "prerequisites",
    "purpose",
    "learning_objectives",
    "lesson_topics",
    "clinical_scope",
    "patient_communication_required",
    "hands_on_validation",
    "assessment",
    "review",
  ];

  if (!module || typeof module !== "object" || Array.isArray(module)) {
    throw new Error("The standardized output is not a module object.");
  }
  for (const key of required) {
    if (!(key in module)) throw new Error(`The standardized output is missing ${key}.`);
  }
  if (!/^module-\d{2}$/.test(module.id)) {
    throw new Error("The standardized module ID must match module-01 through module-10.");
  }
  if (!Number.isInteger(module.order) || module.order < 1 || module.order > 10) {
    throw new Error("The standardized module order must be an integer from 1 through 10.");
  }
}

const args = process.argv.slice(2);
const inputPath = args.find((argument) => argument !== "--dry-run");
const dryRun = args.includes("--dry-run");

if (!inputPath) {
  usage();
  process.exitCode = 2;
} else {
  const [schemaDocument, sourceText] = await Promise.all([
    readFile(schemaPath, "utf8"),
    readFile(path.resolve(process.cwd(), inputPath), "utf8"),
  ]);
  const schemaDocumentJson = JSON.parse(schemaDocument);
  const sourceModule = JSON.parse(sourceText);

  const moduleSchema = structuredClone(schemaDocumentJson.$defs.module);
  moduleSchema.$defs = {
    stringArray: schemaDocumentJson.$defs.stringArray,
  };

  const developerInstructions = [
    "Convert the supplied de-identified ophthalmic course material into exactly one OptiTech Academy module record.",
    "Preserve supplied clinical facts and module numbering.",
    "Write for an entry-level ophthalmic technician.",
    "Do not diagnose, prescribe, invent device settings, invent clinical thresholds, or create a practice policy.",
    "Distinguish technician tasks from provider interpretation and independent clinical judgment.",
    "Include clear stop, repeat, or escalation conditions when the supplied material supports them.",
    "Use empty arrays when the source does not support a field; do not fill gaps by guessing.",
    "Set review.status to draft and clinical_review_required to true.",
    "Do not include protected health information, patient identifiers, credentials, or secrets.",
  ].join("\n");

  const request = {
    model: process.env.OPENAI_MODULE_MODEL?.trim() || "gpt-5.6-sol",
    store: false,
    reasoning: {
      effort: "medium",
    },
    text: {
      verbosity: "medium",
      format: {
        type: "json_schema",
        name: "optitech_ophthalmic_module",
        strict: true,
        schema: moduleSchema,
      },
    },
    input: [
      {
        role: "developer",
        content: developerInstructions,
      },
      {
        role: "user",
        content: JSON.stringify(sourceModule),
      },
    ],
  };

  if (dryRun) {
    process.stdout.write(`${JSON.stringify(request, null, 2)}\n`);
  } else {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is required. Store it in your local or hosting secret environment; never commit it.",
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    const responseBody = await response.json();
    if (!response.ok) {
      throw new Error(
        `OpenAI request failed (${response.status}): ${
          responseBody?.error?.message || "Unknown error"
        }`,
      );
    }

    const standardizedModule = JSON.parse(extractOutputText(responseBody));
    validateModuleShape(standardizedModule);
    process.stdout.write(`${JSON.stringify(standardizedModule, null, 2)}\n`);
  }
}
