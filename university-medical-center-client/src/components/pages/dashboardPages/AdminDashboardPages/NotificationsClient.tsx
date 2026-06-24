"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  markAllAsRead,
  markAsRead,
  deleteNotification,
} from "@/services/notification.service";
import { notificationKeys } from "@/hooks/queries/useNotificationQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell, BellOff, Trash2, CheckCheck,
  ChevronLeft, ChevronRight, Pill,
  FileText, AlertTriangle, ShieldAlert, Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Notification, PaginatedResponse } from "@/types";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; darkColor: string; darkBg: string }> = {
  MEDICINE_LOW_STOCK:     { icon: Pill,          color: "text-orange-600", bg: "bg-orange-50", darkColor: "dark:text-orange-400", darkBg: "dark:bg-orange-950/30" },
  OUT_OF_STOCK:           { icon: AlertTriangle,  color: "text-red-600",    bg: "bg-red-50",    darkColor: "dark:text-red-400",    darkBg: "dark:bg-red-950/30" },
  MEDICINE_OUT_OF_STOCK:  { icon: AlertTriangle,  color: "text-red-600",    bg: "bg-red-50",    darkColor: "dark:text-red-400",    darkBg: "dark:bg-red-950/30" },
  PRESCRIPTION_CREATED:   { icon: FileText,       color: "text-blue-600",   bg: "bg-blue-50",   darkColor: "dark:text-blue-400",   darkBg: "dark:bg-blue-950/30" },
  PRESCRIPTION_CANCELLED: { icon: BellOff,        color: "text-slate-500",  bg: "bg-slate-100", darkColor: "dark:text-slate-400",  darkBg: "dark:bg-slate-800" },
  VISIT_CREATED:          { icon: Bell,           color: "text-emerald-600",bg: "bg-emerald-50", darkColor: "dark:text-emerald-400", darkBg: "dark:bg-emerald-950/30" },
  SYSTEM_ALERT:           { icon: ShieldAlert,    color: "text-violet-600", bg: "bg-violet-50", darkColor: "dark:text-violet-400", darkBg: "dark:bg-violet-950/30" },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? { icon: Info, color: "text-slate-500", bg: "bg-slate-100", darkColor: "dark:text-slate-400", darkBg: "dark:bg-slate-800" };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  initialData: PaginatedResponse<Notification> | null;
  initialPage: number;
  limit: number;
  error: string | null;
}

export default function NotificationsClient({
  initialData,
  initialPage,
  limit,
  error,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const notifications = initialData?.data ?? [];
  const total = initialData?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function refresh() {
    startTransition(() => router.refresh());
  }

  const handleMarkOne = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await markAsRead(id);
      if (result.error) throw new Error(result.error);
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkAll = async () => {
    try {
      const result = await markAllAsRead();
      if (result.error) throw new Error(result.error);
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await deleteNotification(id);
      if (result.error) throw new Error(result.error);
      toast.success("Notification deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete notification");
    } finally {
      setLoadingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => router.push(`?page=${newPage}`));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-cyan-600 hover:bg-cyan-600 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 h-8 text-xs"
              onClick={handleMarkAll}
              disabled={isPending}
            >
              {isPending
                ? <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                : <CheckCheck className="w-3.5 h-3.5" />
              }
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            {isPending ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 w-full max-w-65 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <BellOff className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((notif) => {
                  const cfg = getTypeConfig(notif.type);
                  const Icon = cfg.icon;
                  const isThisLoading = loadingId === notif.id;

                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 px-4 sm:px-6 py-3.5 group transition-colors",
                        isThisLoading && "opacity-50",
                        notif.isRead
                          ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          : "bg-cyan-50/50 dark:bg-cyan-950/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg, cfg.darkBg)}>
                        <Icon className={cn("w-4 h-4", cfg.color, cfg.darkColor)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-medium leading-snug",
                            notif.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-100"
                          )}>
                            {notif.title}
                            {!notif.isRead && (
                              <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 align-middle" />
                            )}
                          </p>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!notif.isRead && (
                              <button
                                onClick={() => handleMarkOne(notif.id)}
                                disabled={isThisLoading}
                                className="p-1 rounded text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-950/30 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notif.id)}
                              disabled={isThisLoading}
                              className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {initialPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(initialPage - 1)}
                disabled={initialPage === 1 || isPending}
                className="border-slate-200 dark:border-slate-700 h-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(initialPage + 1)}
                disabled={initialPage === totalPages || isPending}
                className="border-slate-200 dark:border-slate-700 h-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
