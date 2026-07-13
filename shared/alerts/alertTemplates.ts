export type AlertUrgency = "low" | "normal" | "high" | "urgent";

export type AlertTemplate = {
  id: string;
  label: string;
  message: string;
  category: string;
  urgency: AlertUrgency;
  room: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type DefaultTemplateInput = Omit<
  AlertTemplate,
  "createdAt" | "updatedAt" | "sortOrder" | "isActive"
>;

const defaultTemplateInputs: DefaultTemplateInput[] = [
  {
    id: "oct-room-8",
    label: "OCT Room 8",
    message: "OCT is ready in Room 8.",
    category: "Imaging",
    urgency: "normal",
    room: "Room 8",
  },
  {
    id: "pentacam-room-1",
    label: "Pentacam Room 1",
    message: "Pentacam is ready in Room 1.",
    category: "Imaging",
    urgency: "normal",
    room: "Room 1",
  },
  {
    id: "visual-field-ready",
    label: "Visual Field Ready",
    message: "Visual field testing is ready for review.",
    category: "Testing",
    urgency: "normal",
    room: "Visual Field",
  },
  {
    id: "doctor-needs-tech",
    label: "Doctor Needs Tech",
    message: "Doctor needs a technician.",
    category: "Clinical",
    urgency: "high",
    room: "Exam Area",
  },
  {
    id: "patient-ready",
    label: "Patient Ready",
    message: "Patient is ready.",
    category: "Patient Flow",
    urgency: "normal",
    room: "Waiting Area",
  },
  {
    id: "dilate-patient",
    label: "Dilate Patient",
    message: "Please dilate the patient.",
    category: "Clinical",
    urgency: "normal",
    room: "Exam Area",
  },
  {
    id: "retake-imaging",
    label: "Retake Imaging",
    message: "Please retake imaging.",
    category: "Imaging",
    urgency: "high",
    room: "Imaging",
  },
  {
    id: "bring-patient-to-exam-room",
    label: "Bring Patient to Exam Room",
    message: "Please bring the patient to an exam room.",
    category: "Patient Flow",
    urgency: "normal",
    room: "Waiting Area",
  },
  {
    id: "urgent-tech-help",
    label: "Urgent Tech Help",
    message: "Urgent technician help is needed.",
    category: "Urgent",
    urgency: "urgent",
    room: "Clinic",
  },
  {
    id: "contact-lens-room",
    label: "Contact Lens Room",
    message: "Technician needed in the contact lens room.",
    category: "Contact Lens",
    urgency: "normal",
    room: "Contact Lens Room",
  },
  {
    id: "tech-needed-in-room-3",
    label: "Tech Needed in Room 3",
    message: "Technician needed in Room 3.",
    category: "Clinical",
    urgency: "high",
    room: "Room 3",
  },
  {
    id: "patient-ready-for-doctor",
    label: "Patient Ready for Doctor",
    message: "Patient is ready for the doctor.",
    category: "Doctor",
    urgency: "normal",
    room: "Exam Area",
  },
];

export function createDefaultAlertTemplates(
  now: () => string = () => new Date().toISOString()
): AlertTemplate[] {
  const timestamp = now();
  return defaultTemplateInputs.map((template, index) => ({
    ...template,
    sortOrder: index + 1,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

export function normalizeAlertTemplates(
  templates: AlertTemplate[],
  now: () => string = () => new Date().toISOString()
): AlertTemplate[] {
  const timestamp = now();
  return templates.map((template, index) => ({
    id: template.id.trim(),
    label: template.label.trim(),
    message: template.message.trim(),
    category: template.category.trim(),
    urgency: template.urgency,
    room: template.room.trim(),
    sortOrder: Number.isFinite(template.sortOrder) ? template.sortOrder : index + 1,
    isActive: Boolean(template.isActive),
    createdAt: template.createdAt || timestamp,
    updatedAt: timestamp,
  }));
}
