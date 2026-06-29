import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const priceIdsByTier = {
  standard: process.env.STRIPE_STANDARD_PRICE_ID,
  practice: process.env.STRIPE_PRACTICE_PRICE_ID,
};

type EnrollmentTier = keyof typeof priceIdsByTier;

function getBaseUrl(req: express.Request) {
  if (process.env.PUBLIC_APP_URL) {
    return process.env.PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const protocol = req.get("x-forwarded-proto") ?? req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  app.post("/api/enrollment/checkout", async (req, res) => {
    if (!stripeSecretKey) {
      return res.status(503).json({
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY and the Stripe price ID environment variables before accepting enrollments.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      experience,
      goal,
      type,
      organizationName,
      seats,
      tier = "standard",
    } = req.body ?? {};

    if (!firstName || !lastName || !email || !phone || !goal || !type) {
      return res.status(400).json({
        error: "Please complete all required enrollment fields.",
      });
    }

    if (type === "practice" && !organizationName) {
      return res.status(400).json({
        error: "Please enter the practice or clinic name.",
      });
    }

    const normalizedTier: EnrollmentTier =
      tier === "practice" || type === "practice" ? "practice" : "standard";
    const priceId = priceIdsByTier[normalizedTier];

    if (!priceId) {
      return res.status(503).json({
        error: `Stripe price is not configured for the ${normalizedTier} enrollment tier.`,
      });
    }

    try {
      const baseUrl = getBaseUrl(req);
      const checkoutParams = new URLSearchParams({
        mode: "subscription",
        customer_email: email,
        success_url: `${baseUrl}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/?enrollment=cancelled`,
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": String(Math.max(Number(seats) || 1, 1)),
        "metadata[firstName]": firstName,
        "metadata[lastName]": lastName,
        "metadata[phone]": phone,
        "metadata[experience]": experience,
        "metadata[goal]": goal,
        "metadata[enrollmentType]": type,
        "metadata[tier]": normalizedTier,
        "metadata[organizationName]": organizationName ?? "",
        "subscription_data[metadata][email]": email,
        "subscription_data[metadata][enrollmentType]": type,
        "subscription_data[metadata][tier]": normalizedTier,
      });

      const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Stripe-Version": "2026-02-25.clover",
        },
        body: checkoutParams,
      });

      const session = await stripeResponse.json();

      if (!stripeResponse.ok || !session.url) {
        console.error("Stripe checkout response", session);
        return res.status(502).json({
          error: session.error?.message ?? "Unable to start Stripe checkout.",
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
