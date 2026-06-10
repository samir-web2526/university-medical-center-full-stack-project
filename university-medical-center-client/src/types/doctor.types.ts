import type { UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Doctor Model
// ─────────────────────────────────────────────

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  contactNumber: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Doctor Request DTOs
// ─────────────────────────────────────────────

export interface UpdateDoctorProfileRequest {
  name?: string;
  specialization?: string;
  qualification?: string;
  contactNumber?: string;
}

export interface AdminUpdateDoctorRequest extends UpdateDoctorProfileRequest {
  status?: UserStatus;
}
