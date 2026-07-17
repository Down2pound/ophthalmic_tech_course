import { isUnsafeLaunchEnvironmentValue } from "./environment";

const publicAppUrlPlaceholder = "__PUBLIC_APP_URL__";

function normalizePublicAppUrl(publicAppUrl?: string): string {
  const trimmedUrl = publicAppUrl?.trim() ?? "";

  if (
    !trimmedUrl ||
    isUnsafeLaunchEnvironmentValue("PUBLIC_APP_URL", trimmedUrl)
  ) {
    return "";
  }

  return trimmedUrl.replace(/\/+$/, "");
}

export function injectPublicAppUrlMetadata({
  html,
  publicAppUrl = process.env.PUBLIC_APP_URL,
}: {
  html: string;
  publicAppUrl?: string;
}): string {
  const normalizedUrl = normalizePublicAppUrl(publicAppUrl);

  if (!normalizedUrl) {
    return html
      .replaceAll(`${publicAppUrlPlaceholder}/`, "/")
      .replaceAll(publicAppUrlPlaceholder, "");
  }

  return html.replaceAll(publicAppUrlPlaceholder, normalizedUrl);
}
