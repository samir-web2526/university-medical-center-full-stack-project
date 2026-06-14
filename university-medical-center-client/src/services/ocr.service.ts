"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API;

async function getToken() {
  const jar = await cookies();
  return jar.get("accessToken")?.value ?? "";
}

export interface OcrMedicine {
  name: string;
  dosage: string;
  quantity: number;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface OcrPrescriptionResult {
  rawText: string;
  diagnosis: string;
  advice: string;
  medicines: OcrMedicine[];
}

export async function extractPrescription(
  imageUrl: string
): Promise<{ data: OcrPrescriptionResult | null; error: string | null }> {
  try {
    const token = await getToken();

    const res = await fetch(`${API}/api/v1/ocr/extract-prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageUrl }),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json?.message || "OCR failed" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "OCR request failed",
    };
  }
}
