"use client";

import type { Prescription } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, FileText, User, Stethoscope,
  Calendar, Pill, Clock,
  Thermometer, Activity, Weight,
  ClipboardList, Ban,
} from "lucide-react";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function PrescriptionDetailsPage({ prescription }: { prescription: Prescription }) {
  const studentName = prescription.student?.user?.name ?? "Unknown";
  const doctorName = prescription.doctor?.user?.name ?? "Unknown";
  const visit = prescription.visit;
  const medicines = prescription.medicines ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/all-prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prescriptions
        </Link>

        {/* Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className={`h-20 bg-gradient-to-r ${prescription.status === "CANCELLED" ? "from-red-500 via-red-400 to-orange-400" : "from-emerald-500 via-teal-500 to-blue-500"}`} />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <FileText className={`w-7 h-7 ${prescription.status === "CANCELLED" ? "text-red-500" : "text-emerald-600"}`} />
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Prescription</h1>
                <p className="text-sm text-slate-500 mt-0.5">{prescription.diagnosis}</p>
              </div>
              <Badge variant="outline" className={`text-xs ${statusStyles[prescription.status] ?? "bg-slate-100 text-slate-500"}`}>
                {prescription.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(prescription.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                ID: {prescription.id.slice(0, 8)}...
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cancel Reason */}
        {prescription.status === "CANCELLED" && prescription.cancelReason && (
          <Card className="border-0 shadow-md border-l-4 border-l-red-500">
            <CardContent className="py-4 px-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Ban className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-red-400 font-medium uppercase tracking-wider">Cancellation Reason</p>
                  <p className="text-sm text-red-700 mt-0.5">{prescription.cancelReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis & Advice */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" /> Diagnosis & Advice
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Diagnosis</p>
              <p className="text-sm text-slate-800">{prescription.diagnosis}</p>
            </div>
            {prescription.advice && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Advice</p>
                <p className="text-sm text-slate-800">{prescription.advice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600" /> Medicines ({medicines.length})
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            {medicines.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No medicines prescribed</p>
            ) : (
              <div className="space-y-3">
                {medicines.map((rxMed, idx) => (
                  <div key={rxMed.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{rxMed.medicine?.name ?? "Unknown"}</p>
                        {rxMed.medicine?.genericName && (
                          <span className="text-xs text-slate-400">({rxMed.medicine.genericName})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Pill className="w-3 h-3" /> {rxMed.dosage}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rxMed.duration}
                        </span>
                        <span>Qty: {rxMed.quantity}</span>
                      </div>
                      {rxMed.instructions && (
                        <p className="text-xs text-slate-400 mt-1 italic">{rxMed.instructions}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit Details */}
        {visit && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-violet-600" /> Visit Details
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">Chief Complaint</p>
                <p className="text-sm text-slate-800">{visit.chiefComplaint}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {visit.temperature != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Temp</p>
                      <p className="text-xs font-medium text-slate-700">{visit.temperature}°F</p>
                    </div>
                  </div>
                )}
                {visit.bloodPressure && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">BP</p>
                      <p className="text-xs font-medium text-slate-700">{visit.bloodPressure}</p>
                    </div>
                  </div>
                )}
                {visit.pulseRate != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Pulse</p>
                      <p className="text-xs font-medium text-slate-700">{visit.pulseRate} bpm</p>
                    </div>
                  </div>
                )}
                {visit.weight != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Weight className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Weight</p>
                      <p className="text-xs font-medium text-slate-700">{visit.weight} kg</p>
                    </div>
                  </div>
                )}
              </div>
              {visit.notes && (
                <div className="mt-4 p-3 rounded-lg bg-violet-50 border border-violet-100">
                  <p className="text-xs text-violet-400 mb-0.5">Doctor&apos;s Notes</p>
                  <p className="text-sm text-violet-700">{visit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Doctor */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Doctor
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">{doctorName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{doctorName}</p>
                  <p className="text-xs text-slate-400">{prescription.doctor?.specialization ?? "—"}</p>
                </div>
              </div>
              {prescription.doctor?.qualification && (
                <p className="text-xs text-slate-500">{prescription.doctor.qualification}</p>
              )}
            </CardContent>
          </Card>

          {/* Student */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" /> Patient
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-violet-600">{studentName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{studentName}</p>
                  <p className="text-xs text-slate-400 font-mono">{prescription.student?.studentId ?? "—"}</p>
                </div>
              </div>
              {prescription.student?.department && (
                <p className="text-xs text-slate-500">{prescription.student.department} · {prescription.student.session}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200">
            <Link href="/dashboard/all-prescriptions">Back to List</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
