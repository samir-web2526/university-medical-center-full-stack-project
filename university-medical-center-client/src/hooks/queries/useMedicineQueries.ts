"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  increaseStock,
  decreaseStock,
} from "@/services";
import type { Medicine, PaginatedResponse, AdjustStockRequest } from "@/types";

// Query Keys
export const medicineKeys = {
  all: ["medicines"] as const,
  list: (page: number, limit: number) => [...medicineKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...medicineKeys.all, "detail", id] as const,
};

// Queries
export function useMedicines(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: medicineKeys.list(page, limit),
    queryFn: async () => {
      const result = await getAllMedicines(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Medicine>;
    },
  });
}

export function useMedicineDetail(id: string) {
  return useQuery({
    queryKey: medicineKeys.detail(id),
    queryFn: async () => {
      const result = await getMedicineById(id);
      if (result.error) throw new Error(result.error);
      return result.data as Medicine;
    },
  });
}

// Mutations
export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all });
    },
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) =>
      updateMedicine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all });
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all });
    },
  });
}

export function useIncreaseStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) =>
      increaseStock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all });
    },
  });
}

export function useDecreaseStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) =>
      decreaseStock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicineKeys.all });
    },
  });
}
