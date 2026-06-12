"use server";

import { cookies } from "next/headers";
import type {
  Notification,
  PaginatedResponse,
  ServiceResponse,
  UnreadCountResponse,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function getMyNotifications(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Notification>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/notifications/my-notifications?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch notifications" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getAllNotifications(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Notification>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/notifications/all?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch notifications" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function markAllAsRead(): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/notifications/mark-all-as-read`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to mark notifications as read" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function markAsRead(
  id: string
): Promise<ServiceResponse<Notification>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/notifications/mark-as-read/${id}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to mark notification as read" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getUnreadCount(): Promise<
  ServiceResponse<UnreadCountResponse>
> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/notifications/unread-count`, {
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

export async function deleteNotification(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to delete notification" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
