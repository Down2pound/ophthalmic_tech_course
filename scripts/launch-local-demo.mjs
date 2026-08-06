#!/usr/bin/env node

function getArgValue(name, fallback) {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() || fallback : fallback;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizePort(port) {
  const trimmedPort = port.trim();
  return /^\d+$/.test(trimmedPort) ? trimmedPort : "3000";
}

const email = normalizeEmail(getArgValue("email", "jeff.demo@example.com"));
const port = normalizePort(getArgValue("port", "3000"));
const appUrl = `http://localhost:${port}`;
const demoLearnerUrl = `${appUrl}/api/dev/demo-learner/start?email=${encodeURIComponent(
  email
)}`;

const lines = [
  "# OptiTech Academy Local Demo Tester",
  "",
  "Simple translation: this is your practice key for trying the course on your own computer before Stripe, email, and the live website are connected.",
  "",
  "This does not turn on paid public access. The demo learner route only works on localhost when `ENABLE_LOCAL_COURSE_DEMO=true`.",
  "",
  "## 1. Build The App",
  "",
  "```bash",
  "pnpm build",
  "```",
  "",
  "## 2. Start The Local Demo Server",
  "",
  "PowerShell:",
  "",
  "```powershell",
  '$env:NODE_ENV="production"',
  `$env:PUBLIC_APP_URL="${appUrl}"`,
  '$env:ENABLE_LOCAL_COURSE_DEMO="true"',
  "node dist/index.js",
  "```",
  "",
  "macOS/Linux shell:",
  "",
  "```bash",
  `NODE_ENV=production PUBLIC_APP_URL=${appUrl} ENABLE_LOCAL_COURSE_DEMO=true node dist/index.js`,
  "```",
  "",
  "## 3. Open These Links",
  "",
  `- Home: ${appUrl}/`,
  `- Free preview: ${appUrl}/preview`,
  `- Curriculum: ${appUrl}/curriculum`,
  `- First-sale page: ${appUrl}/first-sale`,
  `- Practice packs: ${appUrl}/practice-packs`,
  `- Demo learner start: ${demoLearnerUrl}`,
  `- Learner course page after demo sign-in: ${appUrl}/learn`,
  "",
  "## What To Check",
  "",
  "- Home page loads without scary errors.",
  "- Checkout page explains that paid setup is not ready yet unless live launch settings are configured.",
  "- Demo learner link redirects to `/learn`.",
  "- Module 1 lesson content opens like a signed-in student.",
  "- Knowledge checks do not show answer keys before submitting.",
  "",
  "## Safety Notes",
  "",
  "- Do not use this for the public deployed app.",
  "- Do not set `ENABLE_LOCAL_COURSE_DEMO=true` in Render, Vercel, or any live host.",
  "- Do not paste Stripe keys, webhook secrets, database passwords, email API keys, admin tokens, session cookies, patient information, or protected health information into local demo notes.",
  "",
  "Helpful options:",
  "",
  "```bash",
  "pnpm launch:local-demo -- --email=your.demo@example.com --port=3000",
  "```",
  "",
];

console.log(lines.join("\n"));
