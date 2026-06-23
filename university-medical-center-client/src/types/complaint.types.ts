// ─────────────────────────────────────────────
// Complaint Model
// ─────────────────────────────────────────────

export interface Complaint {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Complaint Request DTOs
// ─────────────────────────────────────────────

export interface CreateComplaintRequest {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}
