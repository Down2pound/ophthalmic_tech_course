# OptiTech Phase Two Commerce Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first safe commerce layer for OptiTech Academy: one typed offer model, required policy pages, a checkout-ready public flow, and a Stripe Checkout Sessions API route that never stores card data.

**Architecture:** Keep the current Vite/React/Express monorepo. Put offer and policy facts in shared TypeScript modules, render them on public pages, and use Express API routes for checkout session creation. Stripe is server-only; the client calls an internal endpoint and follows the returned hosted Checkout URL.

**Tech Stack:** React 19, Vite, TypeScript, Wouter, Express, Vitest, Stripe Checkout Sessions API.

---

## Why This Phase Matters

Phase 1 made a real course preview. Phase 2 makes the product safer to sell.

The key idea: before taking money, the app must clearly say what the learner gets, what they do not get, how refunds work, and what checkout will do. This protects learners and protects the business.

This phase does not build full accounts, practice seats, certificates, or database-backed enrollments. Those come after checkout and access rules are proven.

## Files And Responsibilities

- Create `shared/commerce/offers.ts`: canonical pricing, access duration, included content, and purchase limitations.
- Create `shared/commerce/policies.ts`: educational limitation, refund, privacy, and terms copy used by public pages.
- Create `shared/commerce/commerce.test.ts`: tests that prove offer and policy copy stay honest.
- Create `server/src/services/stripeCheckout.ts`: server-only Checkout Session helper with environment validation.
- Create `server/src/services/stripeCheckout.test.ts`: tests for missing env, request shape, and no card-data handling.
- Create `server/src/routes/checkout.ts`: Express route for `POST /api/checkout/sessions`.
- Modify `server/index.ts`: mount JSON parsing and the checkout route before static file handling.
- Create `client/src/lib/checkoutClient.ts`: client helper for calling the checkout route.
- Create `client/src/lib/checkoutClient.test.ts`: tests for success and failure responses.
- Create `client/src/pages/Policies.tsx`: public Terms, Privacy, Refund, and Educational Limitations page.
- Create `client/src/pages/Checkout.tsx`: checkout readiness page with offer summary and disabled/working checkout states.
- Modify `client/src/App.tsx`: add `/checkout` and `/policies` routes.
- Modify `client/src/pages/Home.tsx`: route paid CTA to `/checkout` and add policy links.

## Task 1: Canonical Offer And Policies

**Files:**
- Create: `shared/commerce/offers.ts`
- Create: `shared/commerce/policies.ts`
- Create: `shared/commerce/commerce.test.ts`

- [ ] **Step 1: Write failing offer and policy tests**

Create `shared/commerce/commerce.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { foundingLearnerOffer } from "./offers";
import { commercePolicies } from "./policies";

describe("foundingLearnerOffer", () => {
  it("uses the approved founding learner price and access period", () => {
    expect(foundingLearnerOffer.id).toBe("founding-learner");
    expect(foundingLearnerOffer.priceCents).toBe(19900);
    expect(foundingLearnerOffer.currency).toBe("usd");
    expect(foundingLearnerOffer.accessMonths).toBe(12);
  });

  it("does not promise certification, employment, or hands-on verification", () => {
    const combined = [
      foundingLearnerOffer.description,
      ...foundingLearnerOffer.includes,
      ...foundingLearnerOffer.limitations,
    ].join(" ");

    expect(combined).toMatch(/not certification/i);
    expect(combined).toMatch(/does not guarantee employment/i);
    expect(combined).toMatch(/does not verify hands-on/i);
  });
});

describe("commercePolicies", () => {
  it("contains all public policy sections required before purchase", () => {
    expect(commercePolicies.map((policy) => policy.slug)).toEqual([
      "educational-limitations",
      "refund-policy",
      "privacy-summary",
      "terms-summary",
    ]);
  });

  it("keeps policy sections learner-facing and non-empty", () => {
    for (const policy of commercePolicies) {
      expect(policy.title.length).toBeGreaterThan(8);
      expect(policy.body.length).toBeGreaterThan(120);
      expect(policy.body).not.toMatch(/legal advice/i);
    }
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- shared/commerce/commerce.test.ts
```

Expected: FAIL because `shared/commerce/offers.ts` and `shared/commerce/policies.ts` do not exist.

- [ ] **Step 3: Create offer model**

Create `shared/commerce/offers.ts`:

```ts
export interface CourseOffer {
  id: string;
  name: string;
  stripeLookupKey: string;
  priceCents: number;
  currency: "usd";
  accessMonths: number;
  description: string;
  includes: string[];
  limitations: string[];
}

export const foundingLearnerOffer: CourseOffer = {
  id: "founding-learner",
  name: "Founding Learner Access",
  stripeLookupKey: "optitech_founding_learner_199",
  priceCents: 19900,
  currency: "usd",
  accessMonths: 12,
  description:
    "Self-paced founding access to OptiTech Academy Ophthalmic Technician Foundations as published modules are released.",
  includes: [
    "Published Module 1 lessons and future modules released during the access period.",
    "Knowledge checks and module assessments for published content.",
    "Downloadable checklists and Skills Passport materials when available.",
    "Certificate of completion for finished published content after requirements are met.",
  ],
  limitations: [
    "Course completion is not certification.",
    "Online completion does not verify hands-on clinical competency.",
    "The course does not guarantee employment, exam eligibility, exam success, income, or promotion.",
    "Learners must follow employer policies, provider instructions, and applicable state or local rules.",
  ],
};

export function formatOfferPrice(offer: CourseOffer): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.priceCents / 100);
}
```

- [ ] **Step 4: Create policy copy**

Create `shared/commerce/policies.ts`:

```ts
export interface CommercePolicy {
  slug: "educational-limitations" | "refund-policy" | "privacy-summary" | "terms-summary";
  title: string;
  body: string;
}

export const commercePolicies: CommercePolicy[] = [
  {
    slug: "educational-limitations",
    title: "Educational Limitations",
    body:
      "OptiTech Academy is an educational program for foundational ophthalmic knowledge, vocabulary, clinic habits, and supervised practice preparation. Completion is not IJCAHPO certification, does not replace employer-supervised clinical training, and does not independently verify hands-on clinical competency. Learners should use Skills Passport materials with an employer, supervisor, or qualified clinical trainer.",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    body:
      "Founding learner purchases include a seven-day refund window starting at purchase, provided the learner has not completed more than one full module assessment. Refund requests should include the purchaser email and reason for the request. Practice or group purchases, custom training services, and downloaded materials may require a separate written agreement before purchase.",
  },
  {
    slug: "privacy-summary",
    title: "Privacy Summary",
    body:
      "OptiTech Academy collects only the information needed to provide access, learning progress, support, receipts, and course communication. Payment card details are handled by Stripe Checkout and are not stored by this application. Learners should not enter patient information, protected health information, or private employer data into course forms or support requests.",
  },
  {
    slug: "terms-summary",
    title: "Terms Summary",
    body:
      "Course materials are for the enrolled learner or purchasing organization and may not be copied, resold, or represented as an official certification product. OptiTech Academy may update lessons, assessments, release schedules, and policies as the founding course improves, while keeping purchase terms visible before checkout.",
  },
];
```

- [ ] **Step 5: Run tests**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- shared/commerce/commerce.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add shared/commerce
& "$gitRoot\cmd\git.exe" commit -m "feat: add commerce offer model"
```

## Task 2: Public Policy And Checkout Pages

**Files:**
- Create: `client/src/pages/Policies.tsx`
- Create: `client/src/pages/Checkout.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/pages/Home.tsx`

- [ ] **Step 1: Create policies page**

Create `client/src/pages/Policies.tsx`:

```tsx
import { Card } from "@/components/ui/card";
import { commercePolicies } from "@shared/commerce/policies";

export default function Policies() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-sm font-semibold text-blue-700">OptiTech Academy</p>
          <h1 className="mt-2 text-4xl font-bold">Purchase Policies</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            These summaries must be visible before checkout so learners understand access, refunds, privacy, and educational limits.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8">
        {commercePolicies.map((policy) => (
          <Card key={policy.slug} className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-semibold">{policy.title}</h2>
            <p className="mt-3 leading-7 text-slate-700">{policy.body}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create checkout page**

Create `client/src/pages/Checkout.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { foundingLearnerOffer, formatOfferPrice } from "@shared/commerce/offers";
import { commercePolicies } from "@shared/commerce/policies";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function Checkout() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold text-blue-700">OptiTech Academy</p>
          <h1 className="mt-2 text-4xl font-bold">Founding Learner Access</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Review what is included before purchase. Payment will use Stripe-hosted Checkout when enabled.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-semibold">{foundingLearnerOffer.name}</h2>
            <p className="mt-3 text-slate-700">{foundingLearnerOffer.description}</p>
            <div className="mt-6 grid gap-3">
              {foundingLearnerOffer.includes.map((item) => (
                <div key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Important limitations
            </h2>
            <ul className="mt-3 space-y-2">
              {foundingLearnerOffer.limitations.map((item) => (
                <li key={item} className="leading-7">{item}</li>
              ))}
            </ul>
          </Card>
        </section>

        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">One-time founding price</p>
            <p className="mt-2 text-5xl font-bold">{formatOfferPrice(foundingLearnerOffer)}</p>
            <p className="mt-2 text-sm text-slate-600">{foundingLearnerOffer.accessMonths} months of access</p>
            <Button className="mt-6 w-full" disabled>
              Stripe Checkout Coming Next
            </Button>
            <a href="/policies" className="mt-4 block text-center text-sm font-medium text-blue-700 hover:text-blue-900">
              Read purchase policies
            </a>
            <div className="mt-6 space-y-3 border-t pt-4">
              {commercePolicies.map((policy) => (
                <p key={policy.slug} className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{policy.title}:</span> {policy.body}
                </p>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Add routes**

Modify `client/src/App.tsx`:

```tsx
import Checkout from "./pages/Checkout";
import Policies from "./pages/Policies";
```

Add these routes before `/404`:

```tsx
<Route path={"/checkout"} component={Checkout} />
<Route path={"/policies"} component={Policies} />
```

- [ ] **Step 4: Update home CTA**

In `client/src/pages/Home.tsx`, change the primary enrollment CTA action from opening `EnrollmentForm` to a link to `/checkout`. Keep the existing modal code in place for now, but do not use it as the primary purchase path.

Replace the hero primary button with:

```tsx
<a href="/checkout">
  <Button
    size="lg"
    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 text-base"
  >
    Review Founding Access <ArrowRight className="ml-2 w-4 h-4" />
  </Button>
</a>
```

Add a policy link near the pricing card:

```tsx
<a href="/policies" className="mt-4 block text-center text-sm font-medium text-blue-300 hover:text-cyan-200">
  Read refund, privacy, terms, and educational limitations
</a>
```

- [ ] **Step 5: Verify**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

Expected: all commands PASS. The analytics environment-variable warnings may still appear during build.

- [ ] **Step 6: Browser verification**

Start dev server and verify:

- `/checkout` shows `$199`, 12 months access, included items, limitations, and policy summaries.
- Checkout button is disabled and says `Stripe Checkout Coming Next`.
- `/policies` shows all four policy sections.
- Home page primary CTA goes to `/checkout`.
- Mobile width around 390 px has no horizontal overflow.

- [ ] **Step 7: Commit**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client/src/pages/Policies.tsx client/src/pages/Checkout.tsx client/src/App.tsx client/src/pages/Home.tsx
& "$gitRoot\cmd\git.exe" commit -m "feat: add commerce readiness pages"
```

## Task 3: Stripe Checkout Server Route

**Files:**
- Modify: `package.json`
- Create: `server/src/services/stripeCheckout.ts`
- Create: `server/src/services/stripeCheckout.test.ts`
- Create: `server/src/routes/checkout.ts`
- Modify: `server/index.ts`

- [ ] **Step 1: Add Stripe dependency**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm add stripe
```

Expected: `package.json` and `pnpm-lock.yaml` update with Stripe.

- [ ] **Step 2: Write failing checkout service tests**

Create `server/src/services/stripeCheckout.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession, getCheckoutConfig } from "./stripeCheckout";

describe("getCheckoutConfig", () => {
  it("fails closed when required Stripe env vars are missing", () => {
    expect(() =>
      getCheckoutConfig({
        STRIPE_SECRET_KEY: "",
        STRIPE_PRICE_FOUNDING_LEARNER: "",
        APP_BASE_URL: "",
      })
    ).toThrow(/Stripe checkout is not configured/);
  });
});

describe("createCheckoutSession", () => {
  it("creates a hosted Checkout Session request without card data", async () => {
    const create = vi.fn().mockResolvedValue({ id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" });
    const stripeClient = { checkout: { sessions: { create } } };

    const session = await createCheckoutSession({
      env: {
        STRIPE_SECRET_KEY: "sk_test_123",
        STRIPE_PRICE_FOUNDING_LEARNER: "price_123",
        APP_BASE_URL: "http://localhost:3000",
      },
      stripeClient,
      purchaserEmail: "learner@example.com",
    });

    expect(session.url).toBe("https://checkout.stripe.com/c/pay/cs_test_123");
    expect(create).toHaveBeenCalledWith({
      mode: "payment",
      line_items: [{ price: "price_123", quantity: 1 }],
      customer_email: "learner@example.com",
      success_url: "http://localhost:3000/learn?checkout=success",
      cancel_url: "http://localhost:3000/checkout?checkout=cancelled",
      metadata: {
        offerId: "founding-learner",
      },
    });
  });
});
```

- [ ] **Step 3: Run test and verify failure**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- server/src/services/stripeCheckout.test.ts
```

Expected: FAIL because `stripeCheckout.ts` does not exist.

- [ ] **Step 4: Implement checkout service**

Create `server/src/services/stripeCheckout.ts`:

```ts
import Stripe from "stripe";

interface CheckoutEnv {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_FOUNDING_LEARNER?: string;
  APP_BASE_URL?: string;
}

interface StripeCheckoutClient {
  checkout: {
    sessions: {
      create(input: {
        mode: "payment";
        line_items: Array<{ price: string; quantity: number }>;
        customer_email?: string;
        success_url: string;
        cancel_url: string;
        metadata: Record<string, string>;
      }): Promise<{ id: string; url: string | null }>;
    };
  };
}

export function getCheckoutConfig(env: CheckoutEnv) {
  const secretKey = env.STRIPE_SECRET_KEY?.trim();
  const priceId = env.STRIPE_PRICE_FOUNDING_LEARNER?.trim();
  const appBaseUrl = env.APP_BASE_URL?.trim();

  if (!secretKey || !priceId || !appBaseUrl) {
    throw new Error("Stripe checkout is not configured. Missing STRIPE_SECRET_KEY, STRIPE_PRICE_FOUNDING_LEARNER, or APP_BASE_URL.");
  }

  return { secretKey, priceId, appBaseUrl };
}

export async function createCheckoutSession({
  env,
  stripeClient,
  purchaserEmail,
}: {
  env: CheckoutEnv;
  stripeClient?: StripeCheckoutClient;
  purchaserEmail?: string;
}) {
  const config = getCheckoutConfig(env);
  const stripe =
    stripeClient ??
    new Stripe(config.secretKey, {
      apiVersion: "2026-02-25.clover",
    });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: config.priceId, quantity: 1 }],
    customer_email: purchaserEmail || undefined,
    success_url: `${config.appBaseUrl}/learn?checkout=success`,
    cancel_url: `${config.appBaseUrl}/checkout?checkout=cancelled`,
    metadata: {
      offerId: "founding-learner",
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return {
    id: session.id,
    url: session.url,
  };
}
```

- [ ] **Step 5: Create route**

Create `server/src/routes/checkout.ts`:

```ts
import type { Router, Request, Response } from "express";
import { createCheckoutSession } from "../services/stripeCheckout";

export function setupCheckoutRoutes(router: Router) {
  router.post("/checkout/sessions", async (req: Request, res: Response) => {
    try {
      const purchaserEmail =
        typeof req.body?.email === "string" ? req.body.email.trim() : undefined;

      const session = await createCheckoutSession({
        env: process.env,
        purchaserEmail,
      });

      res.json(session);
    } catch (error) {
      res.status(503).json({
        error:
          error instanceof Error
            ? error.message
            : "Checkout is unavailable right now.",
      });
    }
  });
}
```

- [ ] **Step 6: Mount API route**

Modify `server/index.ts`:

```ts
import { Router } from "express";
import { setupCheckoutRoutes } from "./src/routes/checkout";
```

Inside `startServer`, before static file serving:

```ts
const apiRouter = Router();
app.use(express.json());
setupCheckoutRoutes(apiRouter);
app.use("/api", apiRouter);
```

- [ ] **Step 7: Run tests and typecheck**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- server/src/services/stripeCheckout.test.ts
& $pnpm check
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add package.json pnpm-lock.yaml server/src/services/stripeCheckout.ts server/src/services/stripeCheckout.test.ts server/src/routes/checkout.ts server/index.ts
& "$gitRoot\cmd\git.exe" commit -m "feat: add stripe checkout session route"
```

## Task 4: Client Checkout Action

**Files:**
- Create: `client/src/lib/checkoutClient.ts`
- Create: `client/src/lib/checkoutClient.test.ts`
- Modify: `client/src/pages/Checkout.tsx`

- [ ] **Step 1: Write failing client tests**

Create `client/src/lib/checkoutClient.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession } from "./checkoutClient";

describe("createCheckoutSession", () => {
  it("returns checkout url on success", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_123" }),
    });

    await expect(
      createCheckoutSession({ email: "learner@example.com", fetcher })
    ).resolves.toEqual({ url: "https://checkout.stripe.com/c/pay/cs_test_123" });
  });

  it("surfaces server errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Checkout unavailable" }),
    });

    await expect(createCheckoutSession({ fetcher })).rejects.toThrow("Checkout unavailable");
  });
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm test -- client/src/lib/checkoutClient.test.ts
```

Expected: FAIL because `checkoutClient.ts` does not exist.

- [ ] **Step 3: Implement client helper**

Create `client/src/lib/checkoutClient.ts`:

```ts
interface CheckoutResponse {
  id?: string;
  url?: string;
  error?: string;
}

type Fetcher = typeof fetch;

export async function createCheckoutSession({
  email,
  fetcher = fetch,
}: {
  email?: string;
  fetcher?: Fetcher;
}): Promise<{ url: string }> {
  const response = await fetcher("/api/checkout/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json()) as CheckoutResponse;

  if (!response.ok) {
    throw new Error(payload.error || "Checkout is unavailable right now.");
  }

  if (!payload.url) {
    throw new Error("Checkout did not return a redirect URL.");
  }

  return { url: payload.url };
}
```

- [ ] **Step 4: Wire checkout page action**

Modify `client/src/pages/Checkout.tsx`:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckoutSession } from "@/lib/checkoutClient";
import { foundingLearnerOffer, formatOfferPrice } from "@shared/commerce/offers";
import { commercePolicies } from "@shared/commerce/policies";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

const checkoutNotEnabledMessage =
  "Checkout is not enabled yet. Add Stripe environment variables before accepting payment.";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession({
        email: email.trim() || undefined,
      });
      window.location.href = url;
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error
          ? checkoutError.message
          : checkoutNotEnabledMessage;
      setError(
        message.includes("Stripe checkout is not configured")
          ? checkoutNotEnabledMessage
          : message
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold text-blue-700">OptiTech Academy</p>
          <h1 className="mt-2 text-4xl font-bold">Founding Learner Access</h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Review what is included before purchase. Payment uses Stripe-hosted Checkout when configured.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-semibold">{foundingLearnerOffer.name}</h2>
            <p className="mt-3 text-slate-700">{foundingLearnerOffer.description}</p>
            <div className="mt-6 grid gap-3">
              {foundingLearnerOffer.includes.map((item) => (
                <div key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <ShieldCheck className="h-5 w-5" />
              Important limitations
            </h2>
            <ul className="mt-3 space-y-2">
              {foundingLearnerOffer.limitations.map((item) => (
                <li key={item} className="leading-7">{item}</li>
              ))}
            </ul>
          </Card>
        </section>

        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">One-time founding price</p>
            <p className="mt-2 text-5xl font-bold">{formatOfferPrice(foundingLearnerOffer)}</p>
            <p className="mt-2 text-sm text-slate-600">{foundingLearnerOffer.accessMonths} months of access</p>

            <label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="checkout-email">
              Email for receipt and access
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            {error && (
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {error}
              </p>
            )}

            <Button className="mt-6 w-full" onClick={startCheckout} disabled={isSubmitting}>
              {isSubmitting ? "Opening Stripe..." : "Continue to Stripe Checkout"}
            </Button>

            <a href="/policies" className="mt-4 block text-center text-sm font-medium text-blue-700 hover:text-blue-900">
              Read purchase policies
            </a>
            <div className="mt-6 space-y-3 border-t pt-4">
              {commercePolicies.map((policy) => (
                <p key={policy.slug} className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{policy.title}:</span> {policy.body}
                </p>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run verification**

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

Expected: PASS. Without Stripe env vars, browser checkout button should show the setup error and must not redirect.

- [ ] **Step 6: Commit**

```powershell
$gitRoot='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git'
$env:PATH="$gitRoot\mingw64\bin;$gitRoot\cmd;$env:PATH"
$env:GIT_EXEC_PATH="$gitRoot\mingw64\bin"
& "$gitRoot\cmd\git.exe" add client/src/lib/checkoutClient.ts client/src/lib/checkoutClient.test.ts client/src/pages/Checkout.tsx
& "$gitRoot\cmd\git.exe" commit -m "feat: wire checkout client flow"
```

## Final Verification Gate

Run:

```powershell
$nodeDir='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$env:PATH="$nodeDir;$env:PATH"
$pnpm='C:\Users\dexam11\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd'
& $pnpm check
& $pnpm test
& $pnpm build
```

All three commands must pass.

Browser verification must prove:

- `/checkout` renders offer details and policy summaries.
- `/policies` renders all policy sections.
- Home CTA reaches `/checkout`.
- Checkout without Stripe env vars fails closed with a clear setup message.
- No payment card field appears anywhere in this app.
- Mobile width around 390 px has no horizontal overflow.

## Self-Review Notes

- Spec coverage: This plan advances the commercial model from the product spec by adding purchase offer truthfulness, policy visibility, and hosted Stripe Checkout. It does not build auth, durable enrollment, practice seats, or webhook fulfillment; those need the next plan after checkout session creation is stable.
- Exactness scan: Created files include concrete code. Tasks include exact commands and expected outcomes. The plan avoids empty future work and keeps checkout disabled or fail-closed until Stripe env vars exist.
- Stripe alignment: Uses Checkout Sessions for one-time payment, does not store card data, does not use deprecated Charges, Sources, Tokens, or Card Element APIs.
