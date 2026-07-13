import type { Request, Response, Router } from "express";
import { createAlertTemplateStore } from "../alerts/alertTemplateStore";
import type { AlertTemplate } from "../../../shared/alerts/alertTemplates";

const clients = new Set<Response>();

export async function setupAlertTemplateRoutes(router: Router) {
  const store = await createAlertTemplateStore();

  router.get("/alert-templates", async (_req: Request, res: Response) => {
    res.json(await store.listActiveTemplates());
  });

  router.get("/admin/alert-templates", async (req: Request, res: Response) => {
    if (!authorizeAdminRequest(req, res)) return;
    res.json(await store.listAllTemplates());
  });

  router.put("/admin/alert-templates", async (req: Request, res: Response) => {
    if (!authorizeAdminRequest(req, res)) return;
    const templates = Array.isArray(req.body?.templates)
      ? (req.body.templates as AlertTemplate[])
      : [];
    const saved = await store.saveAllTemplates(templates);
    broadcastTemplatesUpdated();
    res.json(saved);
  });

  router.delete("/admin/alert-templates/:id", async (req: Request, res: Response) => {
    if (!authorizeAdminRequest(req, res)) return;
    const saved = await store.deleteTemplate(req.params.id);
    broadcastTemplatesUpdated();
    res.json(saved);
  });

  router.get("/alert-templates/events", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    res.write("event: templatesUpdated\ndata: {}\n\n");
    clients.add(res);

    req.on("close", () => {
      clients.delete(res);
    });
  });
}

function broadcastTemplatesUpdated() {
  clients.forEach((client) => {
    client.write("event: templatesUpdated\ndata: {}\n\n");
  });
}

function authorizeAdminRequest(req: Request, res: Response) {
  const providedToken = req.header("x-admin-token") ?? undefined;
  if (isAlertAdminRequestAuthorized(process.env.ALERT_ADMIN_TOKEN, providedToken)) {
    return true;
  }

  res.status(401).json({ error: "Admin token required." });
  return false;
}

export function isAlertAdminRequestAuthorized(
  configuredToken: string | undefined,
  providedToken: string | undefined
) {
  const expected = configuredToken?.trim();
  const actual = providedToken?.trim();

  if (!expected || !actual) return false;
  return actual === expected;
}
