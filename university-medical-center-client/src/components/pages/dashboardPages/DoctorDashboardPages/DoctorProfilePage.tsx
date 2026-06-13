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
} from "lucide-react";
import Link from "next/link";
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  if (!doctor) return null;

  const statusColor =
    doctor.user?.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";

  const fields = [
    { icon: Mail, label: "Email", value: doctor.user?.email ?? "—" },
    { icon: Phone, label: "Phone", value: doctor.user?.phone ?? "Not provided" },
    { icon: Stethoscope, label: "Specialization", value: doctor.specialization },
    { icon: GraduationCap, label: "Qualification", value: doctor.qualification },
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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-28 bg-linear-to-r from-blue-600 via-blue-500 to-emerald-500" />

          <CardContent className="relative pt-0 pb-6 px-6">
            <div className="absolute -top-10 left-6">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {(doctor.user?.name ?? "D").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-lg gap-2">
                <Link href="/dashboard/update-profile">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{doctor.user?.name ?? "Unknown"}</h1>
                <Badge className={`text-xs font-medium border ${statusColor}`} variant="outline">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {doctor.user?.status ?? "UNKNOWN"}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm">{doctor.specialization}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Profile Details
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-0">
            {fields.map((field, i) => (
              <div key={field.label}>
                <div className="flex items-center gap-4 py-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <field.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-slate-800 truncate">{field.value}</p>
                  </div>
                </div>
                {i < fields.length - 1 && <Separator className="ml-12" />}
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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-0 shadow-md overflow-hidden">
          <Skeleton className="h-28 w-full rounded-none" />
          <CardContent className="pt-4 pb-6 px-6 space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}