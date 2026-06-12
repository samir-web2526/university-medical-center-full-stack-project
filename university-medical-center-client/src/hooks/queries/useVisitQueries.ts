"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVisits,
  updateVisit,
  deleteVisit,
} from "@/services/visit.service";
import type { Visit, PaginatedResponse } from "@/types";

// Query Keys
export const visitKeys = {
  all: ["visits"] as const,
  list: (page: number, limit: number) => [...visitKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...visitKeys.all, "detail", id] as const,
};

// Queries
export function useVisits(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: visitKeys.list(page, limit),
    queryFn: async () => {
      const result = await getVisits(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Visit>;
    },
  });
}

// Mutations
export function useUpdateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) =>
      updateVisit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

export function useDeleteVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}
