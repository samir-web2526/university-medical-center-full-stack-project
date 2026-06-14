"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Mail, ShieldCheck, Calendar,
  Stethoscope, Activity, ArrowRight,
} from "lucide-react";

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

async function fetchAdminProfile(): Promise<AdminProfile | null> {
  return null;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <AdminProfileSkeleton />;

  const name = profile?.name ?? "Administrator";
  const email = profile?.email ?? "admin@clinic.com";
  const status = profile?.status ?? "ACTIVE";
  const createdAt = profile?.createdAt ?? new Date().toISOString();

  const stats = [
    { label: "Role", value: "Admin", icon: ShieldCheck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Status", value: status, icon: Activity, color: status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400", bg: status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30" },
    { label: "Email", value: email, icon: Mail, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Member Since", value: new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }), icon: Calendar, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-slate-800 via-slate-700 to-blue-700" />
          <CardContent className="relative pb-6 px-6 pt-0">
            <div className="absolute -top-9 left-6 w-18 h-18">
              <div className="w-18 h-18 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-800 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700 dark:text-slate-300">{name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="pt-12 flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" />System Administrator
                </p>
              </div>
              <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />Account Details
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-2 space-y-0">
            {stats.map((s, i) => (
              <div key={s.label}>
                <div className="flex items-center gap-4 py-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">{s.label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{s.value}</p>
                  </div>
                </div>
                {i < stats.length - 1 && <Separator className="ml-12 dark:bg-slate-800" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />Permissions
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-4 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "Manage Doctors", href: "/dashboard/all-doctors" },
                { label: "Manage Students", href: "/dashboard/all-students" },
                { label: "Manage Medicines", href: "/dashboard/all-medicines" },
                { label: "View All Prescriptions", href: "/dashboard/all-prescriptions" },
                { label: "View All Visits", href: "/dashboard/all-visits" },
                { label: "Manage Notifications", href: "/dashboard/all-notifications" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors group"
                >
                  <span>{p.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <Skeleton className="h-24 w-full rounded-none" />
          <CardContent className="pt-14 pb-6 space-y-2">
            <Skeleton className="h-5 w-36" /><Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
