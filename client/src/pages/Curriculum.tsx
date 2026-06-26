import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  Gauge,
  Glasses,
  GraduationCap,
  HelpCircle,
  ScanEye,
  Search,
  ShieldCheck,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { curriculumModules, getTotalCourseDuration } from "@/data/curriculum";

export default function Curriculum() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const totalDuration = getTotalCourseDuration();
  const moduleIconMap: Record<string, LucideIcon> = {
    Activity,
    BookOpen,
    ClipboardList,
    Eye,
    Gauge,
    Glasses,
    GraduationCap,
    ScanEye,
    Search,
    ShieldCheck,
  };

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
          <div className="flex items-center gap-2 mt-4 text-blue-100">
            <Clock className="w-5 h-5" />
            <span>Total Course Duration: {totalDuration.toFixed(1)} hours</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-4">
          {curriculumModules.map((module) => {
            const ModuleIcon = moduleIconMap[module.icon] ?? BookOpen;

            return (
            <Card
              key={module.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() =>
                  setExpandedDay(
                    expandedDay === module.day ? null : module.day
                  )
                }
                className="w-full p-6 flex items-start justify-between hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
                    <ModuleIcon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold text-blue-600">
                        Day {module.day}
                      </h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{module.duration}</span>
                      </div>
                      {module.difficulty && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          module.difficulty === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : module.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {module.difficulty}
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        module.status === "published"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {module.status === "published"
                          ? "Preview available"
                          : "Scheduled content"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h2>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedDay === module.day ? (
                    <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedDay === module.day && (
                <div className="border-t bg-gray-50 p-6 space-y-6">
                  {/* Learning Objectives */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      Learning Objectives
                    </h4>
                    <ul className="space-y-2">
                      {module.objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600" />
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
                      {module.topics.map((topic, idx) => (
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
                      {module.assets.map((asset, idx) => (
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
                  {module.status === "published" ? (
                    <a href="/learn">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Preview Module
                      </Button>
                    </a>
                  ) : (
                    <Button
                      className="w-full bg-slate-500 text-white hover:bg-slate-600"
                      disabled
                    >
                      Scheduled Content
                    </Button>
                  )}
                </div>
              )}
            </Card>
            );
          })}
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
