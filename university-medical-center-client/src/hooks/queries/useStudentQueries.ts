"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStudents,
  updateStudent,
  deleteStudent,
} from "@/services/student.service";
import type { Student, PaginatedResponse, ServiceResponse } from "@/types";

// Query Keys
export const studentKeys = {
  all: ["students"] as const,
  list: (page: number, limit: number) => [...studentKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...studentKeys.all, "detail", id] as const,
};

// Queries
export function useStudents(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: studentKeys.list(page, limit),
    queryFn: async () => {
      const result = await getAllStudents(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Student>;
    },
  });
}

// Mutations
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) =>
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
