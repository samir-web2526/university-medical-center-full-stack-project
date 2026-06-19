"use client";

import { useEffect, useState } from "react";
import type { Student } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Mail, Phone, GraduationCap, Calendar, Edit, ShieldCheck, Droplets, Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    { icon: User, label: "Present Address", value: student.presentAddress ?? "Not provided", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
    { icon: User, label: "Permanent Address", value: student.permanentAddress ?? "Not provided", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
    { icon: Phone, label: "Guardian Number", value: student.guardianNumber ?? "Not provided", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
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
        <div className="rounded-2xl bg-linear-to-r from-violet-600 via-purple-500 to-indigo-500 p-6 shadow-lg shadow-violet-500/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          <p className="text-violet-100 text-sm ml-13">View your personal details</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-xl dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="relative px-6 pt-6 pb-6">
            <div className="flex flex-col items-center relative z-10">
              {student.imageUrl ? (
                <div className="relative group">
                  <Image
                    src={student.imageUrl}
                    alt={userName}
                    width={112}
                    height={112}
                    unoptimized
                    className="w-28 h-28 rounded-full object-cover shadow-2xl border-4 border-white dark:border-slate-900 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full ring-2 ring-violet-400/50 dark:ring-violet-500/30 ring-offset-4 ring-offset-white dark:ring-offset-slate-900" />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-linear-to-br from-violet-500 to-purple-600 shadow-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="mt-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{userName}</h1>
                  <Badge className={`text-xs font-medium border ${statusColor}`} variant="outline">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {userStatus}
                  </Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-violet-500" />
                  {student.department}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-mono tracking-wider">
                  ID: {student.studentId}
                </p>
              </div>

              <Button asChild size="sm" className="mt-5 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl gap-2 shadow-lg shadow-violet-500/25 px-6">
                <Link href="/dashboard/update-profile">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Link>
              </Button>
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
          <Skeleton className="h-32 w-full rounded-none" />
          <CardContent className="pt-0 pb-6 px-6 flex flex-col items-center -mt-12">
            <Skeleton className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900" />
            <Skeleton className="h-6 w-48 mt-4" />
            <Skeleton className="h-4 w-36 mt-2" />
            <Skeleton className="h-8 w-28 mt-5 rounded-xl" />
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
