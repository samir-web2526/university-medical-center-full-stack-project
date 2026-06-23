"use server";

import { cookies } from "next/headers";
import type {
  AdminUpdateDoctorRequest,
  Doctor,
  PaginatedResponse,
  ServiceResponse,
  UpdateDoctorProfileRequest,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function getMyProfile(): Promise<ServiceResponse<Doctor>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/doctors/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch profile" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function updateMyProfile(
  payload: UpdateDoctorProfileRequest
): Promise<ServiceResponse<Doctor>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/users/update-doctor-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to update profile" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getAllDoctors(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Doctor>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/doctors?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch doctors" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getPublicDoctors(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Doctor>>> {
  try {
    const res = await fetch(
      `${API}/api/v1/doctors/public?page=${page}&limit=${limit}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch doctors" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getDoctorById(
  id: string
): Promise<ServiceResponse<Doctor>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/doctors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch doctor" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    throw new Error(message);
  }
}

export async function updateDoctor(
  id: string,
  payload: AdminUpdateDoctorRequest
): Promise<ServiceResponse<Doctor>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/doctors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || "Failed to update doctor");
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteDoctor(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/doctors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      let message = "Failed to delete doctor";
      try {
        const json = await res.json();
        message = json?.message || message;
      } catch {}
      throw new Error(message);
    }

    return { data: null, error: null };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Unexpected error");
  }
}
