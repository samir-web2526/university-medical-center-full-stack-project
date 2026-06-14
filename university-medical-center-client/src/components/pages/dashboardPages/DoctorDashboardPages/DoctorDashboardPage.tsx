"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  CalendarDays, FileText, Users, Activity, ArrowRight, TrendingUp, Sparkles,
  Stethoscope, Plus, Pill,
} from "lucide-react";
import Link from "next/link";
import { getVisits } from "@/services/visit.service";
import { getDoctorPrescriptions } from "@/services/prescription.service";
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

export default function DoctorDashboardPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getVisits(1, 100),
      getDoctorPrescriptions(1, 100),
    ]).then(([visitRes, rxRes]) => {
      if (cancelled) return;
      setVisits(visitRes.data?.data ?? []);
      setPrescriptions(rxRes.data?.data ?? []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const monthLabels = getLast6Months();
  const chartData = aggregateByMonth(visits, prescriptions, monthLabels);
  const activePrescriptions = prescriptions.filter((p) => p.status === "ACTIVE").length;
  const uniquePatients = new Set(visits.map((v) => v.studentId)).size;
  const recentVisits = [...visits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()).slice(0, 5);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 p-8 text-white shadow-xl shadow-emerald-500/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-green-400/20 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-200" />
              <span className="text-sm font-medium text-emerald-100">Doctor Portal</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome, Doctor!</h1>
            <p className="mt-2 text-emerald-100 max-w-lg">
              Manage your patients, prescriptions, and medical visits from your professional dashboard.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link href="/dashboard/create-visit">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-xl gap-2">
                <Plus className="w-4 h-4" /> New Visit
              </Button>
            </Link>
            <Link href="/dashboard/create-prescription">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-xl gap-2">
                <FileText className="w-4 h-4" /> New Rx
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={uniquePatients}
          icon={<Users className="h-5 w-5" />}
          gradient="from-emerald-500 to-teal-600"
          shadowColor="shadow-emerald-500/25"
          href="/dashboard/patients"
          trend={`${uniquePatients} unique`}
        />
        <StatsCard
          title="Total Visits"
          value={visits.length}
          icon={<CalendarDays className="h-5 w-5" />}
          gradient="from-blue-500 to-cyan-600"
          shadowColor="shadow-blue-500/25"
          href="/dashboard/visits"
          trend={`${visits.length} total`}
        />
        <StatsCard
          title="Total Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-5 w-5" />}
          gradient="from-violet-500 to-purple-600"
          shadowColor="shadow-violet-500/25"
          href="/dashboard/prescriptions"
          trend={`${activePrescriptions} active`}
        />
        <StatsCard
          title="Active Prescriptions"
          value={activePrescriptions}
          icon={<Activity className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-600"
          shadowColor="shadow-amber-500/25"
          href="/dashboard/prescriptions"
          trend={`${activePrescriptions} active`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Visits per Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontSize: "13px", backgroundColor: "#ffffff" }}
                  />
                  <Bar dataKey="visits" name="Visits" fill="url(#doctorVisitGrad)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="doctorVisitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Prescriptions per Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(139, 92, 246, 0.05)" }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontSize: "13px", backgroundColor: "#ffffff" }}
                  />
                  <Bar dataKey="prescriptions" name="Prescriptions" fill="url(#doctorRxGrad)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="doctorRxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Visits */}
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Recent Visits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentVisits.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <CalendarDays className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No visits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentVisits.map((visit, idx) => (
                  <Link
                    key={visit.id}
                    href={`/dashboard/visits/${visit.id}`}
                    className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${idx === 0 ? "bg-emerald-50/30 dark:bg-emerald-900/5" : ""}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <Stethoscope className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {visit.student?.user?.name ?? "Unknown Patient"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {visit.chiefComplaint} &middot;{" "}
                          {new Date(visit.visitDate).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {visit.prescription && (
                        <Badge variant="outline" className="text-[10px] font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700">
                          Rx
                        </Badge>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <Link href="/dashboard/create-visit" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-900/15 dark:to-teal-900/10 border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <CalendarDays className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Create Visit</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Record a new patient visit</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/create-prescription" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50/50 dark:from-violet-900/15 dark:to-purple-900/10 border border-violet-100 dark:border-violet-800/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Create Prescription</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Write a new prescription</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/patients" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50/50 dark:from-blue-900/15 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">My Patients</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">View all your patients</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/dashboard/medicines" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-900/15 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Medicines</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Browse medicine catalog</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  gradient,
  shadowColor,
  href,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  href: string;
  trend: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className={`border-0 shadow-md ${shadowColor} hover:shadow-xl transition-all duration-300 cursor-pointer dark:bg-slate-900 dark:border-slate-800 group-hover:-translate-y-1 overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[80px]`} />
        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-2 tracking-tight">{value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadowColor}`}>
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
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
