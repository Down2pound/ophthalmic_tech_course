# OptiTech Academy Domain And Sharing Guide

Use this when the app is deployed and you are ready to connect the real website
address buyers will see. The domain is the app's public street address. If it is
wrong, checkout redirects, sign-in emails, smoke tests, sitemap links, and shared
previews can point people to the wrong place.

## What You Need First

- A deployed app URL that starts with `https://`.
- Access to the host dashboard where environment variables are set.
- Access to the domain provider if you are using a custom domain.
- The launch package, Stripe guide, email guide, database guide, and go-live
  checklist nearby.

Do not save secrets, card numbers, magic-link tokens, cookies, database
passwords, Stripe secret keys, or email API keys in this guide.

## Pick The Public URL

Choose one official buyer-facing URL. Examples:

```text
https://academy.yourdomain.com
https://ophthalmictech.yourdomain.com
```

Use the same URL everywhere:

- `PUBLIC_APP_URL` in the host dashboard.
- Stripe success and cancel redirects.
- Passwordless sign-in email links.
- Smoke test command.
- Sitemap generation command.
- Any QR codes, flyers, staff emails, or sales links.

Avoid switching between several URLs. For example, do not send one buyer to a
temporary host URL and another buyer to a custom domain unless you are testing.

## Set The Host Environment Variable

In the production host dashboard, set:

```text
PUBLIC_APP_URL=https://your-real-domain.example
```

Then redeploy or restart the app so the new value is active.

Beginner translation: this tells the app, "When you make links, use this real
website address."

## Confirm Buyer Pages Open

Open these in a private browser window:

```text
https://your-real-domain.example/
https://your-real-domain.example/checkout
https://your-real-domain.example/practice-packs
https://your-real-domain.example/curriculum
https://your-real-domain.example/onboarding
https://your-real-domain.example/policies
```

Each page should load without asking for an admin token. The practice-seat admin
page should stay protected.

## Run The Smoke Test

From your computer, run:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
```

Save the output with the rest of the launch evidence. This pre-launch command
can pass before `readyForPaidLaunch` is true, as long as health and public buyer
pages load. For the final go-live check after every paid launch gate is
complete, run the same command without `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.

To also prove custom-practice lead capture after deployment, run one smoke test
with:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true LAUNCH_BASE_URL=https://your-real-domain.example pnpm launch:smoke
```

If the command is blocked on a work computer, run it later from your home PC and
keep the output.

## Generate The Sitemap

After `PUBLIC_APP_URL` is set to the real `https` domain, run:

```bash
PUBLIC_APP_URL=https://your-real-domain.example pnpm launch:sitemap
```

This creates:

```text
dist/public/sitemap.xml
```

The sitemap is a simple list that tells search engines which public pages exist.
After deployment, confirm this opens:

```text
https://your-real-domain.example/sitemap.xml
```

Also confirm this opens:

```text
https://your-real-domain.example/robots.txt
```

`robots.txt` should allow public pages and block private/admin-style areas.

## Check Shared Link Previews

Paste the public URL into a test message or draft email and confirm the preview
looks professional:

- Title: OptiTech Academy.
- Description: ophthalmic technician foundations training.
- Link points to the real production domain.
- No localhost, temporary preview URL, or admin URL appears.

The app already includes basic page title and description metadata in
`client/index.html`. If you later add a social preview image, use a simple
professional image and keep the file public.

## Stripe And Email Link Check

Before live sales:

1. Start a Stripe test checkout from the production domain.
2. Cancel checkout and confirm Stripe sends you back to the production domain.
3. Complete checkout and confirm Stripe sends you back to the production domain.
4. Request a passwordless sign-in email.
5. Confirm the sign-in email link starts with the production domain.

If any link uses `localhost`, a preview URL, or an old domain, fix
`PUBLIC_APP_URL` and redeploy before accepting paid buyers.

## Sales Link Checklist

Use only these public links in emails, social posts, flyers, and direct messages:

```text
Individual learners: https://your-real-domain.example/checkout
Practice buyers: https://your-real-domain.example/practice-packs
Course overview: https://your-real-domain.example/curriculum
Policies: https://your-real-domain.example/policies
```

Do not share:

- `/practice-seat-admin`
- `/launch-readiness`
- `/api/...`
- Any Stripe dashboard URL
- Any host dashboard URL

## Evidence To Save

Save these with the launch evidence folder:

- Final production domain.
- Date `PUBLIC_APP_URL` was set.
- Smoke test output.
- Hosted `/sitemap.xml` URL.
- Hosted `/robots.txt` URL.
- A screenshot or note confirming shared link preview looks correct.
- Stripe test notes showing success and cancel redirects used the production
  domain.
- Sign-in email test note showing the email link used the production domain.
