import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readString(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getBaseUrl(req: express.Request): string {
  const configuredUrl = process.env.PUBLIC_APP_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = req.get("host");

  if (!host) {
    throw new Error("Unable to determine the public application URL.");
  }

  return `${protocol}://${host}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/enrollment/checkout", async (req, res) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const stripePriceId = process.env.STRIPE_STANDARD_PRICE_ID?.trim();

    if (!stripeSecretKey || !stripePriceId) {
      return res.status(503).json({
        error:
          "Enrollment checkout is not configured yet. Please contact the course administrator.",
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
    const requestedSeats = Number.parseInt(readString(body.seats, 3), 10);
    const seats = enrollmentType === "practice" ? requestedSeats : 1;

    if (!firstName || !lastName || !email || !phone || !goal) {
      return res.status(400).json({
        error: "Please complete all required enrollment fields.",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (enrollmentType === "practice" && !organizationName) {
      return res.status(400).json({
        error: "Please enter the practice or clinic name.",
      });
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
        "metadata[firstName]": firstName,
        "metadata[lastName]": lastName,
        "metadata[phone]": phone,
        "metadata[experience]": experience,
        "metadata[goal]": goal,
        "metadata[enrollmentType]": enrollmentType,
        "metadata[organizationName]": organizationName,
        "metadata[seats]": String(seats),
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

      const session = (await stripeResponse.json()) as {
        url?: string;
        error?: { message?: string };
      };

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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
