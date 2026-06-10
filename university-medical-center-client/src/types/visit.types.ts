import type { Doctor } from "./doctor.types";
import type { Student } from "./student.types";

// ─────────────────────────────────────────────
// Visit Model
// ─────────────────────────────────────────────

export interface Visit {
  id: string;
  studentId: string;
  doctorId: string;
  chiefComplaint: string;
  bloodPressure: string | null;
  temperature: string | null;
  weight: string | null;
  pulseRate: string | null;
  notes: string | null;
  student?: Student;
  doctor?: Doctor;
  prescription?: import("./prescription.types").Prescription | null;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Visit Request DTOs
// ─────────────────────────────────────────────

export interface CreateVisitRequest {
  studentId: string;
  chiefComplaint: string;
  bloodPressure?: string;
  temperature?: string;
  weight?: string;
  pulseRate?: string;
  notes?: string;
}

export interface UpdateVisitRequest {
  chiefComplaint?: string;
  bloodPressure?: string;
  temperature?: string;
  weight?: string;
  pulseRate?: string;
  notes?: string;
}
