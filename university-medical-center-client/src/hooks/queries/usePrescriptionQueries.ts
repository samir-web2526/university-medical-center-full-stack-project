"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPrescriptions,
  cancelPrescription,
} from "@/services/prescription.service";
import type { Prescription, PaginatedResponse } from "@/types";

// Query Keys
export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  list: (page: number, limit: number) => [...prescriptionKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...prescriptionKeys.all, "detail", id] as const,
};

// Queries
export function usePrescriptions(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: prescriptionKeys.list(page, limit),
    queryFn: async () => {
      const result = await getAllPrescriptions(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Prescription>;
    },
  });
}

// Mutations
export function useCancelPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) =>
      cancelPrescription(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });
}
