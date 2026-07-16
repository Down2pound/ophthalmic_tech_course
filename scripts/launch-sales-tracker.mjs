#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve(
  process.cwd(),
  "launch-evidence",
  "sales-tracker-templates"
);

const trackers = [
  {
    fileName: "lead-tracker.csv",
    rows: [
      [
        "Date Added",
        "Lead Type",
        "Name Or Practice",
        "Source",
        "Buyer Path",
        "Status",
        "Next Follow-Up",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "Referral",
        "Individual course",
        "New",
        "2026-07-19",
        "Wants beginner-friendly ophthalmic technician training.",
      ],
    ],
  },
  {
    fileName: "purchase-tracker.csv",
    rows: [
      [
        "Purchase Date",
        "Buyer Type",
        "Buyer Name Or Practice",
        "Buyer Email",
        "Offer",
        "Amount",
        "Stripe Checkout Session ID",
        "Stripe Event ID",
        "Fulfillment Status",
        "Sign-In Confirmed",
        "Support Needed",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "learner@example.com",
        "Founding Learner Access",
        "199",
        "cs_test_example",
        "evt_test_example",
        "Access sent",
        "No",
        "No",
        "Example row only. Replace with real safe business details.",
      ],
    ],
  },
  {
    fileName: "practice-seat-tracker.csv",
    rows: [
      [
        "Practice",
        "Pack Size",
        "Seats Assigned",
        "Seats Remaining",
        "Practice Contact",
        "Onboarding Lead",
        "Next Check-In",
        "Safe Notes",
      ],
      [
        "Example Eye Care",
        "5",
        "0",
        "5",
        "manager@example.com",
        "Jeff",
        "2026-07-23",
        "Example row only. Do not add private employee performance notes.",
      ],
    ],
  },
  {
    fileName: "practice-inquiry-tracker.csv",
    rows: [
      [
        "Date",
        "Inquiry ID",
        "Practice",
        "Contact Email",
        "Estimated Learners",
        "Timeline",
        "Status",
        "Next Step",
      ],
      [
        "2026-07-16",
        "practice_inquiry_example",
        "Example Eye Care",
        "manager@example.com",
        "18",
        "Next hiring class",
        "New",
        "Schedule rollout call.",
      ],
    ],
  },
  {
    fileName: "refund-support-tracker.csv",
    rows: [
      [
        "Request Date",
        "Buyer Type",
        "Buyer Name Or Practice",
        "Category",
        "Offer",
        "Stripe Refund ID",
        "Status",
        "Follow-Up Date",
        "Safe Reason Theme",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "Sign-in help",
        "Founding Learner Access",
        "N/A",
        "Open",
        "2026-07-17",
        "Email not received",
        "Example row only. Never paste raw sign-in links.",
      ],
    ],
  },
  {
    fileName: "first-24-hour-sale-review.csv",
    rows: [
      [
        "Purchase Date",
        "Buyer Type",
        "Offer",
        "Access Worked Without Manual Fix",
        "Sign-In Worked",
        "Support Issue Found",
        "Outreach Decision",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Founding Learner Access",
        "Yes / No",
        "Yes / No",
        "None / Sign-in / Access / Payment / Other",
        "Continue / Pause / Fix first",
        "Use this before sending checkout links broadly.",
      ],
    ],
  },
  {
    fileName: "weekly-business-review.csv",
    rows: [
      [
        "Week Of",
        "Leads Added",
        "Sales Closed",
        "Revenue",
        "Refunds",
        "Biggest Blocker",
        "Best Source",
        "Next Experiment",
      ],
      [
        "2026-07-20",
        "0",
        "0",
        "0",
        "0",
        "Need first outreach list",
        "Not known yet",
        "Email five local practices.",
      ],
    ],
  },
];

function escapeCsvCell(value) {
  const text = String(value);
  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function renderCsv(rows) {
  return `${rows.map(row => row.map(escapeCsvCell).join(",")).join("\n")}\n`;
}

const readme = [
  "# OptiTech Academy Sales Tracker Templates",
  "",
  "These CSV files are safe starter templates for Excel or Google Sheets.",
  "",
  "Do not paste secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, or private employee performance details into these trackers.",
  "",
  "Use the trackers to answer four simple business questions:",
  "",
  "1. Who might buy?",
  "2. Who already bought?",
  "3. Did they get access successfully?",
  "4. What should happen next?",
  "",
  "Source guide: docs/launch/revenue-and-sales-tracker-template.md",
  "",
].join("\n");

await mkdir(outputDir, { recursive: true });

for (const tracker of trackers) {
  await writeFile(
    path.join(outputDir, tracker.fileName),
    renderCsv(tracker.rows),
    "utf8"
  );
}

await writeFile(path.join(outputDir, "README.md"), readme, "utf8");

const lines = [
  "# OptiTech Academy Sales Tracker Export",
  "",
  `Created ${trackers.length} CSV templates in:`,
  "",
  outputDir,
  "",
  "Files:",
  ...trackers.map(tracker => `- ${tracker.fileName}`),
  "- README.md",
  "",
  "Do not paste secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, or private employee performance details into these trackers.",
  "",
];

console.log(lines.join("\n"));
