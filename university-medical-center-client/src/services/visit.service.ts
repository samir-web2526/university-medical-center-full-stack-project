"use server";

import { cookies } from "next/headers";
import type {
  CreateVisitRequest,
  PaginatedResponse,
  ServiceResponse,
  UpdateVisitRequest,
  Visit,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function createVisit(
  payload: CreateVisitRequest
): Promise<ServiceResponse<Visit>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to create visit" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getVisits(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Visit>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/visits?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch visits" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getVisitById(
  id: string
): Promise<ServiceResponse<Visit>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/visits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch visit" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function updateVisit(
  id: string,
  payload: UpdateVisitRequest
): Promise<ServiceResponse<Visit>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/visits/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to update visit" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function deleteVisit(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/visits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to delete visit" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
