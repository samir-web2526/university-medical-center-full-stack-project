"use client";

import { useEffect, useState } from "react";
import type { Doctor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  GraduationCap,
  Calendar,
  Edit,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMyProfile } from "@/services/doctor.service";

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile().then(({ data, error }) => {
      if (error) setError(error);
      else setDoctor(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh] dark:bg-slate-950">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  if (!doctor) return null;

  const statusColor =
    doctor.user?.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";

  const fields = [
    { icon: Mail, label: "Email", value: doctor.user?.email ?? "—" },
    { icon: Phone, label: "Phone", value: doctor.user?.phone ?? "Not provided" },
    { icon: Stethoscope, label: "Specialization", value: doctor.specialization },
    { icon: GraduationCap, label: "Qualification", value: doctor.qualification },
    { icon: ShieldCheck, label: "BMDC Number", value: doctor.bmdcRegistrationNumber || "Not provided" },
    {
      icon: Calendar,
      label: "Member Since",
      value: new Date(doctor.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-2xl bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>
          <p className="text-emerald-100 text-sm ml-13">View your professional details</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="relative pt-6 pb-6 px-6">
            <div className="flex flex-col items-center">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.user?.name ?? "Doctor"}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-900"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {(doctor.user?.name ?? "D").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="mt-4 text-center space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{doctor.user?.name ?? "Unknown"}</h1>
                  <Badge className={`text-xs font-medium border ${statusColor}`} variant="outline">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {doctor.user?.status ?? "UNKNOWN"}
                  </Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                  {doctor.specialization}
                </p>
              </div>

              <Button asChild size="sm" className="mt-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl gap-2 shadow-md shadow-emerald-500/20 transition-all duration-200">
                <Link href="/dashboard/update-profile">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Profile Details
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-0">
            {fields.map((field, i) => (
              <div key={field.label}>
                <div className="flex items-center gap-4 py-3.5 group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <field.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{field.value}</p>
                  </div>
                </div>
                {i < fields.length - 1 && <Separator className="ml-13 dark:bg-slate-800" />}
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
        <Skeleton className="h-20 w-full rounded-2xl dark:bg-slate-800" />
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <Skeleton className="h-28 w-full rounded-none dark:bg-slate-800" />
          <CardContent className="pt-4 pb-6 px-6 space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl dark:bg-slate-800" />
            <Skeleton className="h-6 w-48 dark:bg-slate-800" />
            <Skeleton className="h-4 w-32 dark:bg-slate-800" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg dark:bg-slate-800" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
