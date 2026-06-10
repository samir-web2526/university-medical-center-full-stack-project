import type { NotificationType } from "./common.types";

// ─────────────────────────────────────────────
// Notification Model
// ─────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Notification Response DTOs
// ─────────────────────────────────────────────

export interface UnreadCountResponse {
  count: number;
}
