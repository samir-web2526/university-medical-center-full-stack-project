"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck, Inbox, Sparkles } from "lucide-react";
import { getMyNotifications, markAllAsRead, markAsRead, getUnreadCount } from "@/services/notification.service";
import type { Notification } from "@/types";
import { toast } from "sonner";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getMyNotifications(1, 50),
      getUnreadCount(),
    ]).then(([notifRes, countRes]) => {
      if (cancelled) return;
      setNotifications(notifRes.data?.data ?? []);
      setUnreadCount(countRes.data?.count ?? 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleMarkAllRead = async () => {
    const { error } = await markAllAsRead();
    if (error) toast.error(error);
    else {
      toast.success("All marked as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleMarkRead = async (id: string) => {
    const { error } = await markAsRead(id);
    if (!error) {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-yellow-500 p-8 text-white shadow-xl shadow-amber-500/20">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-yellow-300/20 blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-200" />
                <span className="text-sm font-medium text-amber-100">Stay Updated</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <p className="text-amber-100 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={handleMarkAllRead}
                className="gap-1.5 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-xl"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 flex items-center justify-center shadow-inner">
                    <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No notifications</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You&apos;re all caught up!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n, idx) => (
                  <div
                    key={n.id}
                    className={`px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer ${!n.isRead ? "bg-linear-to-r from-amber-50/60 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5" : ""} ${idx === 0 && !n.isRead ? "ring-1 ring-amber-200/50 dark:ring-amber-800/30" : ""}`}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                  >
                    <div className="flex items-start gap-4">
                      {!n.isRead && (
                        <div className="mt-1.5 shrink-0">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.isRead ? "font-semibold text-slate-900 dark:text-slate-50" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                          {new Date(n.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
