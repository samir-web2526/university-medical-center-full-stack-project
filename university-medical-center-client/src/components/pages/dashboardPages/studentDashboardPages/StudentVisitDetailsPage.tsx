"use client";

import type { Visit } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft, ClipboardList, Stethoscope, Calendar, Thermometer,
  Heart, Activity, Weight, FileText, Pill
} from "lucide-react";
import Link from "next/link";

export default function StudentVisitDetailsPage({ visit }: { visit: Visit }) {
  const doctorName = visit.doctor?.user?.name ?? "Unknown";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/visits"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Visits
        </Link>

        <Card className="border-0 shadow-xl dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="relative h-28 bg-linear-to-br from-violet-600 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTM2IDIwdjJIMnYyaDM0ek0zNiA2djJIMnYyaDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </div>
          <CardContent className="relative px-6 pb-6 pt-0">
            <div className="absolute -top-8 left-6">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center ring-4 ring-violet-100 dark:ring-violet-900/50">
                <ClipboardList className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <div className="pt-12">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Visit Record</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{visit.id}</p>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3 h-3" />
                {new Date(visit.visitDate).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              Chief Complaint
            </h2>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{visit.chiefComplaint}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </div>
              Vitals
            </h2>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {visit.temperature != null && (
                <div className="p-3 rounded-xl bg-linear-to-br from-orange-50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/10 border border-orange-100 dark:border-orange-800/30">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/10 flex items-center justify-center mb-2">
                    <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Temperature</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{visit.temperature}°F</p>
                </div>
              )}
              {visit.bloodPressure && (
                <div className="p-3 rounded-xl bg-linear-to-br from-red-50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/10 border border-red-100 dark:border-red-800/30">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/10 flex items-center justify-center mb-2">
                    <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Blood Pressure</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{visit.bloodPressure}</p>
                </div>
              )}
              {visit.pulseRate != null && (
                <div className="p-3 rounded-xl bg-linear-to-br from-pink-50 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/10 border border-pink-100 dark:border-pink-800/30">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/10 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pulse Rate</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{visit.pulseRate} bpm</p>
                </div>
              )}
              {visit.weight != null && (
                <div className="p-3 rounded-xl bg-linear-to-br from-blue-50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/30">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/10 flex items-center justify-center mb-2">
                    <Weight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Weight</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{visit.weight} kg</p>
                </div>
              )}
              {!visit.temperature && !visit.bloodPressure && !visit.pulseRate && !visit.weight && (
                <p className="text-sm text-slate-400 dark:text-slate-500 col-span-full text-center py-6">No vitals recorded</p>
              )}
            </div>
            {visit.notes && (
              <div className="mt-5 p-4 rounded-xl bg-linear-to-r from-violet-50 to-purple-50/50 dark:from-violet-900/15 dark:to-purple-900/10 border border-violet-100 dark:border-violet-800/30">
                <p className="text-[10px] text-violet-400 dark:text-violet-500 uppercase tracking-wider font-medium mb-1">Doctor&apos;s Notes</p>
                <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">{visit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/10 flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </div>
              Doctor
            </h2>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <span className="text-sm font-bold text-white">{doctorName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{doctorName}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{visit.doctor?.specialization ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescription */}
        {visit.prescription && visit.prescription.status === "ACTIVE" && (
          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Prescription
              </h2>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-1">Diagnosis</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{visit.prescription.diagnosis}</p>
              </div>
              {visit.prescription.advice && (
                <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/50">
                  <p className="text-[10px] text-violet-400 dark:text-violet-500 uppercase tracking-wider font-medium mb-1">Advice</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{visit.prescription.advice}</p>
                </div>
              )}
              {visit.prescription.medicines && visit.prescription.medicines.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Medicines</p>
                  {visit.prescription.medicines.map((rxMed) => (
                    <div key={rxMed.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                        <Pill className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{rxMed.medicine?.name ?? "Unknown"}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{rxMed.dosage} · {rxMed.duration} · Qty: {rxMed.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
