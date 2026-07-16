import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  GraduationCap,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  formatOfferPrice,
  foundingLearnerOffer,
  createMailtoHref,
} from "@shared/commerce/offers";
import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";
import {
  buyerSupportContact,
  commercePolicies,
} from "@shared/commerce/policies";
import {
  foundingReleaseStatus,
  individualLearnerSalesPath,
  individualLearnerStartSteps,
  learnerValueProofPoints,
  purchaseAssurances,
} from "@shared/commerce/salesReadiness";
import { useState } from "react";
import {
  createCheckoutSession,
  fetchCheckoutAvailability,
  type CheckoutAvailabilityReport,
} from "@/lib/checkoutClient";
import { getCheckoutStatus } from "@/lib/checkoutStatus";
import { submitLearnerInterest } from "@/lib/learnerInterestClient";
import { useEffect } from "react";

const emptyLearnerInterestForm = {
  learnerName: "",
  email: "",
  background: "",
  goal: "",
};

const policySummary = commercePolicies;
const supportHref = createMailtoHref({
  email: buyerSupportContact.email,
  subject: buyerSupportContact.subject,
  body: buyerSupportContact.emailBody,
});

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutAvailability, setCheckoutAvailability] =
    useState<CheckoutAvailabilityReport | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [learnerInterestForm, setLearnerInterestForm] = useState(
    emptyLearnerInterestForm
  );
  const [learnerInterestStatus, setLearnerInterestStatus] = useState<
    "idle" | "submitting" | "sent"
  >("idle");
  const [learnerInterestMessage, setLearnerInterestMessage] = useState<
    string | null
  >(null);
  const checkoutStatus =
    typeof window === "undefined"
      ? null
      : getCheckoutStatus(window.location.search);
  const normalizedEmail = normalizeCheckoutEmail(email);
  const emailHasText = email.trim().length > 0;
  const showEmailValidation = emailHasText && !normalizedEmail;
  const checkoutUnavailable = checkoutAvailability?.ready === false;

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

  const startCheckout = async () => {
    setIsStartingCheckout(true);
    setCheckoutError(null);

    try {
      const { url } = await createCheckoutSession({
        email,
        acceptedTerms,
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

  const updateLearnerInterestField = (
    field: keyof typeof emptyLearnerInterestForm,
    value: string
  ) => {
    setLearnerInterestForm(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLearnerInterestSubmit = async () => {
    setLearnerInterestStatus("submitting");
    setLearnerInterestMessage(null);

    try {
      const result = await submitLearnerInterest({
        interest: learnerInterestForm,
      });

      setLearnerInterestStatus("sent");
      setLearnerInterestForm(emptyLearnerInterestForm);
      setLearnerInterestMessage(
        result.notificationSent
          ? "You're on the founding learner interest list. Jeff has been notified."
          : "You're on the founding learner interest list. Jeff can review it from the protected lead dashboard."
      );
    } catch (error) {
      setLearnerInterestStatus("idle");
      setLearnerInterestMessage(
        error instanceof Error
          ? error.message
          : "Learner interest could not be sent."
      );
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
          <div className="rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-900">
            {checkoutAvailability?.ready === false
              ? "Interest list open"
              : "Secure Stripe checkout"}
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
              <ul className="mt-3 space-y-1 text-sm leading-6">
                {checkoutStatus.nextSteps.map(step => (
                  <li key={step} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
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

          {checkoutAvailability && (
            <Card
              className={`border p-5 shadow-sm ${
                checkoutAvailability.ready
                  ? "border-green-200 bg-green-50 text-green-950"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              <h2 className="text-xl font-bold">
                {checkoutAvailability.title}
              </h2>
              <p className="mt-2 leading-7">{checkoutAvailability.message}</p>
              {!checkoutAvailability.ready && (
                <a
                  href="#learner-interest"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-950"
                >
                  Join the founding learner list
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
              {foundingLearnerOffer.includes.map(item => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-blue-100 bg-blue-50 p-6 text-blue-950 shadow-sm">
            <h2 className="text-2xl font-bold">Founding release status</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {foundingReleaseStatus.map(item => (
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

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">Is this a good fit?</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {individualLearnerSalesPath.map(section => (
                <section
                  key={section.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {section.items.map(item => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">
              Why learners choose founding access
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {learnerValueProofPoints.map(point => (
                <section
                  key={point.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {point.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">How you start after purchase</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {individualLearnerStartSteps.map((step, index) => (
                <section
                  key={step.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-blue-700">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-bold">Clear expectations</h2>
            </div>
            <ul className="mt-5 space-y-3">
              {foundingLearnerOffer.limitations.map(item => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-blue-100 bg-blue-50 p-6 text-blue-950 shadow-sm">
            <h2 className="text-2xl font-bold">Purchase confidence</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {purchaseAssurances.map(item => (
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

          <Card
            id="learner-interest"
            className="border-green-200 bg-green-50 p-6 text-green-950 shadow-sm"
          >
            <h2 className="text-2xl font-bold">Not ready to buy today?</h2>
            <p className="mt-3 leading-7">
              Join the founding learner interest list so we can follow up when
              enrollment is ready or help you decide whether the course fits
              your goal.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-semibold text-green-950">
                Name
                <input
                  value={learnerInterestForm.learnerName}
                  onChange={event =>
                    updateLearnerInterestField(
                      "learnerName",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-green-200 px-3 py-2 font-normal text-slate-950 outline-none ring-green-600 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-green-950">
                Email
                <input
                  type="email"
                  value={learnerInterestForm.email}
                  onChange={event =>
                    updateLearnerInterestField("email", event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-green-200 px-3 py-2 font-normal text-slate-950 outline-none ring-green-600 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-green-950">
                Background
                <select
                  value={learnerInterestForm.background}
                  onChange={event =>
                    updateLearnerInterestField("background", event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-green-200 px-3 py-2 font-normal text-slate-950 outline-none ring-green-600 focus:ring-2"
                >
                  <option value="">Choose one</option>
                  <option value="career-changer">Career changer</option>
                  <option value="medical-assistant">Medical assistant</option>
                  <option value="new-ophthalmic-tech">
                    New ophthalmic technician
                  </option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block text-sm font-semibold text-green-950 md:col-span-2">
                What do you want this course to help you do?
                <textarea
                  value={learnerInterestForm.goal}
                  onChange={event =>
                    updateLearnerInterestField("goal", event.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full resize-y rounded-md border border-green-200 px-3 py-2 font-normal text-slate-950 outline-none ring-green-600 focus:ring-2"
                />
              </label>
            </div>
            {learnerInterestMessage && (
              <p
                className={`mt-4 rounded-md border p-3 text-sm leading-6 ${
                  learnerInterestStatus === "sent"
                    ? "border-green-300 bg-white text-green-950"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {learnerInterestMessage}
              </p>
            )}
            <Button
              className="mt-5 bg-green-700 text-white hover:bg-green-800"
              disabled={learnerInterestStatus === "submitting"}
              onClick={handleLearnerInterestSubmit}
            >
              {learnerInterestStatus === "submitting"
                ? "Joining list..."
                : "Join interest list"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">Before you enroll</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {policySummary.map(policy => (
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
              required
              aria-invalid={showEmailValidation}
              aria-describedby="checkout-email-help"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="learner@example.com"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
            />
            <p
              id="checkout-email-help"
              className={`mt-2 text-sm leading-5 ${
                showEmailValidation ? "text-red-700" : "text-slate-500"
              }`}
            >
              {showEmailValidation
                ? "Enter a valid email like learner@example.com."
                : "We use this email for your receipt and course access."}
            </p>
            {checkoutError && (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {checkoutError}
              </p>
            )}
            <label className="mt-4 flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={event => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 flex-shrink-0"
              />
              <span>
                I reviewed the refund policy, privacy expectations, course
                limits, and support terms. I understand this is education, not
                certification, employment, or hands-on competency verification.
              </span>
            </label>
            <Button
              className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
              disabled={
                isStartingCheckout ||
                !normalizedEmail ||
                !acceptedTerms ||
                checkoutUnavailable
              }
              onClick={startCheckout}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isStartingCheckout
                ? "Starting checkout..."
                : checkoutUnavailable
                  ? "Enrollment not open yet"
                  : "Continue to Stripe"}
            </Button>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Payment details are handled securely by Stripe Checkout, not by
              this app.
            </p>
            <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-700">
              <p className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                Access opens only after Stripe confirms payment.
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                The course is education, not certification or employment
                verification.
              </p>
              <p className="flex gap-2">
                <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                Buying for a team? Practice seat packs are available.
              </p>
            </div>
            <a
              href="/practice-packs"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View practice packs
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={supportHref}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <Mail className="h-4 w-4" />
              Need checkout help?
            </a>
          </Card>
        </aside>
      </div>
    </main>
  );
}
