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
  ACTIVE: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  CANCELLED: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function PrescriptionDetailsPage({ prescription }: { prescription: Prescription }) {
  const studentName = prescription.student?.user?.name ?? "Unknown";
  const doctorName = prescription.doctor?.user?.name ?? "Unknown";
  const visit = prescription.visit;
  const medicines = prescription.medicines ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-prescriptions" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Prescriptions
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className={`h-20 bg-linear-to-r ${prescription.status === "CANCELLED" ? "from-red-500 via-red-400 to-orange-400" : "from-emerald-500 via-teal-500 to-blue-500"}`} />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <FileText className={`w-7 h-7 ${prescription.status === "CANCELLED" ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`} />
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Prescription</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{prescription.diagnosis}</p>
              </div>
              <Badge variant="outline" className={`text-xs ${statusStyles[prescription.status] ?? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                {prescription.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
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

        {prescription.status === "CANCELLED" && prescription.cancelReason && (
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
            <CardContent className="py-4 px-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-red-400 dark:text-red-500 font-medium uppercase tracking-wider">Cancellation Reason</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">{prescription.cancelReason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Diagnosis & Advice
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Diagnosis</p>
              <p className="text-sm text-slate-800 dark:text-slate-200">{prescription.diagnosis}</p>
            </div>
            {prescription.advice && (
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Advice</p>
                <p className="text-sm text-slate-800 dark:text-slate-200">{prescription.advice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Medicines ({medicines.length})
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            {medicines.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No medicines prescribed</p>
            ) : (
              <div className="space-y-3">
                {medicines.map((rxMed, idx) => (
                  <div key={rxMed.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
                      <span className="text-xs font-bold text-white">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rxMed.medicine?.name ?? "Unknown"}</p>
                        {rxMed.medicine?.genericName && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">({rxMed.medicine.genericName})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Pill className="w-3 h-3" /> {rxMed.dosage}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rxMed.duration}
                        </span>
                        <span>Qty: {rxMed.quantity}</span>
                      </div>
                      {rxMed.instructions && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{rxMed.instructions}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {visit && (
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Visit Details
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5">
              <div className="mb-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Chief Complaint</p>
                <p className="text-sm text-slate-800 dark:text-slate-200">{visit.chiefComplaint}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {visit.temperature != null && (
                  <VitalItem icon={<Thermometer className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />} bg="bg-orange-50 dark:bg-orange-950/30" label="Temp" value={`${visit.temperature}°F`} />
                )}
                {visit.bloodPressure && (
                  <VitalItem icon={<Activity className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />} bg="bg-red-50 dark:bg-red-950/30" label="BP" value={visit.bloodPressure} />
                )}
                {visit.pulseRate != null && (
                  <VitalItem icon={<Activity className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />} bg="bg-pink-50 dark:bg-pink-950/30" label="Pulse" value={`${visit.pulseRate} bpm`} />
                )}
                {visit.weight != null && (
                  <VitalItem icon={<Weight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />} bg="bg-blue-50 dark:bg-blue-950/30" label="Weight" value={`${visit.weight} kg`} />
                )}
              </div>
              {visit.notes && (
                <div className="mt-4 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/30">
                  <p className="text-xs text-violet-400 dark:text-violet-500 mb-0.5">Doctor&apos;s Notes</p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">{visit.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PersonCard
            icon={<Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            title="Doctor"
            name={doctorName}
            sub={prescription.doctor?.specialization ?? "—"}
            detail={prescription.doctor?.qualification}
            gradient="from-blue-500 to-indigo-600"
          />
          <PersonCard
            icon={<User className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
            title="Patient"
            name={studentName}
            sub={prescription.student?.studentId ?? "—"}
            detail={prescription.student?.department ? `${prescription.student.department} · ${prescription.student.session}` : undefined}
            gradient="from-violet-500 to-purple-600"
          />
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200 dark:border-slate-700">
            <Link href="/dashboard/all-prescriptions">Back to List</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function VitalItem({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{value}</p>
      </div>
    </div>
  );
}

function PersonCard({ icon, title, name, sub, detail, gradient }: {
  icon: React.ReactNode; title: string; name: string; sub: string; detail?: string; gradient: string;
}) {
  return (
    <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
      <CardHeader className="pb-3">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          {icon} {title}
        </h2>
      </CardHeader>
      <Separator className="dark:bg-slate-800" />
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
            <span className="text-sm font-bold text-white">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
          </div>
        </div>
        {detail && <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>}
      </CardContent>
    </Card>
  );
}
