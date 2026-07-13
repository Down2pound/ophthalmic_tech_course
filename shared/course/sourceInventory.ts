import type { CourseSource } from "./types";

export const courseSources: CourseSource[] = [
  {
    id: "drive-bootcamp-folder",
    title: "Bootcamp Google Drive Folder",
    sourceType: "drive-folder",
    url: "https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q",
    classification: "public-course-candidate",
  },
  {
    id: "drive-bootcamp-site-course-data",
    title: "Ophthalmic Tech Bootcamp Site Course Data",
    sourceType: "source-code",
    url: "https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI",
    classification: "public-course-candidate",
  },
  {
    id: "notebooklm-bootcamp-course-materials",
    title: "NotebookLM Bootcamp Course Materials",
    sourceType: "notebooklm",
    url: "https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1",
    classification: "public-course-candidate",
  },
  {
    id: "drive-bootcamp-curriculum",
    title: "Practical Ophthalmic Technician Foundations Bootcamp Curriculum",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1zKSwNXOKUMaKipL1iL8eFO3Pc85FFoflA_5r_n0Vr3c",
    classification: "public-course-candidate",
  },
  {
    id: "drive-bootcamp-syllabus",
    title: "Practical Ophthalmic Technician Foundations: 10-Day Bootcamp Syllabus",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1aUtdx9yVXqRBMgAT7RnREw6Cz-Wx7m1zYd4ZCWcnF0g",
    classification: "public-course-candidate",
  },
  {
    id: "drive-clinical-pattern-hpi",
    title: "Clinical Pattern Recognition and HPI Cheat Sheet",
    sourceType: "google-doc",
    url: "https://docs.google.com/document/d/1kTVt669_kiaqS6M16ptq3AAVE9LyfptM79RxyC-GyAs",
    classification: "public-course-candidate",
  },
  {
    id: "drive-biological-camera",
    title: "The Biological Camera",
    sourceType: "pdf",
    url: "https://drive.google.com/file/d/1csJ5mjX4Nb2-4HdxBrcozqunp55nWTFf",
    classification: "public-course-candidate",
  },
  {
    id: "jcahpo-coa",
    title: "IJCAHPO Certified Ophthalmic Assistant Certification",
    sourceType: "official-website",
    url: "https://www.jcahpo.org/certification/certifications/certified-ophthalmic-assistant/",
    classification: "official-reference",
  },
  {
    id: "onet-ophthalmic-medical-technicians",
    title: "O*NET Ophthalmic Medical Technicians",
    sourceType: "official-website",
    url: "https://www.onetonline.org/link/summary/29-2057.00",
    classification: "official-reference",
  },
];

export function getCourseSource(sourceId: string): CourseSource {
  const source = courseSources.find((item) => item.id === sourceId);
  if (!source) {
    throw new Error(`Unknown course source: ${sourceId}`);
  }
  return source;
}
