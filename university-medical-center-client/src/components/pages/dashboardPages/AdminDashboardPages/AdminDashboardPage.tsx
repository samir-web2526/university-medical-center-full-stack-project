"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  CalendarDays, FileText, Users, ArrowRight, TrendingUp, Sparkles,
  Stethoscope, Plus, Pill, Bell, GraduationCap, ClipboardList, AlertTriangle,
  UserPlus, Package,
} from "lucide-react";
import Link from "next/link";
import { getAllDoctors } from "@/services/doctor.service";
import { getAllStudents } from "@/services/student.service";
import { getVisits } from "@/services/visit.service";
import { getAllPrescriptions } from "@/services/prescription.service";
import { getAllMedicines } from "@/services/medicine.service";
import { getAllNotifications } from "@/services/notification.service";
import type { Doctor, Student, Visit, Prescription, Medicine, Notification } from "@/types";

interface MonthData {
  month: string;
  visits: number;
  prescriptions: number;
  newDoctors: number;
  newStudents: number;
}

interface MedicineStockData {
  name: string;
  stock: number;
  minStock: number;
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
  doctors: Doctor[],
  students: Student[],
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

    const docCount = doctors.filter((d) => {
      const dt = new Date(d.createdAt);
      return dt.getMonth() === adjustedMonth && dt.getFullYear() === targetYear;
    }).length;

    const stuCount = students.filter((s) => {
      const dt = new Date(s.createdAt);
      return dt.getMonth() === adjustedMonth && dt.getFullYear() === targetYear;
    }).length;

    return { month: label, visits: visitCount, prescriptions: rxCount, newDoctors: docCount, newStudents: stuCount };
  });
}

function getStockData(medicines: Medicine[]): MedicineStockData[] {
  return medicines.slice(0, 8).map((m) => ({
    name: m.name.length > 10 ? m.name.slice(0, 10) + "…" : m.name,
    stock: m.stockQuantity,
    minStock: m.minimumStock,
  }));
}

function ChartTooltipContent({ active, payload, label, isDark }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; isDark: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        borderRadius: "12px",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        fontSize: "13px",
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#e2e8f0" : "#334155",
        padding: "10px 14px",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: entry.color, margin: 0 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (!theme && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAllDoctors(1, 100),
      getAllStudents(1, 100),
      getVisits(1, 100),
      getAllPrescriptions(1, 100),
      getAllMedicines(1, 100),
      getAllNotifications(1, 20),
    ]).then(([docRes, stuRes, visitRes, rxRes, medRes, notifRes]) => {
      if (cancelled) return;
      setDoctors(docRes.data?.data ?? []);
      setStudents(stuRes.data?.data ?? []);
      setVisits(visitRes.data?.data ?? []);
      setPrescriptions(rxRes.data?.data ?? []);
      setMedicines(medRes.data?.data ?? []);
      setNotifications(notifRes.data?.data ?? []);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const monthLabels = getLast6Months();
  const chartData = aggregateByMonth(visits, prescriptions, doctors, students, monthLabels);

  const activePrescriptions = prescriptions.filter((p) => p.status === "ACTIVE").length;
  const lowStockMedicines = medicines.filter((m) => m.stockQuantity <= m.minimumStock && m.stockQuantity > 0).length;
  const outOfStockMedicines = medicines.filter((m) => m.stockQuantity === 0).length;
  const activeDoctors = doctors.filter((d) => d.user?.status === "ACTIVE").length;
  const activeStudents = students.filter((s) => s.user?.status === "ACTIVE").length;

  const stockData = getStockData(medicines);

  const recentVisits = [...visits]
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    .slice(0, 5);

  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />
        <div className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-200" />
              <span className="text-sm font-medium text-blue-100">Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">University Medical Center</h1>
            <p className="mt-2 text-blue-100 max-w-lg text-sm sm:text-base">
              Manage doctors, students, medicines, prescriptions and monitor the health of your university clinic.
            </p>
          </div>
          <div className="hidden sm:flex gap-3 shrink-0">
            <Link href="/dashboard/create-doctor">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-xl gap-2">
                <UserPlus className="w-4 h-4" /> Add Doctor
              </Button>
            </Link>
            <Link href="/dashboard/create-medicine">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm rounded-xl gap-2">
                <Plus className="w-4 h-4" /> Add Medicine
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Doctors"
          value={doctors.length}
          icon={<Stethoscope className="h-5 w-5" />}
          gradient="from-blue-500 to-indigo-600"
          shadowColor="shadow-blue-500/25"
          href="/dashboard/all-doctors"
          trend={`${activeDoctors} active`}
        />
        <StatsCard
          title="Students"
          value={students.length}
          icon={<GraduationCap className="h-5 w-5" />}
          gradient="from-violet-500 to-purple-600"
          shadowColor="shadow-violet-500/25"
          href="/dashboard/all-students"
          trend={`${activeStudents} active`}
        />
        <StatsCard
          title="Visits"
          value={visits.length}
          icon={<ClipboardList className="h-5 w-5" />}
          gradient="from-emerald-500 to-teal-600"
          shadowColor="shadow-emerald-500/25"
          href="/dashboard/all-visits"
          trend="all time"
        />
        <StatsCard
          title="Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-600"
          shadowColor="shadow-amber-500/25"
          href="/dashboard/all-prescriptions"
          trend={`${activePrescriptions} active`}
        />
        <StatsCard
          title="Medicines"
          value={medicines.length}
          icon={<Pill className="h-5 w-5" />}
          gradient="from-rose-500 to-pink-600"
          shadowColor="shadow-rose-500/25"
          href="/dashboard/all-medicines"
          trend={`${outOfStockMedicines} out of stock`}
        />
        <StatsCard
          title="Notifications"
          value={notifications.length}
          icon={<Bell className="h-5 w-5" />}
          gradient="from-cyan-500 to-sky-600"
          shadowColor="shadow-cyan-500/25"
          href="/dashboard/all-notifications"
          trend={unreadCount > 0 ? `${unreadCount} unread` : "all read"}
        />
      </div>

      {/* Charts Row 1: Visits & Prescriptions */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Visits per Month"
          icon={<CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.05)" }}
                content={<ChartTooltipContent isDark={isDark} />}
              />
              <Bar dataKey="visits" name="Visits" fill="url(#adminVisitGrad)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="adminVisitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Prescriptions per Month"
          icon={<FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
          iconBg="bg-violet-100 dark:bg-violet-900/40"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(139, 92, 246, 0.08)" : "rgba(139, 92, 246, 0.05)" }}
                content={<ChartTooltipContent isDark={isDark} />}
              />
              <Bar dataKey="prescriptions" name="Prescriptions" fill="url(#adminRxGrad)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="adminRxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2: New Registrations & Medicine Stock */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="New Registrations"
          icon={<Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.05)" }}
                content={<ChartTooltipContent isDark={isDark} />}
              />
              <Bar dataKey="newDoctors" name="Doctors" fill="url(#adminDocGrad)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="newStudents" name="Students" fill="url(#adminStuGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="adminDocGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="adminStuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Medicine Stock Overview"
          icon={<Package className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          iconBg="bg-rose-100 dark:bg-rose-900/40"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#f1f5f9"} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(244, 63, 94, 0.08)" : "rgba(244, 63, 94, 0.05)" }}
                content={<ChartTooltipContent isDark={isDark} />}
              />
              <Bar dataKey="stock" name="Current Stock" fill="url(#adminStockGrad)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="minStock" name="Min Required" fill="url(#adminMinStockGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="adminStockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="adminMinStockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Section: Recent Activity + Quick Actions + Alerts */}
      <div className="grid gap-5 lg:grid-cols-3">
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
                  <ClipboardList className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No visits yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentVisits.map((visit, idx) => (
                  <Link
                    key={visit.id}
                    href={`/dashboard/all-visits/${visit.id}`}
                    className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {visit.student?.user?.name ?? "Unknown Patient"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
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

        {/* Quick Actions + Alerts */}
        <div className="space-y-5">
          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <QuickAction href="/dashboard/create-doctor" title="Add Doctor" desc="Register a new doctor" icon={<UserPlus className="w-4 h-4 text-white" />} gradient="from-blue-500 to-indigo-600" shadow="shadow-blue-500/20" bgFrom="from-blue-50" bgTo="to-indigo-50/50" darkBgFrom="dark:from-blue-900/15" darkBgTo="dark:to-indigo-900/10" border="border-blue-100 dark:border-blue-800/30" hoverText="group-hover:text-blue-600 dark:group-hover:text-blue-400" iconHover="group-hover:text-blue-600" />
              <QuickAction href="/dashboard/create-medicine" title="Add Medicine" desc="Add to inventory" icon={<Plus className="w-4 h-4 text-white" />} gradient="from-emerald-500 to-teal-600" shadow="shadow-emerald-500/20" bgFrom="from-emerald-50" bgTo="to-teal-50/50" darkBgFrom="dark:from-emerald-900/15" darkBgTo="dark:to-teal-900/10" border="border-emerald-100 dark:border-emerald-800/30" hoverText="group-hover:text-emerald-600 dark:group-hover:text-emerald-400" iconHover="group-hover:text-emerald-600" />
              <QuickAction href="/dashboard/all-students" title="Manage Students" desc="View all students" icon={<GraduationCap className="w-4 h-4 text-white" />} gradient="from-violet-500 to-purple-600" shadow="shadow-violet-500/20" bgFrom="from-violet-50" bgTo="to-purple-50/50" darkBgFrom="dark:from-violet-900/15" darkBgTo="dark:to-purple-900/10" border="border-violet-100 dark:border-violet-800/30" hoverText="group-hover:text-violet-600 dark:group-hover:text-violet-400" iconHover="group-hover:text-violet-600" />
            </CardContent>
          </Card>

          {(lowStockMedicines > 0 || outOfStockMedicines > 0) && (
            <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {outOfStockMedicines > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">{outOfStockMedicines} out of stock</p>
                      <p className="text-[10px] text-red-500 dark:text-red-400">Needs immediate attention</p>
                    </div>
                  </div>
                )}
                {lowStockMedicines > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{lowStockMedicines} low stock</p>
                      <p className="text-[10px] text-amber-500 dark:text-amber-400">Below minimum threshold</p>
                    </div>
                  </div>
                )}
                <Link href="/dashboard/all-medicines">
                  <Button variant="outline" size="sm" className="w-full border-slate-200 dark:border-slate-700 text-xs gap-1.5 mt-1">
                    <Pill className="w-3.5 h-3.5" /> View Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                Recent Notifications
              </CardTitle>
              <Link href="/dashboard/all-notifications">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-cyan-900/20">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-5 sm:px-6 py-3.5 transition-colors ${notif.isRead ? "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50" : "bg-cyan-50/50 dark:bg-cyan-950/20 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${notif.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatsCard({
  title, value, icon, gradient, shadowColor, href, trend,
}: {
  title: string; value: number; icon: React.ReactNode; gradient: string;
  shadowColor: string; href: string; trend: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className={`border-0 shadow-md ${shadowColor} hover:shadow-xl transition-all duration-300 cursor-pointer dark:bg-slate-900 dark:border-slate-800 group-hover:-translate-y-1 overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[80px]`} />
        <CardContent className="p-4 sm:p-5 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1.5 sm:mt-2 tracking-tight">{value}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 sm:mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadowColor}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ChartCard({
  title, icon, iconBg, children,
}: {
  title: string; icon: React.ReactNode; iconBg: string; children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">{children}</CardContent>
    </Card>
  );
}

function QuickAction({
  href, title, desc, icon, gradient, shadow, bgFrom, bgTo, darkBgFrom, darkBgTo, border, hoverText, iconHover,
}: {
  href: string; title: string; desc: string; icon: React.ReactNode; gradient: string;
  shadow: string; bgFrom: string; bgTo: string; darkBgFrom: string; darkBgTo: string;
  border: string; hoverText: string; iconHover: string;
}) {
  return (
    <Link href={href} className="block">
      <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${bgFrom} ${bgTo} ${darkBgFrom} ${darkBgTo} ${border} border hover:shadow-md transition-all cursor-pointer group`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md ${shadow}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-slate-800 dark:text-slate-100 ${hoverText} transition-colors`}>{title}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</p>
        </div>
        <ArrowRight className={`w-4 h-4 text-slate-400 ${iconHover} group-hover:translate-x-1 transition-all`} />
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
