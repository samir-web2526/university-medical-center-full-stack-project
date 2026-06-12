"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "@/services/doctor.service";
import { createDoctor as createDoctorService } from "@/services/auth.service";
import type { Doctor, PaginatedResponse, CreateDoctorRequest } from "@/types";

// Query Keys
export const doctorKeys = {
  all: ["doctors"] as const,
  list: (page: number, limit: number) => [...doctorKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...doctorKeys.all, "detail", id] as const,
};

// Queries
export function useDoctors(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: doctorKeys.list(page, limit),
    queryFn: async () => {
      const result = await getAllDoctors(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Doctor>;
    },
  });
}

export function useDoctorDetail(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async () => {
      const result = await getDoctorById(id);
      if (result.error) throw new Error(result.error);
      return result.data as Doctor;
    },
  });
}

// Mutations
export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDoctorService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) =>
      updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
  });
}
