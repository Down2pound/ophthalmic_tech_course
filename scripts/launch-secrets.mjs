import { randomBytes } from "node:crypto";

const launchSecretDefinitions = [
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

function generateSecret() {
  return randomBytes(48).toString("base64url");
}

const output = [
  "# OptiTech Academy Launch Secrets",
  "",
  "Paste these into your production host environment settings. Do not commit them to Git, save them in Google Drive, or send them in chat.",
  "",
  ...launchSecretDefinitions.flatMap(definition => [
    `# ${definition.description}`,
    `${definition.variableName}=${generateSecret()}`,
    "",
  ]),
  "After adding them to the host dashboard, run `pnpm launch:doctor` or open `/api/launch/readiness` to recheck launch setup.",
  "",
].join("\n");

console.log(output);
