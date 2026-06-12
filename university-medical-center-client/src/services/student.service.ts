"use server";

import { cookies } from "next/headers";
import type {
  AdminUpdateStudentRequest,
  PaginatedResponse,
  ServiceResponse,
  Student,
  UpdateStudentProfileRequest,
} from "@/types";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export async function getMyProfile(): Promise<ServiceResponse<Student>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/students/profile`, {
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
  payload: UpdateStudentProfileRequest
): Promise<ServiceResponse<Student>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/students/profile`, {
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

export async function getAllStudents(
  page = 1,
  limit = 10
): Promise<ServiceResponse<PaginatedResponse<Student>>> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${API}/api/v1/students?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch students" };
    }

    return { data: json ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function getStudentById(
  id: string
): Promise<ServiceResponse<Student>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/students?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to fetch student" };
    }

    const students = json?.data ?? [];
    const student = students.find((s: any) => s.id === id);

    if (!student) {
      return { data: null, error: "Student not found" };
    }

    return { data: student, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function updateStudent(
  id: string,
  payload: AdminUpdateStudentRequest
): Promise<ServiceResponse<Student>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to update student" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}

export async function deleteStudent(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/students/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "Failed to delete student" };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unexpected error",
    };
  }
}
