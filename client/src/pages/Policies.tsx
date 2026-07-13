import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createMailtoHref } from "@shared/commerce/offers";
import {
  buyerSupportContact,
  commercePolicies,
} from "@shared/commerce/policies";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";

const supportHref = createMailtoHref({
  email: buyerSupportContact.email,
  subject: buyerSupportContact.subject,
  body: buyerSupportContact.emailBody,
});

export default function Policies() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to checkout
          </a>
          <div className="mt-6 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                OptiTech Academy
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Course Policies
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            These learner-facing summaries keep the offer honest and easy to
            understand before checkout. They should be reviewed before launch
            because policies are business rules, not just website copy.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-8">
        {commercePolicies.map((policy) => (
          <Card
            key={policy.slug}
            className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {policy.slug.replaceAll("-", " ")}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{policy.title}</h2>
            <p className="mt-4 leading-7 text-slate-700">{policy.body}</p>
          </Card>
        ))}

        <Card className="border-blue-100 bg-blue-50 p-6 text-blue-950 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-700" />
            <h2 className="text-2xl font-bold">Support Contact</h2>
          </div>
          <p className="mt-3 leading-7">{buyerSupportContact.expectedUse}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <section className="rounded-md border border-blue-100 bg-white p-4">
              <h3 className="font-semibold">Helpful details to include</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {buyerSupportContact.safeDetails.map(detail => (
                  <li key={detail}>- {detail}</li>
                ))}
              </ul>
            </section>
            <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-amber-700" />
                Never send
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {buyerSupportContact.neverSend.map(detail => (
                  <li key={detail}>- {detail}</li>
                ))}
              </ul>
            </section>
          </div>
          <a href={supportHref}>
            <Button className="mt-5 bg-blue-700 text-white hover:bg-blue-800">
              Email support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </Card>

        <div className="flex flex-col gap-3 rounded-md border border-blue-100 bg-blue-50 p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-blue-950">
            Ready to review the founding learner offer?
          </p>
          <a href="/checkout">
            <Button className="w-full bg-blue-700 text-white hover:bg-blue-800 md:w-auto">
              Return to checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
