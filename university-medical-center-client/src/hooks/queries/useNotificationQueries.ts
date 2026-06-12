"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllNotifications,
  markAsRead,
  deleteNotification,
} from "@/services/notification.service";
import type { Notification, PaginatedResponse } from "@/types";

// Query Keys
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) => [...notificationKeys.all, "list", page, limit] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
};

// Queries
export function useNotifications(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: async () => {
      const result = await getAllNotifications(page, limit);
      if (result.error) throw new Error(result.error);
      return result.data as PaginatedResponse<Notification>;
    },
  });
}

// Mutations
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
