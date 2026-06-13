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

    const body = {
      ...payload,
      temperature: payload.temperature != null ? Number(payload.temperature) : undefined,
      weight: payload.weight != null ? Number(payload.weight) : undefined,
      pulseRate: payload.pulseRate != null ? Number(payload.pulseRate) : undefined,
    };

    const res = await fetch(`${API}/api/v1/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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

    const body: Record<string, unknown> = {};
    if (payload.chiefComplaint != null) body.chiefComplaint = payload.chiefComplaint;
    if (payload.bloodPressure != null) body.bloodPressure = payload.bloodPressure;
    if (payload.temperature != null) body.temperature = Number(payload.temperature);
    if (payload.weight != null) body.weight = Number(payload.weight);
    if (payload.pulseRate != null) body.pulseRate = Number(payload.pulseRate);
    if (payload.notes != null) body.notes = payload.notes;

    const res = await fetch(`${API}/api/v1/visits/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
