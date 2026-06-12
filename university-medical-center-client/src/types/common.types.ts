// ─────────────────────────────────────────────
// Common / Shared Types
// ─────────────────────────────────────────────

export type Role = "ADMIN" | "DOCTOR" | "STUDENT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "INACTIVE";

export type PrescriptionStatus = "ACTIVE" | "CANCELLED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type NotificationType =
  | "MEDICINE_LOW_STOCK"
  | "MEDICINE_OUT_OF_STOCK"
  | "PRESCRIPTION_CREATED"
  | "PRESCRIPTION_CANCELLED"
  | "VISIT_CREATED"
  | "SYSTEM_ALERT";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

// ─────────────────────────────────────────────
// Generic API Response Wrappers
// ─────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorDetails?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Service Layer Response Wrapper
// ─────────────────────────────────────────────

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}
