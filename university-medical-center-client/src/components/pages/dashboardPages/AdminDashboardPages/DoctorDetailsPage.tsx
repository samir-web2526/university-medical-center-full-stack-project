"use client";

import type { Doctor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Mail, Phone, User,
  Stethoscope, GraduationCap, ShieldCheck, Calendar,
} from "lucide-react";
import Link from "next/link";

export default function DoctorDetailsPage({ doctor }: { doctor: Doctor }) {
  const name = doctor.user?.name ?? doctor.name ?? "Unknown";
  const email = doctor.user?.email ?? doctor.email ?? "—";
  const status = doctor.user?.status ?? doctor.status;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/dashboard/all-doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        {/* Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dr. {name}</h1>
                <p className="text-sm text-slate-500">{doctor.specialization}</p>
              </div>
              <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(doctor.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Doctor Information</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="text-sm font-medium text-slate-800">{name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-800">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Contact</p>
                  <p className="text-sm font-medium text-slate-800">{doctor.contactNumber ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Specialization</p>
                  <p className="text-sm font-medium text-slate-800">{doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Qualification</p>
                  <p className="text-sm font-medium text-slate-800">{doctor.qualification}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Joined</p>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(doctor.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200">
            <Link href="/admin/dashboard/all-doctors">Back to List</Link>
          </Button>
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Link href={`/admin/dashboard/manage-doctors/${doctor.id}`}>Edit Doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
