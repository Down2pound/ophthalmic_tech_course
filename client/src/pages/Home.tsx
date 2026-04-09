import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Users, Award, ArrowRight, Eye } from "lucide-react";
import { useState } from "react";
import { EnrollmentForm } from "@/components/EnrollmentForm";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  const curriculumDays = [
    {
      day: "Day 1",
      title: "Foundations & Patient Intake",
      description: "Core roles, clinic workflow, patient history taking, and visual acuity testing.",
      icon: "📋",
    },
    {
      day: "Day 2",
      title: "Slit Lamp Biomicroscopy",
      description: "Master the essential diagnostic tool for anterior segment examination.",
      icon: "🔬",
    },
    {
      day: "Day 3",
      title: "Tonometry & IOP",
      description: "Learn intraocular pressure measurement techniques and equipment operation.",
      icon: "📊",
    },
    {
      day: "Day 4",
      title: "Refraction Principles",
      description: "Manual refraction, lensometry, and refractive index determination.",
      icon: "👓",
    },
    {
      day: "Day 5",
      title: "Advanced Diagnostics",
      description: "Visual field testing and OCT imaging for comprehensive eye assessment.",
      icon: "🎯",
    },
    {
      day: "Day 6",
      title: "Specialized Populations",
      description: "Pediatric, geriatric, and post-operative cataract patient management.",
      icon: "👥",
    },
    {
      day: "Day 7",
      title: "Maintenance & Certification",
      description: "Equipment care, maintenance, and professional development preparation.",
      icon: "⚙️",
    },
    {
      day: "Day 8",
      title: "Patient Communication & Soft Skills",
      description: "Managing difficult patients, building rapport, and professional communication best practices.",
      icon: "💬",
    },
    {
      day: "Day 9",
      title: "Clinical Documentation & EHR",
      description: "Medical record accuracy, HIPAA compliance, and electronic health records proficiency.",
      icon: "📝",
    },
    {
      day: "Day 10",
      title: "Professional Development & Career Pathways",
      description: "Continuing education, professional development, and advancement opportunities in ophthalmology.",
      icon: "🎓",
    },
  ];

  const pricingTiers = [
    {
      id: "basic",
      name: "Basic",
      price: "$197",
      description: "Perfect for individual technicians starting their career",
      features: [
        "Full course videos (10 days)",
        "Downloadable worksheets & checklists",
        "Lifetime access to materials",
        "Email support",
      ],
      cta: "Enroll Now",
      highlighted: false,
    },
    {
      id: "standard",
      name: "Standard",
      price: "$699",
      description: "Comprehensive learning with community support",
      features: [
        "Everything in Basic",
        "Live Q&A sessions (weekly)",
        "Private community access",
        "Downloadable study guides",
        "Certificate of completion",
        "Priority email support",
      ],
      cta: "Enroll Now",
      highlighted: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$2,000+",
      description: "Elite program with personalized coaching",
      features: [
        "Everything in Standard",
        "1-on-1 coaching sessions (4 sessions)",
        "Personalized learning plan",
        "Advanced modules (B-scan, Pentacam, surgical assisting)",
        "Job placement assistance",
        "Lifetime mentorship access",
      ],
      cta: "Schedule Consultation",
      highlighted: false,
    },
  ];

  const stats = [
    { number: "65,000+", label: "Technicians in the US" },
    { number: "16%", label: "Job Growth by 2032" },
    { number: "7 Days", label: "Intensive Training" },
    { number: "86%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">OptiTech Academy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#curriculum" className="text-sm text-gray-600 hover:text-blue-600">
              Curriculum
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-blue-600">
              Pricing
            </a>
            <a href="#why" className="text-sm text-gray-600 hover:text-blue-600">
              Why Us
            </a>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Launch Your Career in 10 Days
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Become a Clinic-Ready Ophthalmic Technician
              </h1>
              <p className="text-xl text-gray-600">
                Master essential clinical skills in our intensive 10-day bootcamp. Join thousands of healthcare professionals transforming their careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setSelectedTier("standard");
                  setShowEnrollmentForm(true);
                }}
              >
                Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Limited spots available this month</span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663028372668/H5oPCvuaL4V8cbWP559r9W/hero-ophthalmic-JL5fgAFccP4oWiE968bQNk.webp"
                alt="Ophthalmic clinic with advanced equipment"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose OptiTech Academy?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bridge the critical gap between entry-level training and clinic readiness with industry-leading expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Intensive & Efficient",
                description: "Complete your training in just 7 days without compromising quality or depth.",
              },
              {
                icon: <Award className="w-8 h-8 text-blue-600" />,
                title: "Industry-Aligned Curriculum",
                description: "Comprehensive training covering essential ophthalmic technician competencies recognized across the industry.",
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Expert Instructors",
                description: "Learn from practicing ophthalmic professionals with 15+ years of clinical experience.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">7-Day Intensive Curriculum</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the essential skills needed to excel in any ophthalmic practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumDays.map((day, idx) => (
              <Card key={idx} className="p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{day.icon}</div>
                <div className="text-sm font-semibold text-blue-600 mb-2">{day.day}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{day.title}</h3>
                <p className="text-gray-600 text-sm">{day.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your goals and budget. All plans include lifetime access to course materials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative p-8 border-2 transition-all ${
                  tier.highlighted
                    ? "border-blue-600 shadow-2xl scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>
                <Button
                  className={`w-full mb-8 ${
                    tier.highlighted
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                  onClick={() => {
                    setSelectedTier(tier.id);
                    setShowEnrollmentForm(true);
                  }}
                >
                  {tier.cta}
                </Button>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">A Growing Opportunity</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>65,000+ technicians</strong> currently employed in the US
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>16% job growth</strong> projected through 2032
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>25% annual turnover</strong> creating constant demand for new talent
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>$44,000+ median salary</strong> with growth potential
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <h3 className="text-2xl font-bold mb-6">For Practice Managers</h3>
              <p className="mb-6">
                Struggling to find and train qualified technicians? Our B2B program provides affordable, scalable training for your entire team.
              </p>
              <Button
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => {
              setSelectedTier("premium");
              setShowEnrollmentForm(true);
            }}
          >
            Learn About Team Licensing
          </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Ophthalmic Technician",
                text: "This course gave me the confidence to work in a busy clinic. The 7-day format was perfect for my schedule.",
              },
              {
                name: "Marcus Johnson",
                role: "Practice Manager",
                text: "We enrolled our entire team and saw immediate improvements in patient care and clinic efficiency.",
              },
              {
                name: "Emily Rodriguez",
                role: "Career Changer",
                text: "Coming from a different healthcare background, this bootcamp made the transition seamless and professional.",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the next cohort and become clinic-ready in just 7 days. Limited spots available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => {
                setSelectedTier("standard");
                setShowEnrollmentForm(true);
              }}
            >
              Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">OptiTech Academy</span>
              </div>
              <p className="text-sm">Bridging the gap between training and clinic readiness.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Program</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#curriculum" className="hover:text-blue-400">
                    Curriculum
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 OptiTech Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && selectedTier && (
        <EnrollmentForm
          tier={selectedTier}
          onClose={() => setShowEnrollmentForm(false)}
        />
      )}
    </div>
  );
}
