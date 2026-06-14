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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-visits" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Visits
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="h-20 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="pt-10">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Visit Record</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{visit.chiefComplaint}</p>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
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

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Chief Complaint
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <p className="text-sm text-slate-800 dark:text-slate-200">{visit.chiefComplaint}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Vitals
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {visit.temperature != null && (
                <VitalCard icon={<Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />} bg="bg-orange-50 dark:bg-orange-950/30" label="Temperature" value={`${visit.temperature}°F`} />
              )}
              {visit.bloodPressure && (
                <VitalCard icon={<Heart className="w-4 h-4 text-red-600 dark:text-red-400" />} bg="bg-red-50 dark:bg-red-950/30" label="Blood Pressure" value={visit.bloodPressure} />
              )}
              {visit.pulseRate != null && (
                <VitalCard icon={<Activity className="w-4 h-4 text-pink-600 dark:text-pink-400" />} bg="bg-pink-50 dark:bg-pink-950/30" label="Pulse Rate" value={`${visit.pulseRate} bpm`} />
              )}
              {visit.weight != null && (
                <VitalCard icon={<Weight className="w-4 h-4 text-blue-600 dark:text-blue-400" />} bg="bg-blue-50 dark:bg-blue-950/30" label="Weight" value={`${visit.weight} kg`} />
              )}
              {!visit.temperature && !visit.bloodPressure && !visit.pulseRate && !visit.weight && (
                <p className="text-sm text-slate-400 dark:text-slate-500 col-span-full text-center py-4">No vitals recorded</p>
              )}
            </div>
            {visit.notes && (
              <div className="mt-5 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/30">
                <p className="text-xs text-violet-400 dark:text-violet-500 mb-0.5">Doctor&apos;s Notes</p>
                <p className="text-sm text-violet-700 dark:text-violet-300">{visit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PersonCard
            icon={<Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            title="Doctor"
            name={doctorName}
            sub={visit.doctor?.specialization ?? "—"}
            detail={visit.doctor?.qualification}
            gradient="from-blue-500 to-indigo-600"
          />
          <PersonCard
            icon={<User className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
            title="Patient"
            name={studentName}
            sub={visit.student?.studentId ?? "—"}
            detail={visit.student?.department ? `${visit.student.department} · ${visit.student.session}` : undefined}
            gradient="from-violet-500 to-purple-600"
          />
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Prescription
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            {visit.prescription ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{visit.prescription.diagnosis}</p>
                    {visit.prescription.advice && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{visit.prescription.advice}</p>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-xs ${visit.prescription.status === "ACTIVE" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}`}>
                    {visit.prescription.status}
                  </Badge>
                </div>
                {visit.prescription.medicines && visit.prescription.medicines.length > 0 && (
                  <div className="space-y-2">
                    {visit.prescription.medicines.map((rxMed) => (
                      <div key={rxMed.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                          <Pill className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{rxMed.medicine?.name ?? "Unknown"}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{rxMed.dosage} · {rxMed.duration} · Qty: {rxMed.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`/dashboard/all-prescriptions/${visit.prescription.id}`}>
                  <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 text-xs mt-2">
                    View Full Prescription
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <Pill className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 dark:text-slate-500">No prescription for this visit</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200 dark:border-slate-700">
            <Link href="/dashboard/all-visits">Back to List</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function VitalCard({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
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
