import type { Gender, UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Doctor Model
// ─────────────────────────────────────────────

export interface Doctor {
  id: string;
  userId: string;
  gender?: Gender;
  specialization: string;
  qualification: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    status?: UserStatus;
    isActive?: boolean;
    imageUrl?: string | null;
  };
}

// ─────────────────────────────────────────────
// Doctor Request DTOs
// ─────────────────────────────────────────────

export interface UpdateDoctorProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  qualification?: string | null;
  specialization?: string | null;
  imageUrl?: string;
}

export interface AdminUpdateDoctorRequest {
  gender?: Gender;
  status?: UserStatus;
  qualification?: string | null;
  specialization?: string | null;
}
