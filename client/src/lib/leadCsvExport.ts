import type {
  BuyerSupportProfile,
  LearnerInterestSummary,
  PracticeInquirySummary,
} from "./practiceSeatAdminClient";

function csvCell(value: unknown): string {
  const text = String(value ?? "")
    .replace(/\r?\n/g, " ")
    .trim();
  return `"${text.replace(/"/g, '""')}"`;
}

function csvRow(values: unknown[]): string {
  return values.map(csvCell).join(",");
}

export function buildPracticeLeadCsv(
  inquiries: PracticeInquirySummary[]
): string {
  return [
    csvRow([
      "Created At",
      "Updated At",
      "Priority",
      "Practice",
      "Contact",
      "Email",
      "Learners",
      "Timeline",
      "Recommended Offer",
      "Next Action",
      "Message",
      "Inquiry ID",
    ]),
    ...inquiries.map(inquiry =>
      csvRow([
        inquiry.createdAt,
        inquiry.updatedAt ?? "",
        inquiry.followUpPlan.priority,
        inquiry.practiceName,
        inquiry.contactName,
        inquiry.contactEmail,
        inquiry.estimatedLearnerCount ?? "",
        inquiry.targetTimeline,
        inquiry.followUpPlan.recommendedOffer,
        inquiry.followUpPlan.nextAction,
        inquiry.message,
        inquiry.inquiryId,
      ])
    ),
  ].join("\n");
}

export function buildLearnerLeadCsv(
  learnerInterests: LearnerInterestSummary[]
): string {
  return [
    csvRow([
      "Created At",
      "Updated At",
      "Learner",
      "Email",
      "Background",
      "Goal",
      "Status",
      "Recommended Next Step",
      "Interest ID",
    ]),
    ...learnerInterests.map(interest =>
      csvRow([
        interest.createdAt,
        interest.updatedAt ?? "",
        interest.learnerName,
        interest.email,
        interest.background,
        interest.goal,
        interest.status,
        "Send the learner decision one-pager and invite founding access when paid enrollment opens.",
        interest.interestId,
      ])
    ),
  ].join("\n");
}

export function buildBuyerSupportCsv(profile: BuyerSupportProfile): string {
  const rows = [
    csvRow(["Section", "Type", "ID", "Offer", "Status", "Notes"]),
    ...profile.purchases.map(purchase =>
      csvRow([
        "Buyer support",
        "purchase",
        purchase.checkoutSessionId,
        purchase.offerId ?? "",
        "",
        `Lookup email: ${profile.email}`,
      ])
    ),
    ...profile.enrollments.map(enrollment =>
      csvRow([
        "Buyer support",
        "enrollment",
        enrollment.enrollmentId,
        enrollment.offerId ?? "",
        enrollment.status ?? "",
        enrollment.accessExpiresAt
          ? `Access expires: ${enrollment.accessExpiresAt}`
          : "",
      ])
    ),
    ...profile.practiceSeatPacks.map(seatPack =>
      csvRow([
        "Buyer support",
        "practice-seat-pack",
        seatPack.seatPackId,
        seatPack.offerId ?? "",
        seatPack.status ?? "",
        `Seats assigned: ${seatPack.assignedSeats ?? 0} of ${
          seatPack.totalSeats ?? "unknown"
        }`,
      ])
    ),
    ...profile.practiceSeatAssignments.map(assignment =>
      csvRow([
        "Buyer support",
        "practice-seat-assignment",
        assignment.assignmentId,
        "",
        assignment.status ?? "",
        `Learner: ${
          assignment.learnerEmail ?? profile.email
        }; seat pack: ${assignment.seatPackId}`,
      ])
    ),
    ...profile.recommendedActions.map(action =>
      csvRow(["Buyer support", "recommended-action", "", "", "", action])
    ),
    ...(profile.supportNote
      ? [
          csvRow([
            "Buyer support",
            "safe-support-note",
            "",
            "",
            profile.supportNote.issueCategories.join("; "),
            profile.supportNote.safeSummary,
          ]),
          csvRow([
            "Buyer support",
            "next-step",
            "",
            "",
            "",
            profile.supportNote.nextStep,
          ]),
          ...profile.supportNote.evidenceToSave.map(item =>
            csvRow(["Buyer support", "evidence-to-save", "", "", "", item])
          ),
          ...profile.supportNote.neverSave.map(item =>
            csvRow(["Buyer support", "never-save", "", "", "", item])
          ),
        ]
      : []),
    csvRow([
      "Buyer support",
      "safety-note",
      "",
      "",
      "",
      "Do not save secrets, raw sign-in links, card data, patient details, protected health information, or private employee notes in support records.",
    ]),
  ];

  return rows.join("\n");
}

export function downloadCsvFile({
  filename,
  csv,
  documentRef = document,
  urlRef = URL,
}: {
  filename: string;
  csv: string;
  documentRef?: Pick<Document, "createElement" | "body">;
  urlRef?: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
}) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const objectUrl = urlRef.createObjectURL(blob);
  const link = documentRef.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  documentRef.body.appendChild(link);
  link.click();
  link.remove();
  urlRef.revokeObjectURL(objectUrl);
}
