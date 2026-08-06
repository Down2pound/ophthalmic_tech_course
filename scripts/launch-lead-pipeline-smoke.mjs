#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));

  return match ? match.slice(prefix.length).trim() : fallback;
}

function trimBaseUrl(baseUrl) {
  return baseUrl.trim().replace(/\/+$/, "");
}

function safeRunId(value) {
  return value.replace(/[^0-9a-z]/gi, "").slice(0, 14) || "manual";
}

async function fetchJson({ fetcher, url, init, fallbackError }) {
  const response = await fetcher(url, init);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || fallbackError || `${url} failed.`);
  }

  return { response, payload };
}

function adminHeaders(adminToken) {
  return {
    "Content-Type": "application/json",
    "x-admin-token": adminToken,
  };
}

async function submitPracticeLead({ fetcher, baseUrl, runId }) {
  const { response, payload } = await fetchJson({
    fetcher,
    url: `${baseUrl}/api/practice-inquiries`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        practiceName: `OptiTech Lead Pipeline Smoke ${runId}`,
        contactName: "Launch Lead Pipeline Smoke",
        contactEmail: `launch-smoke-practice+${runId}@example.com`,
        estimatedLearnerCount: 6,
        targetTimeline: "Lead pipeline smoke test",
        message:
          "Safe lead pipeline smoke test practice inquiry. No patient information, card data, secrets, or private employee details.",
      }),
    },
    fallbackError: "Practice lead smoke submission failed.",
  });

  return {
    status: response.status,
    inquiryId: payload?.inquiry?.inquiryId,
    notificationSent: Boolean(payload?.notification?.sent),
  };
}

async function submitLearnerLead({ fetcher, baseUrl, runId }) {
  const { response, payload } = await fetchJson({
    fetcher,
    url: `${baseUrl}/api/learner-interests`,
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learnerName: `Lead Pipeline Smoke Learner ${runId}`,
        email: `launch-smoke-learner+${runId}@example.com`,
        background: "career-changer",
        goal: "Safe lead pipeline smoke test learner interest. No patient information, card data, secrets, private employer details, or private learner history.",
      }),
    },
    fallbackError: "Learner lead smoke submission failed.",
  });

  return {
    status: response.status,
    interestId: payload?.interest?.interestId,
    notificationSent: Boolean(payload?.notification?.sent),
  };
}

async function loadProtectedLeadDashboard({ fetcher, baseUrl, adminToken }) {
  const { payload } = await fetchJson({
    fetcher,
    url: `${baseUrl}/api/support/practice-inquiries`,
    init: {
      headers: adminHeaders(adminToken),
    },
    fallbackError: "Protected lead dashboard could not be loaded.",
  });

  return {
    inquiries: Array.isArray(payload?.inquiries) ? payload.inquiries : [],
    learnerInterests: Array.isArray(payload?.learnerInterests)
      ? payload.learnerInterests
      : [],
  };
}

async function updatePracticeLeadStatus({
  fetcher,
  baseUrl,
  adminToken,
  inquiryId,
}) {
  const { payload } = await fetchJson({
    fetcher,
    url: `${baseUrl}/api/support/practice-inquiries/${encodeURIComponent(
      inquiryId
    )}/status`,
    init: {
      method: "PATCH",
      headers: adminHeaders(adminToken),
      body: JSON.stringify({ status: "contacted" }),
    },
    fallbackError: "Practice lead status could not be updated.",
  });

  return payload?.inquiry;
}

async function updateLearnerLeadStatus({
  fetcher,
  baseUrl,
  adminToken,
  interestId,
}) {
  const { payload } = await fetchJson({
    fetcher,
    url: `${baseUrl}/api/support/learner-interests/${encodeURIComponent(
      interestId
    )}/status`,
    init: {
      method: "PATCH",
      headers: adminHeaders(adminToken),
      body: JSON.stringify({ status: "contacted" }),
    },
    fallbackError: "Learner lead status could not be updated.",
  });

  return payload?.interest;
}

export async function runLeadPipelineSmoke({
  baseUrl,
  adminToken,
  fetcher = fetch,
  now = () => new Date().toISOString(),
}) {
  const normalizedBaseUrl = trimBaseUrl(baseUrl || "");
  const trimmedAdminToken = (adminToken || "").trim();

  if (!normalizedBaseUrl) {
    throw new Error("A deployed base URL is required.");
  }

  if (!trimmedAdminToken) {
    throw new Error(
      "LAUNCH_ADMIN_TOKEN is required for protected lead checks."
    );
  }

  const generatedAt = now();
  const runId = safeRunId(generatedAt);
  const practiceLead = await submitPracticeLead({
    fetcher,
    baseUrl: normalizedBaseUrl,
    runId,
  });
  const learnerLead = await submitLearnerLead({
    fetcher,
    baseUrl: normalizedBaseUrl,
    runId,
  });

  if (!practiceLead.inquiryId) {
    throw new Error("Practice lead was submitted but no inquiry ID returned.");
  }

  if (!learnerLead.interestId) {
    throw new Error("Learner lead was submitted but no interest ID returned.");
  }

  const dashboardBefore = await loadProtectedLeadDashboard({
    fetcher,
    baseUrl: normalizedBaseUrl,
    adminToken: trimmedAdminToken,
  });
  const practiceLeadVisible = dashboardBefore.inquiries.some(
    inquiry => inquiry.inquiryId === practiceLead.inquiryId
  );
  const learnerLeadVisible = dashboardBefore.learnerInterests.some(
    interest => interest.interestId === learnerLead.interestId
  );

  if (!practiceLeadVisible || !learnerLeadVisible) {
    throw new Error(
      "Protected lead dashboard did not show both submitted smoke leads."
    );
  }

  const updatedPracticeLead = await updatePracticeLeadStatus({
    fetcher,
    baseUrl: normalizedBaseUrl,
    adminToken: trimmedAdminToken,
    inquiryId: practiceLead.inquiryId,
  });
  const updatedLearnerLead = await updateLearnerLeadStatus({
    fetcher,
    baseUrl: normalizedBaseUrl,
    adminToken: trimmedAdminToken,
    interestId: learnerLead.interestId,
  });

  const dashboardAfter = await loadProtectedLeadDashboard({
    fetcher,
    baseUrl: normalizedBaseUrl,
    adminToken: trimmedAdminToken,
  });

  return {
    baseUrl: normalizedBaseUrl,
    generatedAt,
    practiceLead: {
      ...practiceLead,
      visibleInDashboard: practiceLeadVisible,
      updatedStatus: updatedPracticeLead?.status,
      updatedAt: updatedPracticeLead?.updatedAt,
    },
    learnerLead: {
      ...learnerLead,
      visibleInDashboard: learnerLeadVisible,
      updatedStatus: updatedLearnerLead?.status,
      updatedAt: updatedLearnerLead?.updatedAt,
    },
    dashboardCounts: {
      inquiriesBefore: dashboardBefore.inquiries.length,
      learnerInterestsBefore: dashboardBefore.learnerInterests.length,
      inquiriesAfter: dashboardAfter.inquiries.length,
      learnerInterestsAfter: dashboardAfter.learnerInterests.length,
    },
  };
}

export function renderLeadPipelineSmokeReport(report) {
  return [
    "# OptiTech Academy Lead Pipeline Smoke Test",
    "",
    `Generated at: ${report.generatedAt}`,
    `Deployment URL: ${report.baseUrl}`,
    "",
    "## Result",
    "",
    `- Practice lead submitted: ${report.practiceLead.inquiryId ? "ok" : "failed"}`,
    `- Practice lead visible in protected dashboard: ${
      report.practiceLead.visibleInDashboard ? "ok" : "failed"
    }`,
    `- Practice lead marked contacted: ${
      report.practiceLead.updatedStatus === "contacted" ? "ok" : "failed"
    }`,
    `- Learner lead submitted: ${report.learnerLead.interestId ? "ok" : "failed"}`,
    `- Learner lead visible in protected dashboard: ${
      report.learnerLead.visibleInDashboard ? "ok" : "failed"
    }`,
    `- Learner lead marked contacted: ${
      report.learnerLead.updatedStatus === "contacted" ? "ok" : "failed"
    }`,
    "",
    "## Safe IDs",
    "",
    `- Practice inquiry ID: ${report.practiceLead.inquiryId}`,
    `- Learner interest ID: ${report.learnerLead.interestId}`,
    "",
    "## Dashboard Counts",
    "",
    `- Practice inquiries before update: ${report.dashboardCounts.inquiriesBefore}`,
    `- Practice inquiries after update: ${report.dashboardCounts.inquiriesAfter}`,
    `- Learner interests before update: ${report.dashboardCounts.learnerInterestsBefore}`,
    `- Learner interests after update: ${report.dashboardCounts.learnerInterestsAfter}`,
    "",
    "Do not paste admin tokens, Stripe keys, webhook secrets, database passwords, raw sign-in links, session cookies, card numbers, patient information, protected health information, or private employee details into this report.",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl =
    getArgValue("url", process.env.LAUNCH_BASE_URL) ||
    process.env.PUBLIC_APP_URL ||
    "";
  const adminToken =
    getArgValue("admin-token", process.env.LAUNCH_ADMIN_TOKEN) ||
    process.env.PRACTICE_SEAT_ADMIN_TOKEN ||
    "";
  const report = await runLeadPipelineSmoke({ baseUrl, adminToken });
  const renderedReport = renderLeadPipelineSmokeReport(report);

  console.log(renderedReport);

  if (process.env.LAUNCH_LEAD_PIPELINE_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(
      process.env.LAUNCH_LEAD_PIPELINE_SMOKE_REPORT_PATH
    );
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, renderedReport);
    console.log(`- Report written: ${reportPath}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    const message =
      error instanceof Error
        ? error.message
        : "Lead pipeline smoke test failed.";
    console.error(message);
    process.exitCode = 1;
  });
}
