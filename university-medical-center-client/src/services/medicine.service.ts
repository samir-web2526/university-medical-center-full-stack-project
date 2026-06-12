"use server";

import { cookies } from "next/headers";
import type {
  AdjustStockRequest,
  CreateMedicineRequest,
  Medicine,
  PaginatedResponse,
  ServiceResponse,
  UpdateMedicineRequest,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function createMedicine(
  payload: CreateMedicineRequest
): Promise<ServiceResponse<Medicine>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to create medicine" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getAllMedicines(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Medicine>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/medicines?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch medicines" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getMedicineById(
  id: string
): Promise<ServiceResponse<Medicine>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch medicine" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function updateMedicine(
  id: string,
  payload: UpdateMedicineRequest
): Promise<ServiceResponse<Medicine>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to update medicine" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function deleteMedicine(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to delete medicine" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function increaseStock(
  id: string,
  payload: AdjustStockRequest
): Promise<ServiceResponse<Medicine>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines/${id}/increase-stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to increase stock" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function decreaseStock(
  id: string,
  payload: AdjustStockRequest
): Promise<ServiceResponse<Medicine>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/medicines/${id}/decrease-stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to decrease stock" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
