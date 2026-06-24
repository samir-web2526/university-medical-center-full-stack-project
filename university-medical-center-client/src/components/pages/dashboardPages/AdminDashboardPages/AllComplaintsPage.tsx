"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteComplaint, markComplaintAsRead, markAllComplaintsAsRead } from "@/services/complaint.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquareWarning, Trash2, CheckCheck,
  ChevronLeft, ChevronRight, Mail, Phone, User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Complaint, PaginatedResponse } from "@/types";

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
  initialData: PaginatedResponse<Complaint> | null;
  initialPage: number;
  limit: number;
  error: string | null;
}

export default function AllComplaintsPage({
  initialData,
  initialPage,
  limit,
  error,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const complaints = initialData?.data ?? [];
  const total = initialData?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const unreadCount = complaints.filter((c) => !c.isRead).length;

  function refresh() {
    startTransition(() => router.refresh());
  }

  const handleMarkOne = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await markComplaintAsRead(id);
      if (result.error) throw new Error(result.error);
      toast.success("Complaint marked as read");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkAll = async () => {
    try {
      const result = await markAllComplaintsAsRead();
      if (result.error) throw new Error(result.error);
      toast.success("All complaints marked as read");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const result = await deleteComplaint(id);
      if (result.error) throw new Error(result.error);
      toast.success("Complaint deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete complaint");
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
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <MessageSquareWarning className="w-5 h-5 text-white" />
              </div>
              Student Complaints
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
                      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">No complaints yet</p>
                <p className="text-xs">Student complaints will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map((complaint) => {
                  const isThisLoading = loadingId === complaint.id;
                  return (
                    <div
                      key={complaint.id}
                      className={cn(
                        "px-4 sm:px-6 py-4 group transition-colors",
                        isThisLoading && "opacity-50",
                        complaint.isRead
                          ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          : "bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {complaint.name}
                              </p>
                              {!complaint.isRead && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                              )}
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                {timeAgo(complaint.createdAt)}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                              {complaint.subject}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {complaint.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <Mail className="w-3 h-3" />
                                {complaint.email}
                              </span>
                              {complaint.phone && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                  <Phone className="w-3 h-3" />
                                  {complaint.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {!complaint.isRead && (
                            <button
                              onClick={() => handleMarkOne(complaint.id)}
                              disabled={isThisLoading}
                              className="p-1 rounded text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(complaint.id)}
                            disabled={isThisLoading}
                            className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete complaint"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
