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
  contactNumber: string | null;
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
  specialization?: string;
  qualification?: string;
  contactNumber?: string;
}

export interface AdminUpdateDoctorRequest {
  gender?: Gender;
  status?: UserStatus;
  qualification?: string;
  specialization?: string;
}

// ─────────────────────────────────────────────
// Doctor Request DTOs
// ─────────────────────────────────────────────

export interface UpdateDoctorProfileRequest {
  user?:{
    name?: string;
    email?: string;
    phone?: string;
  }
  specialization?: string;
  qualification?: string;
  
}

export interface AdminUpdateDoctorRequest extends UpdateDoctorProfileRequest {
  status?: UserStatus;
}
