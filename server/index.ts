import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { setupCheckoutRoutes } from "./src/routes/checkout";
import { setupAuthRoutes } from "./src/routes/auth";
import { setupLearnRoutes } from "./src/routes/learn";
import { setupLaunchReadinessRoutes } from "./src/routes/launchReadiness";
import { setupStripeWebhookRoute } from "./src/routes/stripeWebhook";
import { setupAlertTemplateRoutes } from "./src/routes/alertTemplates";
import { applySecurityHeaders } from "./src/config/securityHeaders";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const apiRouter = express.Router();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(applySecurityHeaders);
  setupStripeWebhookRoute(app);
  app.use(express.json());
  setupAuthRoutes(apiRouter);
  setupCheckoutRoutes(apiRouter);
  setupLearnRoutes(apiRouter);
  setupLaunchReadinessRoutes(apiRouter);
  await setupAlertTemplateRoutes(apiRouter);
  app.use("/api", apiRouter);

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
