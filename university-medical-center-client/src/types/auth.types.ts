import type { Role, UserStatus } from "./common.types";

// ─────────────────────────────────────────────
// Auth Models
// ─────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoggedInUser {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  needsPasswordChange: boolean;
}

// ─────────────────────────────────────────────
// Auth Request DTOs
// ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  studentId: string;
  department: string;
  session: string;
  bloodGroup?: string;
  contactNumber?: string;
}

export interface CreateDoctorRequest {
  email: string;
  password: string;
  name: string;
  specialization: string;
  qualification: string;
  contactNumber?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─────────────────────────────────────────────
// Auth Response DTOs
// ─────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: LoggedInUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
