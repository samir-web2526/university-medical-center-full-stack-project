import type { UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Admin Profile
// ─────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: UserStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Admin Request DTOs
// ─────────────────────────────────────────────

export interface UpdateAdminProfileRequest {
  name?: string;
  email?: string;
  phone?: string | null;
}
