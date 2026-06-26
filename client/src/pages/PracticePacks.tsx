import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  formatOfferPrice,
  practicePackOffers,
} from "@shared/commerce/offers";

export default function PracticePacks() {
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
          <div className="mt-6 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Practice onboarding
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Train new ophthalmic team members with a shared foundation
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            Practice packs help managers give new hires the same vocabulary,
            safety expectations, and supervisor-ready Skills Passport while
            keeping hands-on verification inside the clinic where it belongs.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <section className="grid gap-5 md:grid-cols-2">
          {practicePackOffers.map((offer) => (
            <Card
              key={offer.id}
              className="flex flex-col border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    {offer.seatCount} learner seats
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{offer.name}</h2>
                </div>
                <Users className="h-8 w-8 flex-shrink-0 text-blue-700" />
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {offer.description}
              </p>
              <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
                {offer.idealFor}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">
                  {formatOfferPrice(offer)}
                </span>
                <span className="ml-2 text-slate-500">one-time</span>
              </div>

              <section className="mt-6">
                <h3 className="font-semibold">Included</h3>
                <ul className="mt-3 space-y-2">
                  {offer.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  Clear limits
                </h3>
                <ul className="mt-3 space-y-2">
                  {offer.limitations.map((item) => (
                    <li key={item} className="text-sm leading-6 text-slate-700">
                      - {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Card>
          ))}
        </section>

        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">Employer purchase path</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Practice packs should launch with a short consultation or invoice
              workflow so seat setup, supervisor expectations, and refund terms
              are confirmed before payment.
            </p>
            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              <p>- Confirm number of learner seats.</p>
              <p>- Identify the practice lead or supervisor.</p>
              <p>- Align Skills Passport use with local policy.</p>
              <p>- Keep practice-specific workflows out of the national core.</p>
            </div>
            <a href="mailto:jeff.chapin@spindeleye.com?subject=OptiTech%20practice%20pack%20interest">
              <Button className="mt-6 w-full bg-blue-700 text-white hover:bg-blue-800">
                Start employer conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a
              href="/policies"
              className="mt-4 block text-center text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Review course policies
            </a>
          </Card>
        </aside>
      </div>
    </main>
  );
}
