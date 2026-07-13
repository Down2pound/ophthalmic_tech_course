import type { AlertTemplate } from "@shared/alerts/alertTemplates";

export async function fetchActiveAlertTemplates() {
  return fetchJson<AlertTemplate[]>("/api/alert-templates");
}

export async function fetchAdminAlertTemplates(adminToken?: string) {
  return fetchJson<AlertTemplate[]>("/api/admin/alert-templates", {
    headers: adminHeaders(adminToken),
  });
}

export async function saveAdminAlertTemplates(
  templates: AlertTemplate[],
  adminToken?: string
) {
  return fetchJson<AlertTemplate[]>("/api/admin/alert-templates", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...adminHeaders(adminToken) },
    body: JSON.stringify({ templates }),
  });
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function adminHeaders(adminToken?: string): Record<string, string> {
  return adminToken ? { "x-admin-token": adminToken } : {};
}
