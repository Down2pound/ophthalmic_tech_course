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

  it("keeps a work-computer-safe first 10 customers launch command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstCustomersScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-10-customers.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-10-customers": "node scripts/launch-first-10-customers.mjs"'
    );
    expect(firstCustomersScript).toContain(
      "OptiTech Academy First 10 Customers Plan"
    );
    expect(firstCustomersScript).toContain("Individual learners");
    expect(firstCustomersScript).toContain("Practice buyers");
    expect(firstCustomersScript).toContain("Do not send paid checkout links");
    expect(firstCustomersScript).toContain(
      "docs/launch/first-customers-sales-packet.md"
    );
    expect(firstCustomersScript).not.toContain("execSync");
    expect(firstCustomersScript).not.toContain("sk_test_");
    expect(firstCustomersScript).not.toContain("whsec_");
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

  it("keeps a work-computer-safe database setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const databaseSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-database-setup.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:database-setup": "node scripts/launch-database-setup.mjs"'
    );
    expect(databaseSetupScript).toContain("OptiTech Academy Database Setup");
    expect(databaseSetupScript).toContain("DATABASE_URL=");
    expect(databaseSetupScript).toContain("DATABASE_SSL=true");
    expect(databaseSetupScript).toContain("commerce_purchases");
    expect(databaseSetupScript).toContain("auth_magic_links");
    expect(databaseSetupScript).toContain("assessment_attempts");
    expect(databaseSetupScript).not.toContain("execSync");
    expect(databaseSetupScript).not.toContain("postgres://");
    expect(databaseSetupScript).not.toContain("sk_test_");
    expect(databaseSetupScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe admin token setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const adminTokensScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-admin-tokens.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:admin-tokens": "node scripts/launch-admin-tokens.mjs"'
    );
    expect(adminTokensScript).toContain("OptiTech Academy Admin Token Setup");
    expect(adminTokensScript).toContain("PRACTICE_SEAT_ADMIN_TOKEN");
    expect(adminTokensScript).toContain("ALERT_ADMIN_TOKEN");
    expect(adminTokensScript).toContain("/practice-seat-admin");
    expect(adminTokensScript).toContain("/admin/alert-templates");
    expect(adminTokensScript).not.toContain("execSync");
    expect(adminTokensScript).not.toContain("sk_test_");
    expect(adminTokensScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe Render deployment setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const renderSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-render-setup.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:render-setup": "node scripts/launch-render-setup.mjs"'
    );
    expect(renderSetupScript).toContain(
      "OptiTech Academy Render Deployment Setup"
    );
    expect(renderSetupScript).toContain("render.yaml");
    expect(renderSetupScript).toContain("optitech-academy");
    expect(renderSetupScript).toContain("pnpm build");
    expect(renderSetupScript).toContain("pnpm db:setup");
    expect(renderSetupScript).toContain("node dist/index.js");
    expect(renderSetupScript).toContain("/api/health");
    expect(renderSetupScript).toContain("/api/launch/readiness");
    expect(renderSetupScript).toContain("LAUNCH_SMOKE_ALLOW_NOT_READY");
    expect(renderSetupScript).not.toContain("execSync");
    expect(renderSetupScript).not.toContain("sk_test_");
    expect(renderSetupScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe live purchase rehearsal command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const livePurchaseScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-live-purchase-test.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:live-purchase-test": "node scripts/launch-live-purchase-test.mjs"'
    );
    expect(livePurchaseScript).toContain(
      "OptiTech Academy Live Purchase Rehearsal"
    );
    expect(livePurchaseScript).toContain("Founding Learner Access");
    expect(livePurchaseScript).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(livePurchaseScript).toContain("/api/launch/readiness");
    expect(livePurchaseScript).toContain("/api/checkout/availability");
    expect(livePurchaseScript).toContain("checkout.session.completed");
    expect(livePurchaseScript).toContain("turn paid enrollment back off");
    expect(livePurchaseScript).not.toContain("execSync");
    expect(livePurchaseScript).not.toContain("sk_test_");
    expect(livePurchaseScript).not.toContain("whsec_");
  });

  it("keeps a standalone first-sale support runbook in launch docs", async () => {
    const supportRunbook = await readFile(
      path.resolve(process.cwd(), "docs/launch/first-sale-support-runbook.md"),
      "utf8"
    );

    expect(supportRunbook).toContain(
      "OptiTech Academy First Sale Support Runbook"
    );
    expect(supportRunbook).toContain("Payment Succeeded But Access Is Missing");
    expect(supportRunbook).toContain("recommended next support actions");
    expect(supportRunbook).toContain("Practice Seat Manager");
    expect(supportRunbook).toContain("Access revocation");
    expect(supportRunbook).toContain("GET /api/support/buyer-lookup");
    expect(supportRunbook).not.toContain("sk_test_");
    expect(supportRunbook).not.toContain("whsec_");
  });

  it("keeps a standalone Bootcamp content migration checklist in launch docs", async () => {
    const checklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/bootcamp-content-migration-checklist.md"
      ),
      "utf8"
    );

    expect(checklist).toContain(
      "OptiTech Academy Bootcamp Content Migration Checklist"
    );
    expect(checklist).toContain("Bootcamp days mapped: 10");
    expect(checklist).toContain("Source assets mapped: 36");
    expect(checklist).toContain("NotebookLM source workspace");
    expect(checklist).toContain(
      "Day 1: Foundations and the First Patient Encounter"
    );
    expect(checklist).toContain(
      "Day 10: Simulation Capstone and Certification Roadmap"
    );
    expect(checklist).toContain(
      "Do not sell unpublished modules as complete content"
    );
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_");
  });

  it("keeps a standalone Module 1 clinical review packet in launch docs", async () => {
    const packet = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/module-1-clinical-review-packet.md"
      ),
      "utf8"
    );

    expect(packet).toContain(
      "Module 1: Entering Ophthalmic Care Clinical Review Packet"
    );
    expect(packet).toContain("Clinical reviewer name: [blank]");
    expect(packet).toContain("Lesson ID: m1-l1-what-techs-do");
    expect(packet).toContain("What Ophthalmic Technicians Do");
    expect(packet).toContain("The Eye Clinic Patient Journey");
    expect(packet).toContain(
      "Professional Boundaries, Privacy, and Escalation"
    );
    expect(packet).toContain(
      "Does the lesson avoid diagnosis, treatment advice, or independent clinical authority?"
    );
    expect(packet).toContain("Reviewer signature: [blank]");
    expect(packet).not.toContain("sk_test_");
    expect(packet).not.toContain("whsec_");
  });

  it("keeps a standalone production environment checklist in launch docs", async () => {
    const checklist = await readFile(
      path.resolve(process.cwd(), "docs/launch/production-env-checklist.md"),
      "utf8"
    );

    expect(checklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(checklist).toContain("Host Dashboard Paste Template");
    expect(checklist).toContain("PUBLIC_APP_URL=https://your-domain.example");
    expect(checklist).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(checklist).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED=false");
    expect(checklist).toContain(
      "TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails"
    );
    expect(checklist).toContain("pnpm launch:doctor");
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_");
    expect(checklist).not.toContain("replace_with");
  });

  it("keeps a standalone manual launch QA evidence template in launch docs", async () => {
    const template = await readFile(
      path.resolve(process.cwd(), "docs/launch/manual-launch-qa-evidence.md"),
      "utf8"
    );

    expect(template).toContain("OptiTech Academy Manual Launch QA Evidence");
    expect(template).toContain("Deployment URL:");
    expect(template).toContain("Commit SHA:");
    expect(template).toContain("Stripe checkout session ID:");
    expect(template).toContain("Individual checkout success return URL:");
    expect(template).toContain("Passwordless Email Delivery");
    expect(template).toContain("Practice checkout success return URL:");
    expect(template).toContain("Custom Practice Inquiry Test");
    expect(template).toContain("Sitemap URL or generated sitemap path:");
    expect(template).toContain("ENABLE_PAID_ENROLLMENT stayed false");
    expect(template).not.toContain("sk_test_");
    expect(template).not.toContain("whsec_");
  });

  it("keeps a standalone runtime readiness snapshot guide in launch docs", async () => {
    const guide = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/runtime-readiness-snapshot-guide.md"
      ),
      "utf8"
    );

    expect(guide).toContain(
      "OptiTech Academy Runtime Readiness Snapshot Guide"
    );
    expect(guide).toContain("/api/launch/readiness");
    expect(guide).toContain("readyForPaidLaunch");
    expect(guide).toContain("individualLearner");
    expect(guide).toContain("practicePacks");
    expect(guide).toContain("databaseReadiness");
    expect(guide).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
    expect(guide).toContain("ENABLE_PAID_ENROLLMENT");
    expect(guide).not.toContain("sk_test_");
    expect(guide).not.toContain("whsec_");
  });
});
