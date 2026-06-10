"use server";

import { cookies } from "next/headers";
import type {
  CancelPrescriptionRequest,
  CreatePrescriptionRequest,
  PaginatedResponse,
  Prescription,
  ServiceResponse,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function createPrescription(
  payload: CreatePrescriptionRequest
): Promise<ServiceResponse<Prescription>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to create prescription" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getDoctorPrescriptions(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Prescription>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/prescriptions/doctor-prescriptions?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch prescriptions" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getMyPrescriptions(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Prescription>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/prescriptions/my-prescriptions?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch prescriptions" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getAllPrescriptions(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Prescription>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/prescriptions?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch prescriptions" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getPrescriptionById(
  id: string
): Promise<ServiceResponse<Prescription>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch prescription" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function cancelPrescription(
  id: string,
  payload: CancelPrescriptionRequest
): Promise<ServiceResponse<Prescription>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/prescriptions/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to cancel prescription" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
