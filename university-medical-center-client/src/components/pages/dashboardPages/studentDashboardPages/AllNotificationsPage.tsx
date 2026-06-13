"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { getMyNotifications, markAllAsRead, markAsRead, getUnreadCount } from "@/services/notification.service";
import type { Notification } from "@/types";
import { toast } from "sonner";

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getMyNotifications(1, 50).then((res) => {
      setNotifications(res.data?.data ?? []);
      setLoading(false);
    });
    getUnreadCount().then((res) => {
      setUnreadCount(res.data?.count ?? 0);
    });
  };

  useEffect(() => { load(); }, []);

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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-500" />
              Notifications
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllRead}
              className="gap-1.5 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Inbox className="w-8 h-8" />
                  <p className="text-sm font-medium">No notifications</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? "bg-amber-50/40" : ""}`}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.isRead ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
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
