import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen, Video, FileText, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function Curriculum() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const curriculumDays = [
    {
      day: 1,
      title: "Ophthalmic Foundations & Patient Communication",
      description: "Understand eye anatomy, master patient history taking, and develop empathic communication skills.",
      objectives: [
        "Understand the anatomy and physiology of the eye",
        "Master patient history taking techniques",
        "Develop active listening and empathic communication skills",
        "Learn the EMPATHY framework for patient interactions",
      ],
      topics: [
        "Ocular anatomy overview",
        "Common chief complaints and differential diagnosis",
        "History taking protocols",
        "Nonverbal communication essentials",
        "Managing difficult patients",
        "Dementia and elderly patient considerations",
      ],
      assets: ["Audio Overview", "Video Overview", "Flashcards"],
      icon: "👁️",
    },
    {
      day: 2,
      title: "Refraction & Lensometry",
      description: "Master manual and automated lensometry techniques and refraction principles.",
      objectives: [
        "Master manual and automated lensometry techniques",
        "Understand refraction principles",
        "Perform accurate lens power measurements",
        "Identify lens defects and materials",
      ],
      topics: [
        "Lensometry fundamentals (manual and automated)",
        "Spherocylinder lens reading",
        "Plus and minus cylinder notation",
        "Bifocal and progressive lens measurement",
        "Lens materials identification",
        "Phoroptor maintenance and calibration",
      ],
      assets: ["Video Overview", "Infographic", "Flashcards", "Data Table"],
      icon: "👓",
    },
    {
      day: 3,
      title: "Tonometry & Intraocular Pressure Measurement",
      description: "Master Goldmann Applanation Tonometry and IOP measurement principles.",
      objectives: [
        "Master Goldmann Applanation Tonometry (GAT)",
        "Understand IOP measurement principles",
        "Perform accurate tonometry procedures",
        "Troubleshoot common tonometry errors",
      ],
      topics: [
        "Tonometry types and principles",
        "Goldmann Applanation Tonometer operation",
        "Calibration and maintenance",
        "Patient positioning and technique",
        "Anxiety management during tonometry",
        "IOP interpretation and normal ranges",
      ],
      assets: ["Video Overview", "Slide Deck", "Flashcards", "Quiz"],
      icon: "📊",
    },
    {
      day: 4,
      title: "Slit Lamp Examination & Anterior Segment Imaging",
      description: "Perform comprehensive slit lamp examinations and master anterior segment evaluation.",
      objectives: [
        "Perform comprehensive slit lamp examinations",
        "Master anterior segment evaluation",
        "Understand imaging modalities",
        "Identify common anterior segment pathology",
      ],
      topics: [
        "Slit lamp anatomy and operation",
        "Anterior segment examination techniques",
        "Corneal assessment",
        "Lens evaluation and cataract grading",
        "Anterior chamber depth assessment",
        "Slit lamp maintenance and troubleshooting",
      ],
      assets: ["Video Overview", "Slide Deck", "Infographic", "Flashcards"],
      icon: "🔬",
    },
    {
      day: 5,
      title: "Retinal Imaging & OCT Interpretation",
      description: "Master retinal imaging techniques and OCT scan interpretation.",
      objectives: [
        "Master retinal imaging techniques (Optos, OCT)",
        "Understand ultra-widefield imaging",
        "Interpret OCT scans accurately",
        "Recognize common retinal pathology",
      ],
      topics: [
        "Optomap retinal imaging principles",
        "Ultra-widefield (UWF) imaging advantages",
        "OCT fundamentals and image acquisition",
        "Macular OCT interpretation",
        "Optic nerve head assessment",
        "Common retinal findings (AMD, DR, RVO)",
        "Peripheral retinal lesion detection",
      ],
      assets: ["Video Overview", "Slide Deck", "Infographic", "Data Table"],
      icon: "🎯",
    },
    {
      day: 6,
      title: "Visual Field Testing & Interpretation",
      description: "Perform and interpret visual field tests accurately.",
      objectives: [
        "Perform confrontation visual field testing",
        "Understand automated visual field testing",
        "Interpret visual field results",
        "Identify common VF defects",
      ],
      topics: [
        "Confrontation visual field techniques",
        "Automated perimetry principles",
        "Visual field defect patterns",
        "False positives and negatives",
        "VF progression analysis",
        "Common VF patterns (glaucoma, neurological, retinal)",
      ],
      assets: ["Video Overview", "Slide Deck", "Infographic", "Quiz"],
      icon: "👁️",
    },
    {
      day: 7,
      title: "Advanced Imaging & Specialized Procedures",
      description: "Master B-scan ultrasonography, Pentacam imaging, and surgical assisting.",
      objectives: [
        "Master B-scan ultrasonography",
        "Understand Pentacam imaging",
        "Learn surgical assisting fundamentals",
        "Prepare for advanced clinical scenarios",
      ],
      topics: [
        "B-scan ultrasound principles and technique",
        "Pentacam corneal topography",
        "Anterior segment OCT",
        "Surgical assisting basics",
        "Instrument handling and sterilization",
        "Operating room protocols",
      ],
      assets: ["Video Overview", "Slide Deck", "Infographic", "Flashcards"],
      icon: "🏥",
    },
    {
      day: 8,
      title: "Patient Communication & Soft Skills",
      description: "Master therapeutic communication and conflict resolution techniques.",
      objectives: [
        "Master therapeutic communication techniques",
        "Develop conflict resolution skills",
        "Build patient rapport and trust",
        "Manage challenging patient interactions",
      ],
      topics: [
        "Active and reflective listening",
        "Empathic expression and validation",
        "Breaking bad news (SPIKES protocol)",
        "Shared decision-making",
        "Cultural competency in healthcare",
        "Compassion fatigue prevention",
        "Bedside manner excellence",
      ],
      assets: ["Audio Overview", "Video Overview", "Slide Deck", "Flashcards", "Quiz"],
      icon: "💬",
    },
    {
      day: 9,
      title: "Clinical Documentation & EHR Proficiency",
      description: "Master medical record documentation and EHR systems.",
      objectives: [
        "Master medical record documentation",
        "Understand HIPAA compliance",
        "Develop EHR proficiency",
        "Learn proper medical scribing",
      ],
      topics: [
        "Medical record fundamentals",
        "HIPAA privacy and security",
        "Electronic health record systems",
        "Proper documentation standards",
        "Chief complaint and history documentation",
        "Pertinent positives and negatives",
        "Medical scribing best practices",
        "Accuracy and compliance",
      ],
      assets: ["Slide Deck", "Infographic", "Data Table", "Flashcards", "Quiz"],
      icon: "📝",
    },
    {
      day: 10,
      title: "Professional Development & Career Pathways",
      description: "Understand certification pathways and plan your career advancement.",
      objectives: [
        "Understand certification pathways (COA, COT, COMT)",
        "Develop professional growth strategies",
        "Learn continuing education requirements",
        "Plan career advancement",
      ],
      topics: [
        "Certified Ophthalmic Assistant (COA) requirements",
        "Certified Ophthalmic Technician (COT) requirements",
        "Certified Ophthalmic Medical Technician (COMT) requirements",
        "JCAHPO examination content areas",
        "Continuing education resources",
        "Career advancement opportunities",
        "Professional organizations and networking",
        "Lifelong learning strategies",
      ],
      assets: ["Slide Deck", "Infographic", "Data Table", "Flashcards", "Quiz"],
      icon: "🎓",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl font-bold">10-Day Course Curriculum</h1>
          </div>
          <p className="text-xl text-blue-100">
            Comprehensive, structured learning path to master ophthalmic technician skills
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-4">
          {curriculumDays.map((dayContent) => (
            <Card
              key={dayContent.day}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() =>
                  setExpandedDay(
                    expandedDay === dayContent.day ? null : dayContent.day
                  )
                }
                className="w-full p-6 flex items-start justify-between hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className="text-4xl">{dayContent.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-1">
                      Day {dayContent.day}
                    </h3>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {dayContent.title}
                    </h2>
                    <p className="text-gray-600">{dayContent.description}</p>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedDay === dayContent.day ? (
                    <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedDay === dayContent.day && (
                <div className="border-t bg-gray-50 p-6 space-y-6">
                  {/* Learning Objectives */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      Learning Objectives
                    </h4>
                    <ul className="space-y-2">
                      {dayContent.objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold mt-1">
                            ✓
                          </span>
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Topics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Key Topics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dayContent.topics.map((topic, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-lg border border-blue-100"
                        >
                          <p className="text-gray-700">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Studio Assets */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      Learning Materials
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dayContent.assets.map((asset, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Enroll to Access This Content
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            What You'll Master
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Clinical Skills
                </h4>
                <p className="text-gray-600">
                  Master all essential ophthalmic diagnostic and imaging
                  techniques
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">💼</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Professional Competency
                </h4>
                <p className="text-gray-600">
                  Develop soft skills and professional communication abilities
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Knowledge Foundation
                </h4>
                <p className="text-gray-600">
                  Build comprehensive understanding of ophthalmic principles
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Career Ready
                </h4>
                <p className="text-gray-600">
                  Prepare for certification and career advancement
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
