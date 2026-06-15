import type { PrescriptionStatus } from "./common.types";
import type { Doctor } from "./doctor.types";
import type { Medicine } from "./medicine.types";
import type { Student } from "./student.types";
import type { Visit } from "./visit.types";

// ─────────────────────────────────────────────
// Prescription Medicine (Pivot)
// ─────────────────────────────────────────────

export interface PrescriptionMedicine {
  id: string;
  prescriptionId: string;
  medicineId: string;
  dosage: string;
  frequency?: string | null;
  duration: string;
  quantity: number;
  instructions: string | null;
  medicine?: Medicine;
}

// ─────────────────────────────────────────────
// Prescription Model
// ─────────────────────────────────────────────

export interface Prescription {
  id: string;
  visitId: string;
  studentId: string;
  doctorId: string;
  diagnosis: string;
  advice: string | null;
  investigation: string | null;
  prescriptionImage: string | null;
  status: PrescriptionStatus;
  cancelReason: string | null;
  cancelledAt: string | null;
  visit?: Visit;
  medicines?: PrescriptionMedicine[];
  student?: Student;
  doctor?: Doctor;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Prescription Request DTOs
// ─────────────────────────────────────────────

export interface PrescriptionMedicineInput {
  medicineId: string;
  dosage: string;
  frequency?: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface CreatePrescriptionRequest {
  visitId: string;
  diagnosis: string;
  advice?: string;
  investigation?: string;
  prescriptionImage?: string;
  medicines?: PrescriptionMedicineInput[];
}

export interface CancelPrescriptionRequest {
  cancelReason: string;
}
