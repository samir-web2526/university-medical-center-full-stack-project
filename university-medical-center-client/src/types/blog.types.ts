import type { Role } from "./common.types";

// ─────────────────────────────────────────────
// Blog Model
// ─────────────────────────────────────────────

export interface Blog {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    role?: Role;
  };
}

// ─────────────────────────────────────────────
// Blog Request DTOs
// ─────────────────────────────────────────────

export interface CreateBlogRequest {
  title: string;
  content: string;
  coverImage?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  coverImage?: string;
}
