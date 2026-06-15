import type { BloodGroup, Gender, UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Student Model
// ─────────────────────────────────────────────

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  department: string;
  session: string;
  gender?: Gender;
  bloodGroup: BloodGroup | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  guardianNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role?: string;
    status?: UserStatus;
    imageUrl?: string | null;
  };
}

// ─────────────────────────────────────────────
// Student Request DTOs
// ─────────────────────────────────────────────

export interface UpdateStudentProfileRequest {
  gender?: Gender;
  bloodGroup?: BloodGroup;
  imageUrl?: string | null;
  presentAddress?: string | null;
  permanentAddress?: string | null;
  guardianNumber?: string | null;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}


export interface AdminUpdateStudentRequest {
  studentId?: string;
  department?: string;
  session?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  status?: UserStatus;
}
