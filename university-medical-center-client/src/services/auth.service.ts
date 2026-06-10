"use server";

import { cookies } from "next/headers";
import type {
  ChangePasswordRequest,
  CreateDoctorRequest,
  Doctor,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ServiceResponse,
  UpdateDoctorProfileRequest,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function register(
  payload: RegisterRequest
): Promise<ServiceResponse<{ message: string }>> {
  try {
    const res = await fetch(`${API}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Registration failed" };
    }

    return { data: { message: json?.message }, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function createDoctor(
  payload: CreateDoctorRequest
): Promise<ServiceResponse<Doctor>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/users/create-doctor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to create doctor" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function login(
  payload: LoginRequest
): Promise<ServiceResponse<LoginResponse>> {
  try {
    const res = await fetch(`${API}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Login failed" };
    }

    const jar = await cookies();
    jar.set("accessToken", json?.data?.accessToken, { httpOnly: true, path: "/" });
    jar.set("refreshToken", json?.data?.refreshToken, { httpOnly: true, path: "/" });

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function logout(): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    await fetch(`${API}/api/v1/users/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const jar = await cookies();
    jar.delete("accessToken");
    jar.delete("refreshToken");

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/users/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to change password" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function updateDoctorProfile(
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
