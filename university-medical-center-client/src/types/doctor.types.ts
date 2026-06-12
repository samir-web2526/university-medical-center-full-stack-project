import type { UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Doctor Model
// ─────────────────────────────────────────────

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  qualification: string;
  contactNumber: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    status?: UserStatus;
    imageUrl?: string | null;
  };
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
