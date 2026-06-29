import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";

export default function EnrollmentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <Card className="glass-card border-blue-500/40 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-cyan-400" />
          <h1 className="mb-4 text-4xl font-bold text-white">Enrollment Started</h1>
          <p className="mx-auto mb-6 max-w-xl text-lg text-gray-300">
            Your subscription checkout was completed. Watch your inbox for course access details, onboarding steps, and your receipt.
          </p>
          <div className="mb-8 flex items-center justify-center gap-2 text-sm text-blue-200">
            <Mail className="h-4 w-4" />
            <span>Course access is delivered to the email used at checkout.</span>
          </div>
          <a href="/curriculum">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600">
              Preview Curriculum <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
}
