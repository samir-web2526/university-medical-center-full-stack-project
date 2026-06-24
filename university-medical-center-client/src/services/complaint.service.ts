"use server";

import { cookies } from "next/headers";
import type {
  Complaint,
  CreateComplaintRequest,
  PaginatedResponse,
  ServiceResponse,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function createComplaint(
  payload: CreateComplaintRequest
): Promise<ServiceResponse<Complaint>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to submit complaint" };
    }

    return { data: json?.data ?? json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getAllComplaints(
  page = 1,
  limit = 15
): Promise<ServiceResponse<PaginatedResponse<Complaint>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/complaints?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch complaints" };
    }

    return {
      data: {
        data: json.data ?? [],
        meta: json.meta ?? { total: 0, page, limit },
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getUnreadComplaintCount(): Promise<
  ServiceResponse<{ count: number }>
> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/complaints/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch unread count" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function markComplaintAsRead(
  id: string
): Promise<ServiceResponse<Complaint>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/complaints/mark-as-read/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to mark complaint as read" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function markAllComplaintsAsRead(): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/complaints/mark-all-as-read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to mark all complaints as read" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function deleteComplaint(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/complaints/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to delete complaint" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
