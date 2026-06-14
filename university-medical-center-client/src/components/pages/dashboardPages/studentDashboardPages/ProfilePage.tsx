"use client";

import { useEffect, useState } from "react";
import type { Student } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Mail, Phone, GraduationCap, Calendar, Edit, ShieldCheck, Droplets,
} from "lucide-react";
import Link from "next/link";
import { getMyProfile } from "@/services/student.service";

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile().then(({ data, error }) => {
      if (error) setError(error);
      else setStudent(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  if (!student) return null;

  const userName = student.user?.name ?? "Unknown";
  const userEmail = student.user?.email ?? "—";
  const userStatus = student.user?.status ?? "UNKNOWN";

  const statusColor =
    userStatus === "ACTIVE"
      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";

  const fields = [
    { icon: Mail, label: "Email", value: userEmail, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    { icon: Phone, label: "Phone", value: student.user?.phone ?? "Not provided", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
    { icon: GraduationCap, label: "Student ID", value: student.studentId, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
    { icon: User, label: "Department", value: student.department, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
    { icon: Calendar, label: "Session", value: student.session, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
    { icon: User, label: "Gender", value: student.gender ? student.gender.charAt(0) + student.gender.slice(1).toLowerCase() : "Not provided", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/30" },
    { icon: Droplets, label: "Blood Group", value: student.bloodGroup?.replace("_", " ") ?? "Not provided", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
    {
      icon: Calendar,
      label: "Member Since",
      value: new Date(student.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      }),
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="overflow-hidden border-0 shadow-xl dark:bg-slate-900 dark:border-slate-800">
          <div className="relative h-40 bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTM2IDIwdjJIMnYyaDM0ek0zNiA2djJIMnYyaDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />
          </div>

          <CardContent className="relative px-6 pb-6">
            <div className="absolute -top-14 left-6">
              <div className="w-28 h-28 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center ring-4 ring-violet-100 dark:ring-violet-900/50">
                <span className="text-4xl font-bold bg-linear-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button asChild size="sm" className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl gap-2 shadow-lg shadow-violet-500/25">
                <Link href="/dashboard/update-profile">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{userName}</h1>
                <Badge className={`text-xs font-medium border ${statusColor}`} variant="outline">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {userStatus}
                </Badge>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">ID</span>
                </span>
                {student.studentId}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Profile Details
            </h2>
          </CardHeader>
          <CardContent className="pt-2 pb-4 space-y-0">
            {fields.map((field, i) => (
              <div key={field.label}>
                <div className="flex items-center gap-4 py-4 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${field.bg} flex items-center justify-center shrink-0`}>
                    <field.icon className={`w-4.5 h-4.5 ${field.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                      {field.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">{field.value}</p>
                  </div>
                </div>
                {i < fields.length - 1 && <Separator className="mx-6 dark:bg-slate-800" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-0 shadow-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          <Skeleton className="h-40 w-full rounded-none" />
          <CardContent className="pt-4 pb-6 px-6 space-y-3">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
