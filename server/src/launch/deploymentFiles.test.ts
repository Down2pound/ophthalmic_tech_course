import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("deployment files", () => {
  it("documents how a Node host starts the production web service", async () => {
    const procfile = await readFile(
      path.resolve(process.cwd(), "Procfile"),
      "utf8"
    );

    expect(procfile.trim()).toBe("web: node dist/index.js");
  });

  it("keeps the Docker image aligned with the same production entrypoint", async () => {
    const dockerfile = await readFile(
      path.resolve(process.cwd(), "Dockerfile"),
      "utf8"
    );

    expect(dockerfile).toContain('CMD ["node", "dist/index.js"]');
    expect(dockerfile).toContain("/api/health");
  });

  it("keeps local backups and evidence out of Docker build context", async () => {
    const dockerignore = await readFile(
      path.resolve(process.cwd(), ".dockerignore"),
      "utf8"
    );

    expect(dockerignore).toContain(".env");
    expect(dockerignore).toContain("launch-evidence");
    expect(dockerignore).toContain("*.zip");
    expect(dockerignore).toContain("*.bundle");
    expect(dockerignore).toContain("node_modules");
  });

  it("keeps portable home-PC backups out of Git status", async () => {
    const gitignore = await readFile(
      path.resolve(process.cwd(), ".gitignore"),
      "utf8"
    );

    expect(gitignore).toContain("optitech-academy-source-*.zip");
    expect(gitignore).toContain("optitech-academy-branch-*.bundle");
  });

  it("keeps the Render Blueprint aligned with the launch service", async () => {
    const renderBlueprint = await readFile(
      path.resolve(process.cwd(), "render.yaml"),
      "utf8"
    );

    expect(renderBlueprint).toContain("name: optitech-academy");
    expect(renderBlueprint).toContain("runtime: node");
    expect(renderBlueprint).toContain("pnpm build");
    expect(renderBlueprint).toContain("preDeployCommand: pnpm db:setup");
    expect(renderBlueprint).toContain("startCommand: node dist/index.js");
    expect(renderBlueprint).toContain("healthCheckPath: /api/health");
    expect(renderBlueprint).toContain("fromDatabase:");
    expect(renderBlueprint).toContain("sync: false");
    expect(renderBlueprint).toContain("generateValue: true");
    expect(renderBlueprint).toContain("ALERT_ADMIN_TOKEN");
    expect(renderBlueprint).not.toContain("sk_test_");
    expect(renderBlueprint).not.toContain("whsec_");
  });

  it("runs the launch secret scan in GitHub launch CI", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const workflow = await readFile(
      path.resolve(process.cwd(), ".github/workflows/launch-ci.yml"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:secret-scan": "node scripts/launch-secret-scan.mjs"'
    );
    expect(workflow).toContain("pnpm launch:preflight");
    expect(workflow).toContain("pnpm launch:secret-scan");
    expect(workflow).toContain("actions/upload-artifact@v4");
  });

  it("keeps the backup handoff command runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const backupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-backup-handoff.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:backup": "node scripts/launch-backup-handoff.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:workstation-handoff": "node scripts/launch-blockers-summary.mjs && node scripts/launch-secret-scan.mjs && node scripts/launch-backup-handoff.mjs"'
    );
    expect(backupScript).toContain('path.join(projectRoot, ".git", "HEAD")');
    expect(backupScript).toContain("formatBackupStatus");
    expect(backupScript).toContain("git clone ${restoreBundleName}");
    expect(backupScript).toContain("git remote set-url origin");
    expect(backupScript).toContain("pnpm install");
    expect(backupScript).toContain("pnpm launch:preflight");
    expect(backupScript).toContain("pnpm launch:first-sales");
    expect(backupScript).not.toContain("execSync");
  });

  it("keeps a work-computer-safe launch blocker summary available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const blockerScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-blockers-summary.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:blockers": "node scripts/launch-blockers-summary.mjs"'
    );
    expect(blockerScript).toContain("STRIPE_SECRET_KEY");
    expect(blockerScript).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
    expect(blockerScript).toContain("docs/launch/go-live-checklist.md");
    expect(blockerScript).toContain("First-Sale Action Order");
    expect(blockerScript).toContain("pnpm launch:preflight");
    expect(blockerScript).toContain("pnpm launch:clinical-review");
    expect(blockerScript).toContain("pnpm launch:env-template");
    expect(blockerScript).toContain("pnpm db:setup");
    expect(blockerScript).toContain("LAUNCH_BASE_URL");
    expect(blockerScript).not.toContain("execSync");
  });

  it("keeps a work-computer-safe production env template command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const envTemplateScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-env-template.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:env-template": "node scripts/launch-env-template.mjs"'
    );
    expect(envTemplateScript).toContain("Host Dashboard Paste Template");
    expect(envTemplateScript).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(envTemplateScript).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false"
    );
    expect(envTemplateScript).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(envTemplateScript).not.toContain("execSync");
    expect(envTemplateScript).not.toContain("sk_test_");
    expect(envTemplateScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe clinical review checklist command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const clinicalReviewScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-clinical-review.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:clinical-review": "node scripts/launch-clinical-review.mjs"'
    );
    expect(clinicalReviewScript).toContain(
      "OptiTech Academy Clinical Review Checklist"
    );
    expect(clinicalReviewScript).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false"
    );
    expect(clinicalReviewScript).toContain(
      "/api/launch/clinical-review-packet.md"
    );
    expect(clinicalReviewScript).not.toContain("execSync");
    expect(clinicalReviewScript).not.toContain("sk_test_");
    expect(clinicalReviewScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first-sales link packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstSalesScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-sales-links.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-sales": "node scripts/launch-first-sales-links.mjs"'
    );
    expect(firstSalesScript).toContain(
      "OptiTech Academy First Sales Link Packet"
    );
    expect(firstSalesScript).toContain("/checkout");
    expect(firstSalesScript).toContain("/practice-packs");
    expect(firstSalesScript).toContain(
      "docs/launch/first-customers-sales-packet.md"
    );
    expect(firstSalesScript).not.toContain("execSync");
    expect(firstSalesScript).not.toContain("sk_test_");
    expect(firstSalesScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe sales tracker export command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const salesTrackerScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-sales-tracker.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:sales-tracker": "node scripts/launch-sales-tracker.mjs"'
    );
    expect(salesTrackerScript).toContain("lead-tracker.csv");
    expect(salesTrackerScript).toContain("purchase-tracker.csv");
    expect(salesTrackerScript).toContain("weekly-business-review.csv");
    expect(salesTrackerScript).toContain("Do not paste secrets");
    expect(salesTrackerScript).not.toContain("execSync");
    expect(salesTrackerScript).not.toContain("sk_test_");
    expect(salesTrackerScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe Stripe product setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const stripeProductsScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-stripe-products.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:stripe-products": "node scripts/launch-stripe-products.mjs"'
    );
    expect(stripeProductsScript).toContain(
      "OptiTech Academy Stripe Product Setup"
    );
    expect(stripeProductsScript).toContain("optitech_founding_learner_199");
    expect(stripeProductsScript).toContain("optitech_practice_5_seats_799");
    expect(stripeProductsScript).toContain("optitech_practice_15_seats_1799");
    expect(stripeProductsScript).toContain("checkout.session.completed");
    expect(stripeProductsScript).not.toContain("execSync");
    expect(stripeProductsScript).not.toContain("sk_test_");
    expect(stripeProductsScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe email setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const emailSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-email-setup.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:email-setup": "node scripts/launch-email-setup.mjs"'
    );
    expect(emailSetupScript).toContain("OptiTech Academy Email Setup");
    expect(emailSetupScript).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(emailSetupScript).toContain("https://api.resend.com/emails");
    expect(emailSetupScript).toContain("SIGN_IN_FROM_EMAIL");
    expect(emailSetupScript).toContain("Your OptiTech Academy sign-in link");
    expect(emailSetupScript).not.toContain("execSync");
    expect(emailSetupScript).not.toContain("sk_test_");
    expect(emailSetupScript).not.toContain("whsec_");
  });
});
