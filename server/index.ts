import express from "express";
import { randomBytes, randomUUID } from "node:crypto";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  assertAuthConfigured,
  clearSessionCookie,
  getSessionUserId,
  hashPassword,
  setSessionCookie,
  validatePassword,
  verifyPassword,
} from "./auth";
import {
  mutateDatabase,
  readDatabase,
  type CourseUser,
  type PracticeInvite,
} from "./store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COURSE_ID = "ophthalmic-technician-foundations";
const MODULE_COUNT = 10;
const PASSING_SCORE = 70;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function readString(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function readInteger(value: unknown): number {
  if (typeof value === "number") return Math.trunc(value);
  return Number.parseInt(readString(value, 12), 10);
}

function getBaseUrl(req: express.Request): string {
  const configuredUrl = process.env.PUBLIC_APP_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = req.get("host");
  if (!host) throw new Error("Unable to determine the public application URL.");
  return `${protocol}://${host}`;
}

function createInviteCode(): string {
  return randomBytes(6).toString("hex").toUpperCase();
}

function publicUser(user: CourseUser) {
  const completedModules = user.progress.filter((item) => item.passed).length;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    organizationName: user.organizationName,
    managerId: user.managerId,
    seatLimit: user.seatLimit,
    createdAt: user.createdAt,
    progress: user.progress,
    completedModules,
    certificateEligible: completedModules >= MODULE_COUNT,
  };
}

async function requireUser(
  req: express.Request,
  res: express.Response,
): Promise<CourseUser | null> {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Please sign in to continue." });
    return null;
  }

  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.id === userId);
  if (!user || user.accessRevoked) {
    clearSessionCookie(res);
    res.status(401).json({ error: "Course access is unavailable for this account." });
    return null;
  }

  return user;
}

interface StripeCheckoutSession {
  id?: string;
  mode?: string;
  status?: string;
  payment_status?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  payment_intent?: string | { id?: string } | null;
  metadata?: Record<string, string> | null;
  error?: { message?: string };
  url?: string;
}

async function getStripeCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecretKey) throw new HttpError(503, "Stripe is not configured.");

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${stripeSecretKey}` } },
  );
  const session = (await response.json()) as StripeCheckoutSession;
  if (!response.ok) {
    throw new HttpError(400, session.error?.message ?? "Unable to verify payment.");
  }
  return session;
}

async function startServer() {
  assertAuthConfigured();

  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", courseId: COURSE_ID });
  });

  app.post("/api/enrollment/checkout", async (req, res) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const stripePriceId = process.env.STRIPE_STANDARD_PRICE_ID?.trim();

    if (!stripeSecretKey || !stripePriceId) {
      return res.status(503).json({
        error: "Enrollment checkout is not configured yet. Please contact the course administrator.",
      });
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const firstName = readString(body.firstName, 80);
    const lastName = readString(body.lastName, 80);
    const email = readString(body.email, 254).toLowerCase();
    const phone = readString(body.phone, 40);
    const experience = readString(body.experience, 80);
    const goal = readString(body.goal, 500);
    const enrollmentType = body.type === "practice" ? "practice" : "individual";
    const organizationName = readString(body.organizationName, 160);
    const requestedSeats = readInteger(body.seats);
    const seats = enrollmentType === "practice" ? requestedSeats : 1;

    if (!firstName || !lastName || !email || !phone || !goal) {
      return res.status(400).json({ error: "Please complete all required enrollment fields." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (enrollmentType === "practice" && !organizationName) {
      return res.status(400).json({ error: "Please enter the practice or clinic name." });
    }
    if (!Number.isInteger(seats) || seats < 1 || seats > 50) {
      return res.status(400).json({
        error: "Practice enrollments must include between 1 and 50 seats.",
      });
    }

    try {
      const baseUrl = getBaseUrl(req);
      const checkoutParams = new URLSearchParams({
        mode: "payment",
        customer_email: email,
        success_url: `${baseUrl}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?enrollment=cancelled`,
        "line_items[0][price]": stripePriceId,
        "line_items[0][quantity]": String(seats),
        "metadata[courseId]": COURSE_ID,
        "metadata[firstName]": firstName,
        "metadata[lastName]": lastName,
        "metadata[phone]": phone,
        "metadata[experience]": experience,
        "metadata[goal]": goal,
        "metadata[enrollmentType]": enrollmentType,
        "metadata[organizationName]": organizationName,
        "metadata[seats]": String(seats),
        "payment_intent_data[metadata][courseId]": COURSE_ID,
        "payment_intent_data[metadata][enrollmentType]": enrollmentType,
        "payment_intent_data[metadata][organizationName]": organizationName,
        "payment_intent_data[metadata][seats]": String(seats),
      });

      const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: checkoutParams,
      });
      const session = (await stripeResponse.json()) as StripeCheckoutSession;

      if (!stripeResponse.ok || !session.url) {
        console.error("Stripe checkout response", session);
        return res.status(502).json({
          error: session.error?.message ?? "Unable to start secure checkout.",
        });
      }

      return res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout error", error);
      return res.status(500).json({
        error: "Unable to start checkout. Please try again or contact support.",
      });
    }
  });

  app.post("/api/enrollment/complete", async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const sessionId = readString(body.sessionId, 300);
    const password = readString(body.password, 200);
    const passwordError = validatePassword(password);

    if (!sessionId.startsWith("cs_") || passwordError) {
      return res.status(400).json({
        error: passwordError ?? "A valid Stripe Checkout session is required.",
      });
    }

    try {
      const session = await getStripeCheckoutSession(sessionId);
      const metadata = session.metadata ?? {};
      if (
        session.mode !== "payment" ||
        session.status !== "complete" ||
        session.payment_status !== "paid" ||
        metadata.courseId !== COURSE_ID
      ) {
        throw new HttpError(400, "Payment has not been verified for this course.");
      }

      const email = (session.customer_details?.email || session.customer_email || "")
        .trim()
        .toLowerCase();
      const firstName = readString(metadata.firstName, 80) || "Course";
      const lastName = readString(metadata.lastName, 80) || "Student";
      const enrollmentType = metadata.enrollmentType === "practice" ? "practice" : "individual";
      const organizationName = readString(metadata.organizationName, 160);
      const seats = Math.min(Math.max(readInteger(metadata.seats) || 1, 1), 50);
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (!email) throw new HttpError(400, "Stripe did not return a customer email address.");

      const result = await mutateDatabase((database) => {
        if (database.users.some((user) => user.checkoutSessionId === sessionId)) {
          throw new HttpError(409, "This purchase has already been activated. Please sign in.");
        }
        if (database.users.some((user) => user.email === email)) {
          throw new HttpError(409, "An account already exists for this email. Please sign in.");
        }

        const user: CourseUser = {
          id: randomUUID(),
          email,
          firstName,
          lastName,
          passwordHash: hashPassword(password),
          role: enrollmentType === "practice" ? "manager" : "student",
          organizationName: organizationName || undefined,
          seatLimit: seats,
          checkoutSessionId: sessionId,
          paymentIntentId,
          createdAt: new Date().toISOString(),
          progress: [],
        };
        database.users.push(user);

        if (user.role === "manager") {
          for (let index = 1; index < seats; index += 1) {
            const invite: PracticeInvite = {
              code: createInviteCode(),
              managerId: user.id,
              createdAt: new Date().toISOString(),
            };
            database.invites.push(invite);
          }
        }

        return user;
      });

      setSessionCookie(res, result.id);
      return res.status(201).json({ user: publicUser(result) });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Enrollment activation error", error);
      return res.status(500).json({ error: "Unable to activate course access." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = readString(body.email, 254).toLowerCase();
    const password = readString(body.password, 200);
    const database = await readDatabase();
    const user = database.users.find((candidate) => candidate.email === email);

    if (!user || user.accessRevoked || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }

    setSessionCookie(res, user.id);
    return res.json({ user: publicUser(user) });
  });

  app.post("/api/auth/logout", (_req, res) => {
    clearSessionCookie(res);
    res.status(204).end();
  });

  app.get("/api/auth/me", async (req, res) => {
    const user = await requireUser(req, res);
    if (!user) return;
    return res.json({ user: publicUser(user) });
  });

  app.post("/api/course/progress", async (req, res) => {
    const authenticatedUser = await requireUser(req, res);
    if (!authenticatedUser) return;

    const body = (req.body ?? {}) as Record<string, unknown>;
    const day = readInteger(body.day);
    const score = Number(body.score);
    if (!Number.isInteger(day) || day < 1 || day > MODULE_COUNT) {
      return res.status(400).json({ error: "A valid module day is required." });
    }
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return res.status(400).json({ error: "A valid quiz score is required." });
    }

    const updatedUser = await mutateDatabase((database) => {
      const user = database.users.find((candidate) => candidate.id === authenticatedUser.id);
      if (!user || user.accessRevoked) throw new HttpError(401, "Course access is unavailable.");

      const existing = user.progress.find((item) => item.day === day);
      const bestScore = Math.max(existing?.score ?? 0, Math.round(score * 10) / 10);
      const passed = Boolean(existing?.passed) || bestScore >= PASSING_SCORE;
      const now = new Date().toISOString();
      const progress = {
        day,
        score: bestScore,
        passed,
        updatedAt: now,
        completedAt: passed ? existing?.completedAt ?? now : undefined,
      };

      if (existing) Object.assign(existing, progress);
      else user.progress.push(progress);
      user.progress.sort((left, right) => left.day - right.day);
      return user;
    });

    return res.json({ user: publicUser(updatedUser) });
  });

  app.get("/api/practice/team", async (req, res) => {
    const manager = await requireUser(req, res);
    if (!manager) return;
    if (manager.role !== "manager") {
      return res.status(403).json({ error: "Practice manager access is required." });
    }

    const database = await readDatabase();
    const team = database.users
      .filter((user) => user.id === manager.id || user.managerId === manager.id)
      .map(publicUser);
    const invites = database.invites
      .filter((invite) => invite.managerId === manager.id)
      .map((invite) => ({
        code: invite.code,
        createdAt: invite.createdAt,
        usedAt: invite.usedAt,
        usedBy: invite.usedBy,
      }));

    return res.json({ team, invites, seatLimit: manager.seatLimit });
  });

  app.post("/api/practice/redeem", async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const code = readString(body.code, 40).toUpperCase();
    const firstName = readString(body.firstName, 80);
    const lastName = readString(body.lastName, 80);
    const email = readString(body.email, 254).toLowerCase();
    const password = readString(body.password, 200);
    const passwordError = validatePassword(password);

    if (!code || !firstName || !lastName || !/^\S+@\S+\.\S+$/.test(email) || passwordError) {
      return res.status(400).json({
        error: passwordError ?? "Please complete all required account fields.",
      });
    }

    try {
      const user = await mutateDatabase((database) => {
        const invite = database.invites.find((candidate) => candidate.code === code);
        if (!invite || invite.usedAt) throw new HttpError(400, "This invitation is invalid or has already been used.");
        if (database.users.some((candidate) => candidate.email === email)) {
          throw new HttpError(409, "An account already exists for this email.");
        }

        const manager = database.users.find(
          (candidate) => candidate.id === invite.managerId && candidate.role === "manager",
        );
        if (!manager || manager.accessRevoked) {
          throw new HttpError(400, "This practice enrollment is no longer available.");
        }

        const teamSize = database.users.filter(
          (candidate) => candidate.id === manager.id || candidate.managerId === manager.id,
        ).length;
        if (teamSize >= manager.seatLimit) {
          throw new HttpError(409, "All purchased practice seats have been assigned.");
        }

        const newUser: CourseUser = {
          id: randomUUID(),
          email,
          firstName,
          lastName,
          passwordHash: hashPassword(password),
          role: "student",
          organizationName: manager.organizationName,
          managerId: manager.id,
          seatLimit: 1,
          createdAt: new Date().toISOString(),
          progress: [],
        };
        database.users.push(newUser);
        invite.usedAt = new Date().toISOString();
        invite.usedBy = newUser.id;
        return newUser;
      });

      setSessionCookie(res, user.id);
      return res.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error("Practice invitation error", error);
      return res.status(500).json({ error: "Unable to create the invited account." });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
