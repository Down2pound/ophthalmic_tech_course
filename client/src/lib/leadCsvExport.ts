import type {
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
