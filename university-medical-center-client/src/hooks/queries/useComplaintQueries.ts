"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadComplaintCount } from "@/services/complaint.service";

export const complaintKeys = {
  all: ["complaints"] as const,
  unreadCount: [...["complaints"], "unread-count"] as const,
};

export function useUnreadComplaintCount() {
  return useQuery({
    queryKey: complaintKeys.unreadCount,
    queryFn: async () => {
      const result = await getUnreadComplaintCount();
      if (result.error) throw new Error(result.error);
      return result.data?.count ?? 0;
    },
    refetchInterval: 30000,
  });
}
