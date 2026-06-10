import type { PrescriptionStatus } from "./common.types";
import type { Doctor } from "./doctor.types";
import type { Medicine } from "./medicine.types";
import type { Student } from "./student.types";

// ─────────────────────────────────────────────
// Prescription Medicine (Pivot)
// ─────────────────────────────────────────────

export interface PrescriptionMedicine {
  id: string;
  prescriptionId: string;
  medicineId: string;
  dosage: string;
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
  imageUrl: string | null;
  status: PrescriptionStatus;
  cancelReason: string | null;
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
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface CreatePrescriptionRequest {
  visitId: string;
  diagnosis: string;
  advice?: string;
  imageUrl?: string;
  medicines?: PrescriptionMedicineInput[];
}

export interface CancelPrescriptionRequest {
  cancelReason: string;
}
