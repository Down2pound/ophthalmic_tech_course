import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import {
  formatOfferPrice,
  foundingLearnerOffer,
} from "@shared/commerce/offers";
import { commercePolicies } from "@shared/commerce/policies";
import { useState } from "react";
import { createCheckoutSession } from "@/lib/checkoutClient";
import { getCheckoutStatus } from "@/lib/checkoutStatus";

const policySummary = commercePolicies.slice(0, 3);

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const checkoutStatus =
    typeof window === "undefined"
      ? null
      : getCheckoutStatus(window.location.search);

  const startCheckout = async () => {
    setIsStartingCheckout(true);
    setCheckoutError(null);

    try {
      const { url } = await createCheckoutSession({
        email: email.trim() || undefined,
      });

      window.location.href = url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Checkout could not start. Please try again."
      );
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to course home
            </a>
            <p className="mt-5 text-sm font-semibold text-blue-700">
              OptiTech Academy enrollment
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {foundingLearnerOffer.name}
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              {foundingLearnerOffer.description}
            </p>
          </div>
          <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">
            Draft checkout preview
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          {checkoutStatus && (
            <Card
              className={`border p-5 shadow-sm ${
                checkoutStatus.tone === "success"
                  ? "border-green-200 bg-green-50 text-green-950"
                  : "border-blue-200 bg-blue-50 text-blue-950"
              }`}
            >
              <h2 className="text-xl font-bold">{checkoutStatus.title}</h2>
              <p className="mt-2 leading-7">{checkoutStatus.message}</p>
              {checkoutStatus.tone === "success" && (
                <a
                  href="/learn"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"
                >
                  Start Module 1
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </Card>
          )}

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-blue-700" />
              <h2 className="text-2xl font-bold">What is included</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {foundingLearnerOffer.includes.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-bold">Clear expectations</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {foundingLearnerOffer.limitations.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">Before you enroll</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {policySummary.map((policy) => (
                <section
                  key={policy.slug}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{policy.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {policy.body}
                  </p>
                </section>
              ))}
            </div>
            <a
              href="/policies"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Read all course policies
              <ArrowRight className="h-4 w-4" />
            </a>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">
              One-time founding learner price
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold">
                {formatOfferPrice(foundingLearnerOffer)}
              </span>
              <span className="pb-2 text-slate-500">USD</span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4 text-blue-700" />
              {foundingLearnerOffer.accessMonths} months of access
            </div>
            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Email for receipt and access
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="learner@example.com"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
            />
            {checkoutError && (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {checkoutError}
              </p>
            )}
            <Button
              className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
              disabled={isStartingCheckout}
              onClick={startCheckout}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isStartingCheckout ? "Starting checkout..." : "Continue to Stripe"}
            </Button>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Payment details are handled securely by Stripe Checkout, not by
              this app.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
