"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNotifications, useMarkAsRead, useDeleteNotification } from "@/hooks/queries/useNotificationQueries";
import { markAllAsRead as markAllAsReadService } from "@/services/notification.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell, BellOff, Trash2, CheckCheck,
  ChevronLeft, ChevronRight, Pill,
  FileText, AlertTriangle, ShieldAlert, Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; darkColor: string; darkBg: string }> = {
  MEDICINE_LOW_STOCK:    { icon: Pill,          color: "text-orange-600", bg: "bg-orange-50", darkColor: "dark:text-orange-400", darkBg: "dark:bg-orange-950/30" },
  OUT_OF_STOCK:          { icon: AlertTriangle,  color: "text-red-600",    bg: "bg-red-50",    darkColor: "dark:text-red-400",    darkBg: "dark:bg-red-950/30" },
  MEDICINE_OUT_OF_STOCK: { icon: AlertTriangle,  color: "text-red-600",    bg: "bg-red-50",    darkColor: "dark:text-red-400",    darkBg: "dark:bg-red-950/30" },
  PRESCRIPTION_CREATED:  { icon: FileText,       color: "text-blue-600",   bg: "bg-blue-50",   darkColor: "dark:text-blue-400",   darkBg: "dark:bg-blue-950/30" },
  PRESCRIPTION_CANCELLED:{ icon: BellOff,        color: "text-slate-500",  bg: "bg-slate-100", darkColor: "dark:text-slate-400",  darkBg: "dark:bg-slate-800" },
  VISIT_CREATED:         { icon: Bell,           color: "text-emerald-600",bg: "bg-emerald-50", darkColor: "dark:text-emerald-400", darkBg: "dark:bg-emerald-950/30" },
  SYSTEM_ALERT:          { icon: ShieldAlert,    color: "text-violet-600", bg: "bg-violet-50", darkColor: "dark:text-violet-400", darkBg: "dark:bg-violet-950/30" },
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
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const limit = 15;
  const queryClient = useQueryClient();

  const { data, isLoading } = useNotifications(page, limit);
  const markOneNotification = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const markAllMutation = useMutation({
    mutationFn: markAllAsReadService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleMarkOne = async (id: string) => {
    try {
      await markOneNotification.mutateAsync(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllMutation.mutateAsync();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

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
              <Badge className="bg-cyan-600 hover:bg-cyan-600 dark:bg-cyan-600 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
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
              disabled={markAllMutation.isPending}
            >
              {markAllMutation.isPending ? <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-full max-w-65" />
                      <Skeleton className="h-3 w-16" />
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
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 px-4 sm:px-6 py-3.5 group transition-colors",
                        notif.isRead ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50" : "bg-cyan-50/50 dark:bg-cyan-950/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg, cfg.darkBg)}>
                        <Icon className={cn("w-4 h-4", cfg.color, cfg.darkColor)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm font-medium leading-snug", notif.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
                            {notif.title}
                            {!notif.isRead && (
                              <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 align-middle" />
                            )}
                          </p>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {!notif.isRead && (
                              <button
                                onClick={() => handleMarkOne(notif.id)}
                                className="p-1 rounded text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-950/30 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notif.id)}
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
            <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="border-slate-200 dark:border-slate-700 h-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="border-slate-200 dark:border-slate-700 h-8"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
