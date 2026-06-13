"use client";

import type { Prescription } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pill, User, Stethoscope, Calendar } from "lucide-react";
import Link from "next/link";

export default function StudentPrescriptionDetailsPage({ prescription }: { prescription: Prescription }) {
  const doctorName = prescription.doctor?.user?.name ?? "Unknown";
  const studentName = prescription.student?.user?.name ?? "Unknown";

  const statusColor =
    prescription.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prescriptions
        </Link>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <Pill className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="pt-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Prescription</h1>
                <p className="text-sm text-slate-500">Prescription ID: {prescription.id}</p>
              </div>
              <Badge variant="outline" className={`text-xs ${statusColor}`}>
                {prescription.status}
              </Badge>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" /> Doctor
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-emerald-600">{doctorName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{doctorName}</p>
                  <p className="text-xs text-slate-400">{prescription.doctor?.specialization ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" /> Patient
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-600">{studentName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{studentName}</p>
                  <p className="text-xs text-slate-400 font-mono">{prescription.student?.studentId ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" /> Diagnosis & Advice
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-3">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wide">Diagnosis</p>
              <p className="text-sm font-medium text-slate-800">{prescription.diagnosis}</p>
            </div>
            {prescription.advice && (
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Advice</p>
                <p className="text-sm text-slate-700">{prescription.advice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {prescription.medicines && prescription.medicines.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" /> Medicines
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              {prescription.medicines.map((rxMed) => (
                <div key={rxMed.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{rxMed.medicine?.name ?? "Unknown"}</p>
                      {rxMed.medicine?.genericName && (
                        <p className="text-[10px] text-slate-400">Generic: {rxMed.medicine.genericName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-md p-1.5 border border-slate-100">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide">Dosage</p>
                      <p className="text-xs font-medium text-emerald-700">{rxMed.dosage}</p>
                    </div>
                    <div className="bg-white rounded-md p-1.5 border border-slate-100">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide">Duration</p>
                      <p className="text-xs font-medium text-blue-700">{rxMed.duration}</p>
                    </div>
                    <div className="bg-white rounded-md p-1.5 border border-slate-100">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide">Quantity</p>
                      <p className="text-xs font-medium text-violet-700">{rxMed.quantity}</p>
                    </div>
                  </div>
                  {rxMed.instructions && (
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-1.5">
                      <p className="text-[9px] text-amber-500 uppercase tracking-wide">Instructions</p>
                      <p className="text-xs text-amber-700">{rxMed.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
