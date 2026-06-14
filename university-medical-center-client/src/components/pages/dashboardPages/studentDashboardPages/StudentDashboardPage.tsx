"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  CalendarDays, FileText, Bell, Activity, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getVisits } from "@/services/visit.service";
import { getMyPrescriptions } from "@/services/prescription.service";
import { getUnreadCount } from "@/services/notification.service";
import type { Visit, Prescription } from "@/types";

interface MonthData {
  month: string;
  visits: number;
  prescriptions: number;
}

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString("en-US", { month: "short" }));
  }
  return months;
}

function aggregateByMonth(
  visits: Visit[],
  prescriptions: Prescription[],
  monthLabels: string[]
): MonthData[] {
  const now = new Date();
  return monthLabels.map((label, i) => {
    const targetMonth = now.getMonth() - (5 - i);
    const targetYear = now.getFullYear() - (targetMonth < 0 ? 1 : 0);
    const adjustedMonth = ((targetMonth % 12) + 12) % 12;

    const visitCount = visits.filter((v) => {
      const d = new Date(v.visitDate);
      return d.getMonth() === adjustedMonth && d.getFullYear() === targetYear;
    }).length;

    const rxCount = prescriptions.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() === adjustedMonth && d.getFullYear() === targetYear;
    }).length;

    return { month: label, visits: visitCount, prescriptions: rxCount };
  });
}

export default function StudentDashboardPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getVisits(1, 100),
      getMyPrescriptions(1, 100),
      getUnreadCount(),
    ]).then(([visitRes, rxRes, notifRes]) => {
      if (cancelled) return;
      setVisits(visitRes.data?.data ?? []);
      setPrescriptions(rxRes.data?.data ?? []);
      setUnreadCount(notifRes.data?.count ?? 0);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const monthLabels = getLast6Months();
  const chartData = aggregateByMonth(visits, prescriptions, monthLabels);
  const activePrescriptions = prescriptions.filter((p) => p.status === "ACTIVE").length;
  const recentVisits = [...visits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 5);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s an overview of your health records.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Visits"
          value={visits.length}
          icon={<CalendarDays className="h-5 w-5 text-violet-600" />}
          bg="bg-violet-50"
          href="/dashboard/visits"
        />
        <StatsCard
          title="Total Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-5 w-5 text-emerald-600" />}
          bg="bg-emerald-50"
          href="/dashboard/prescriptions"
        />
        <StatsCard
          title="Active Prescriptions"
          value={activePrescriptions}
          icon={<Activity className="h-5 w-5 text-blue-600" />}
          bg="bg-blue-50"
          href="/dashboard/prescriptions"
        />
        <StatsCard
          title="Unread Notifications"
          value={unreadCount}
          icon={<Bell className="h-5 w-5 text-amber-600" />}
          bg="bg-amber-50"
          href="/dashboard/notifications"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-500" />
              Visits per Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="visits"
                    name="Visits"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Prescriptions per Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="prescriptions"
                    name="Prescriptions"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-500" />
            Recent Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentVisits.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No visits yet</p>
          ) : (
            <div className="space-y-3">
              {recentVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-violet-50/50 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{visit.chiefComplaint}</p>
                      <p className="text-xs text-slate-400">
                        {visit.doctor?.user?.name ?? "—"} &middot;{" "}
                        {new Date(visit.visitDate).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {visit.prescription && (
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        Rx
                      </Badge>
                    )}
                    <Link
                      href={`/dashboard/visits/${visit.id}`}
                      className="text-violet-600 hover:text-violet-700 p-1 rounded-md hover:bg-violet-50"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  bg,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
