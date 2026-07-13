import { randomBytes } from "node:crypto";

export interface LaunchSecretDefinition {
  variableName: string;
  description: string;
}

export interface RenderLaunchSecretsInput {
  randomBytesProvider?: typeof randomBytes;
}

export const launchSecretDefinitions: LaunchSecretDefinition[] = [
  {
    variableName: "AUTH_SESSION_SECRET",
    description:
      "Signs passwordless sign-in sessions. Store it only in the host environment.",
  },
  {
    variableName: "PRACTICE_SEAT_ADMIN_TOKEN",
    description:
      "Protects temporary practice-seat assignment tools until full admin login exists.",
  },
  {
    variableName: "ALERT_ADMIN_TOKEN",
    description:
      "Protects temporary alert-button admin tools when the alert workflow is deployed.",
  },
];

function generateSecret(randomBytesProvider: typeof randomBytes): string {
  return randomBytesProvider(48).toString("base64url");
}

export function renderLaunchSecrets({
  randomBytesProvider = randomBytes,
}: RenderLaunchSecretsInput = {}): string {
  const lines = [
    "# OptiTech Academy Launch Secrets",
    "",
    "Paste these into your production host environment settings. Do not commit them to Git, save them in Google Drive, or send them in chat.",
    "",
    ...launchSecretDefinitions.flatMap(definition => [
      `# ${definition.description}`,
      `${definition.variableName}=${generateSecret(randomBytesProvider)}`,
      "",
    ]),
    "After adding them to the host dashboard, run `pnpm launch:doctor` or open `/api/launch/readiness` to recheck launch setup.",
    "",
  ];

  return lines.join("\n");
}
