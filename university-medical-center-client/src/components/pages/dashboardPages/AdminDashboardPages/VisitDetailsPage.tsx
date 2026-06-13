"use client";

import type { Visit } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, ClipboardList, User, Stethoscope,
  Calendar, Thermometer, Heart, Activity, Weight,
  FileText, Pill,
} from "lucide-react";
import Link from "next/link";

export default function VisitDetailsPage({ visit }: { visit: Visit }) {
  const studentName = visit.student?.user?.name ?? "Unknown";
  const doctorName = visit.doctor?.user?.name ?? "Unknown";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/all-visits"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Visits
        </Link>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-blue-600" />
            </div>
            <div className="pt-10">
              <h1 className="text-xl font-bold text-slate-900">Visit Record</h1>
              <p className="text-sm text-slate-500 mt-0.5">{visit.chiefComplaint}</p>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(visit.visitDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                ID: {visit.id.slice(0, 8)}...
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Chief Complaint
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <p className="text-sm text-slate-800">{visit.chiefComplaint}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" /> Vitals
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {visit.temperature != null && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Thermometer className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Temperature</p>
                    <p className="text-sm font-medium text-slate-700">{visit.temperature}°F</p>
                  </div>
                </div>
              )}
              {visit.bloodPressure && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Blood Pressure</p>
                    <p className="text-sm font-medium text-slate-700">{visit.bloodPressure}</p>
                  </div>
                </div>
              )}
              {visit.pulseRate != null && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Pulse Rate</p>
                    <p className="text-sm font-medium text-slate-700">{visit.pulseRate} bpm</p>
                  </div>
                </div>
              )}
              {visit.weight != null && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Weight className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Weight</p>
                    <p className="text-sm font-medium text-slate-700">{visit.weight} kg</p>
                  </div>
                </div>
              )}
              {!visit.temperature && !visit.bloodPressure && !visit.pulseRate && !visit.weight && (
                <p className="text-sm text-slate-400 col-span-full text-center py-4">No vitals recorded</p>
              )}
            </div>
            {visit.notes && (
              <div className="mt-5 p-3 rounded-lg bg-violet-50 border border-violet-100">
                <p className="text-xs text-violet-400 mb-0.5">Doctor&apos;s Notes</p>
                <p className="text-sm text-violet-700">{visit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Doctor
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-blue-600">{doctorName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{doctorName}</p>
                  <p className="text-xs text-slate-400">{visit.doctor?.specialization ?? "—"}</p>
                </div>
              </div>
              {visit.doctor?.qualification && (
                <p className="text-xs text-slate-500">{visit.doctor.qualification}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" /> Patient
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-600">{studentName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{studentName}</p>
                  <p className="text-xs text-slate-400 font-mono">{visit.student?.studentId ?? "—"}</p>
                </div>
              </div>
              {visit.student?.department && (
                <p className="text-xs text-slate-500">{visit.student.department} · {visit.student.session}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" /> Prescription
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            {visit.prescription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-800">{visit.prescription.diagnosis}</p>
                    {visit.prescription.advice && (
                      <p className="text-xs text-slate-500 mt-0.5">{visit.prescription.advice}</p>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-xs ${visit.prescription.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {visit.prescription.status}
                  </Badge>
                </div>
                {visit.prescription.medicines && visit.prescription.medicines.length > 0 && (
                  <div className="space-y-2">
                    {visit.prescription.medicines.map((rxMed) => (
                      <div key={rxMed.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center shrink-0">
                          <Pill className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800">{rxMed.medicine?.name ?? "Unknown"}</p>
                          <p className="text-[10px] text-slate-400">{rxMed.dosage} · {rxMed.duration} · Qty: {rxMed.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`/dashboard/all-prescriptions/${visit.prescription.id}`}>
                  <Button variant="outline" size="sm" className="border-slate-200 text-xs mt-2">
                    View Full Prescription
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No prescription for this visit</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200">
            <Link href="/dashboard/all-visits">Back to List</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
