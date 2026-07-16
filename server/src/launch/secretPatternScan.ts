export interface SecretPatternFinding {
  filePath: string;
  lineNumber: number;
  patternName: string;
}

interface SecretPattern {
  name: string;
  regex: RegExp;
}

const secretPatterns: SecretPattern[] = [
  {
    name: "Stripe secret key",
    regex: /\bsk_(?:test|live)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "Stripe webhook secret",
    regex: /\bwhsec_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "Resend API key",
    regex: /\bre_[A-Za-z0-9]{20,}\b/g,
  },
  {
    name: "PostgreSQL connection string with password",
    regex: /\bpostgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@[^\s]+/g,
  },
];

export function scanTextForLaunchSecrets({
  filePath,
  text,
}: {
  filePath: string;
  text: string;
}): SecretPatternFinding[] {
  const findings: SecretPatternFinding[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    secretPatterns.forEach(pattern => {
      pattern.regex.lastIndex = 0;

      if (pattern.regex.test(line)) {
        findings.push({
          filePath,
          lineNumber: index + 1,
          patternName: pattern.name,
        });
      }
    });
  });

  return findings;
}
