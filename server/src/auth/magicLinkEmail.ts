import type { MagicLinkEmailPayload } from "./passwordlessSignIn";

type Fetcher = typeof fetch;

export interface MagicLinkEmailMessage {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export type TransactionalEmailMessage = MagicLinkEmailMessage;

export interface SendMagicLinkEmailInput {
  payload: MagicLinkEmailPayload;
  from: string;
  apiUrl: string;
  apiKey: string;
  fetcher?: Fetcher;
}

export interface SendMagicLinkEmailResult {
  sent: true;
  providerMessageId?: string;
}

interface ProviderResponse {
  id?: string;
  messageId?: string;
}

export interface SendTransactionalEmailInput {
  message: TransactionalEmailMessage;
  apiUrl: string;
  apiKey: string;
  fetcher?: Fetcher;
  failureMessage?: string;
}

export function createMagicLinkEmailMessage({
  payload,
  from,
}: {
  payload: MagicLinkEmailPayload;
  from: string;
}): MagicLinkEmailMessage {
  return {
    from,
    to: payload.to,
    subject: payload.subject,
    text: `Use this secure link to sign in to OptiTech Academy: ${payload.signInUrl}\n\nThis link expires soon and can only be used once.`,
    html: `<p>Use this secure link to sign in to OptiTech Academy:</p><p><a href="${payload.signInUrl}">Sign in to OptiTech Academy</a></p><p>This link expires soon and can only be used once.</p>`,
  };
}

export async function sendTransactionalEmailMessage({
  message,
  apiUrl,
  apiKey,
  fetcher = fetch,
  failureMessage = "Email could not be sent.",
}: SendTransactionalEmailInput): Promise<SendMagicLinkEmailResult> {
  const response = await fetcher(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  const providerResponse = (await response.json().catch(() => ({}))) as
    | ProviderResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(failureMessage);
  }

  return {
    sent: true,
    providerMessageId:
      "id" in providerResponse
        ? providerResponse.id
        : "messageId" in providerResponse
          ? providerResponse.messageId
          : undefined,
  };
}

export async function sendMagicLinkEmail({
  payload,
  from,
  apiUrl,
  apiKey,
  fetcher = fetch,
}: SendMagicLinkEmailInput): Promise<SendMagicLinkEmailResult> {
  return sendTransactionalEmailMessage({
    message: createMagicLinkEmailMessage({ payload, from }),
    apiUrl,
    apiKey,
    fetcher,
    failureMessage: "Sign-in email could not be sent.",
  });
}
