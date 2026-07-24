import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  formatOfferPrice,
  foundingLearnerOffer,
  practicePackOffers,
} from "@shared/commerce/offers";
import {
  buyerConfidenceAnswers,
  foundingReleaseStatus,
  purchaseAssurances,
} from "@shared/commerce/salesReadiness";
import {
  fetchCheckoutAvailability,
  type CheckoutAvailabilityReport,
} from "@/lib/checkoutClient";
import { useEffect, useState } from "react";

const firstBuyerTracks = [
  {
    href: "/checkout",
    icon: GraduationCap,
    label: "Individual learner",
    title: "Start learning ophthalmic foundations",
    description:
      "For career changers, medical assistants, and new technicians who want clearer eye-care vocabulary and a practical first-month study path.",
    price: formatOfferPrice(foundingLearnerOffer),
    priceNote: "one-time founding access",
    cta: "Buy for myself",
  },
  {
    href: "/practice-packs",
    icon: Building2,
    label: "Practice team",
    title: "Give new hires the same starting point",
    description:
      "For managers and supervisors who want a shared onboarding foundation before local protocol training and hands-on signoff.",
    price: formatOfferPrice(practicePackOffers[0]),
    priceNote: `starts at ${practicePackOffers[0].seatCount} seats`,
    cta: "Buy for my practice",
  },
] as const;

const quickProof = [
  "Built from ophthalmic bootcamp source material.",
  "Designed for beginners entering eye care.",
  "Useful for medical assistants broadening clinical knowledge.",
  "Clear that completion is education, not certification.",
] as const;

export default function FirstSale() {
  const [checkoutAvailability, setCheckoutAvailability] =
    useState<CheckoutAvailabilityReport | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchCheckoutAvailability()
      .then(availability => {
        if (!isMounted) return;
        setCheckoutAvailability(availability);
      })
      .catch(() => {
        if (!isMounted) return;
        setCheckoutAvailability(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const checkoutReady = checkoutAvailability?.ready === true;
  const statusTitle = checkoutAvailability
    ? checkoutAvailability.title
    : "Checking enrollment status";
  const statusMessage = checkoutAvailability
    ? checkoutAvailability.message
    : "The page is checking whether Stripe checkout or the interest-list path is currently available.";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course home
          </a>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Founding access
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-normal md:text-5xl">
                Ophthalmic technician foundations for new learners and practice
                onboarding
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                A practical starting point for people who want to understand eye
                care, clinic language, and the habits expected of new
                ophthalmic team members.
              </p>
            </div>

            <Card
              className={`border p-5 shadow-sm ${
                checkoutReady
                  ? "border-green-200 bg-green-50 text-green-950"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              <div className="flex items-start gap-3">
                {checkoutReady ? (
                  <CreditCard className="mt-1 h-6 w-6 text-green-700" />
                ) : (
                  <Mail className="mt-1 h-6 w-6 text-amber-700" />
                )}
                <div>
                  <h2 className="text-xl font-bold">{statusTitle}</h2>
                  <p className="mt-2 text-sm leading-6">{statusMessage}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        {firstBuyerTracks.map(track => (
          <Card
            key={track.href}
            className="flex flex-col border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  {track.label}
                </p>
                <h2 className="mt-2 text-2xl font-bold">{track.title}</h2>
              </div>
              <track.icon className="h-9 w-9 flex-shrink-0 text-blue-700" />
            </div>
            <p className="mt-4 leading-7 text-slate-600">
              {track.description}
            </p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-bold">{track.price}</span>
              <span className="pb-1 text-sm text-slate-500">
                {track.priceNote}
              </span>
            </div>
            <a href={track.href} className="mt-6">
              <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                {track.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 lg:grid-cols-[1fr_360px]">
        <Card className="border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-700" />
            <h2 className="text-2xl font-bold">Why this is useful now</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {quickProof.map(item => (
              <div
                key={item}
                className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-6 w-6 text-amber-700" />
            <div>
              <h2 className="text-xl font-bold">Honest limits</h2>
              <p className="mt-3 text-sm leading-6">
                Course completion does not replace certification, employment
                decisions, local protocols, or supervised hands-on competency
                signoff.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Founding release
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                What buyers can expect
              </h2>
            </div>
            <a
              href="/preview"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Preview a lesson
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {foundingReleaseStatus.map(item => (
              <section
                key={item.title}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-700" />
            <h2 className="text-2xl font-bold">Common buyer questions</h2>
          </div>
          <div className="mt-5 space-y-4">
            {buyerConfidenceAnswers.slice(0, 3).map(answer => (
              <section
                key={answer.question}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="font-semibold">{answer.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {answer.answer}
                </p>
              </section>
            ))}
          </div>
        </Card>

        <Card className="border-blue-100 bg-blue-50 p-6 text-blue-950 shadow-sm">
          <h2 className="text-2xl font-bold">Purchase confidence</h2>
          <div className="mt-5 space-y-4">
            {purchaseAssurances.slice(0, 3).map(item => (
              <section
                key={item.title}
                className="rounded-md border border-blue-100 bg-white p-4"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </Card>
      </section>

      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Ready to choose the right path?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Start with individual access, practice packs, or the free preview
              before making a decision.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href="/checkout">
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-200">
                Individual
              </Button>
            </a>
            <a href="/practice-packs">
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Practice
              </Button>
            </a>
            <a href="/preview">
              <Button className="w-full border border-white/30 bg-transparent text-white hover:bg-white/10">
                Preview
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
