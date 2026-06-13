"use client";

// Admin profile page — displays logged-in admin's info pulled from JWT/session context.
// Replace `useAdminProfile` with your actual auth hook or server action.

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

// TODO: replace with your actual action/hook
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

  // Fallback display if profile is null (replace with real data)
  const name = profile?.name ?? "Administrator";
  const email = profile?.email ?? "admin@clinic.com";
  const status = profile?.status ?? "ACTIVE";
  const createdAt = profile?.createdAt ?? new Date().toISOString();

  const stats = [
    { label: "Role", value: "Admin", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Status", value: status, icon: Activity, color: status === "ACTIVE" ? "text-emerald-600" : "text-red-600", bg: status === "ACTIVE" ? "bg-emerald-50" : "bg-red-50" },
    { label: "Email", value: email, icon: Mail, color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Member Since", value: new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }), icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-slate-800 via-slate-700 to-blue-700" />
          <CardContent className="relative pb-6 px-6 pt-0">
            <div className="absolute -top-9 left-6 w-18 h-18">
              <div className="w-[72px] h-[72px] rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">{name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="pt-12 flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5" />System Administrator
                </p>
              </div>
              <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />Account Details
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-2 space-y-0">
            {stats.map((s, i) => (
              <div key={s.label}>
                <div className="flex items-center gap-4 py-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
                    <p className="text-sm font-medium text-slate-800">{s.value}</p>
                  </div>
                </div>
                {i < stats.length - 1 && <Separator className="ml-12" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />Permissions
            </h2>
          </CardHeader>
          <Separator />
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
                  className="flex items-center justify-between text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors group"
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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-0 shadow-md overflow-hidden">
          <Skeleton className="h-24 w-full rounded-none" />
          <CardContent className="pt-14 pb-6 space-y-2">
            <Skeleton className="h-5 w-36" /><Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}