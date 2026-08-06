#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";

const distEntry = path.resolve("dist", "index.js");
const demoEmail =
  getArgValue("email", process.env.LAUNCH_TEST_EMAIL) ||
  "jeff.demo@example.com";
const requestedPort = Number(
  getArgValue("port", process.env.LAUNCH_LOCAL_COURSE_SMOKE_PORT) || 0
);

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getCookieHeader(response) {
  const rawCookies = response.headers.getSetCookie?.() ?? [];
  const fallbackCookie = response.headers.get("set-cookie");
  const cookies =
    rawCookies.length > 0 ? rawCookies : fallbackCookie ? [fallbackCookie] : [];

  return cookies.map(cookie => cookie.split(";")[0]).join("; ");
}

async function findOpenPort(preferredPort) {
  if (preferredPort > 0) return preferredPort;

  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === "object") {
          resolve(address.port);
          return;
        }
        reject(new Error("Could not find an open local port."));
      });
    });
  });
}

async function waitForHealth(baseUrl, child) {
  const deadline = Date.now() + 15000;
  let lastError = "";

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Local server exited early with code ${child.exitCode}.`);
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      const payload = await response.json();
      if (response.ok && payload.ok === true) return payload;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  throw new Error(`Local server did not become healthy in time. ${lastError}`);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  return { response, payload };
}

async function stopServer(child) {
  if (child.exitCode !== null) return;

  child.kill("SIGTERM");
  await new Promise(resolve => {
    const timeout = setTimeout(resolve, 2500);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  if (child.exitCode === null) {
    child.kill("SIGKILL");
  }
}

async function main() {
  if (!existsSync(distEntry)) {
    throw new Error(
      "Build output is missing. Run `pnpm build` first, then run `pnpm launch:local-course-smoke`."
    );
  }

  const port = await findOpenPort(requestedPort);
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, [distEntry], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PUBLIC_APP_URL: baseUrl,
      ENABLE_LOCAL_COURSE_DEMO: "true",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverOutput = "";
  child.stdout.on("data", chunk => {
    serverOutput += chunk.toString();
  });
  child.stderr.on("data", chunk => {
    serverOutput += chunk.toString();
  });

  try {
    const health = await waitForHealth(baseUrl, child);
    const demoStartResponse = await fetch(
      `${baseUrl}/api/dev/demo-learner/start?email=${encodeURIComponent(
        demoEmail
      )}`,
      { redirect: "manual" }
    );
    const cookieHeader = getCookieHeader(demoStartResponse);

    assert(
      demoStartResponse.status >= 300 && demoStartResponse.status < 400,
      `Demo learner start should redirect to /learn. Got HTTP ${demoStartResponse.status}.`
    );
    assert(
      cookieHeader.length > 0,
      "Demo learner start did not set a session cookie."
    );

    const commonOptions = {
      headers: {
        cookie: cookieHeader,
      },
    };
    const session = await fetchJson(
      `${baseUrl}/api/auth/session`,
      commonOptions
    );
    const lessons = await fetchJson(
      `${baseUrl}/api/learn/module-one/lessons`,
      commonOptions
    );
    const progress = await fetchJson(
      `${baseUrl}/api/learn/module-one/progress`,
      commonOptions
    );
    const quiz = await fetchJson(
      `${baseUrl}/api/learn/module-one/quiz`,
      commonOptions
    );
    const learnPage = await fetch(`${baseUrl}/learn`, commonOptions);

    assert(session.response.ok, "/api/auth/session should return HTTP 200.");
    assert(
      session.payload.authenticated === true,
      "Demo learner session should be authenticated."
    );
    assert(
      session.payload.hasAccess === true,
      "Demo learner should have course access."
    );
    assert(
      normalizeEmail(session.payload.email ?? "") === normalizeEmail(demoEmail),
      "Demo learner session should use the requested email."
    );
    assert(
      lessons.response.ok,
      "/api/learn/module-one/lessons should return HTTP 200."
    );
    assert(
      Array.isArray(lessons.payload.lessons) &&
        lessons.payload.lessons.length > 0,
      "Protected lessons should return at least one lesson."
    );
    assert(
      progress.response.ok,
      "/api/learn/module-one/progress should return HTTP 200."
    );
    assert(
      quiz.response.ok,
      "/api/learn/module-one/quiz should return HTTP 200."
    );
    assert(
      Array.isArray(quiz.payload.questions) &&
        quiz.payload.questions.length > 0,
      "Protected quiz should return learner-safe questions."
    );
    assert(learnPage.ok, "/learn page should load for the demo learner.");

    console.log("# OptiTech Academy Local Course Smoke Test");
    console.log("");
    console.log("Simple translation: the local learner course door opens.");
    console.log("");
    console.log(`- Local URL: ${baseUrl}`);
    console.log(`- Demo learner: ${normalizeEmail(demoEmail)}`);
    console.log(`- Health endpoint: ok (${health.environment})`);
    console.log("- Demo sign-in redirect: ok");
    console.log(`- Session access: ok (${session.payload.email})`);
    console.log(
      `- Protected lessons: ok (${lessons.payload.lessons.length} lessons)`
    );
    console.log("- Lesson progress endpoint: ok");
    console.log(
      `- Protected quiz: ok (${quiz.payload.questions.length} questions)`
    );
    console.log("- Learner page: ok");
    console.log("");
    console.log(
      "Next: open the local URL printed by `pnpm launch:local-demo` and click through the course yourself."
    );
  } catch (error) {
    if (serverOutput.trim()) {
      console.error("Local server output:");
      console.error(serverOutput.trim());
    }
    throw error;
  } finally {
    await stopServer(child);
  }
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "Local course smoke test failed.";
  console.error(message);
  process.exitCode = 1;
});
