import type { BloodGroup, UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Student Model
// ─────────────────────────────────────────────

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  name?: string;
  email?: string;
  department: string;
  session: string;
  gender?: Gender;
  bloodGroup: BloodGroup | null;
  contactNumber: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    status?: UserStatus;
    imageUrl?: string | null;
  };
}

// ─────────────────────────────────────────────
// Student Request DTOs
// ─────────────────────────────────────────────

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface UpdateStudentProfileRequest {
  name?: string;
  department?: string;
  session?: string;
  bloodGroup?: BloodGroup;
  contactNumber?: string;
}

export interface AdminUpdateStudentRequest {
  studentId?: string;
  department?: string;
  session?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  status?: UserStatus;
}
