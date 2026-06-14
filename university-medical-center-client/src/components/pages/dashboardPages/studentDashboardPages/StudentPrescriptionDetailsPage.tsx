"use client";

import type { Prescription } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pill, User, Stethoscope, Calendar, Image as ImageIcon, ZoomIn} from "lucide-react";
import Link from "next/link";

export default function StudentPrescriptionDetailsPage({ prescription }: { prescription: Prescription }) {
  const doctorName = prescription.doctor?.user?.name ?? "Unknown";
  const studentName = prescription.student?.user?.name ?? "Unknown";

  const statusColor =
    prescription.status === "ACTIVE"
      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
      : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Prescriptions
        </Link>

        <Card className="border-0 shadow-xl dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="relative h-28 bg-linear-to-br from-emerald-500 via-teal-500 to-green-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTM2IDIwdjJIMnYyaDM0ek0zNiA2djJIMnYyaDM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </div>
          <CardContent className="relative px-6 pb-6 pt-0">
            <div className="absolute -top-8 left-6">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center ring-4 ring-emerald-100 dark:ring-emerald-900/50">
                <Pill className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="pt-12 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Prescription</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{prescription.id}</p>
              </div>
              <Badge variant="outline" className={`text-xs font-medium rounded-lg ${statusColor}`}>
                {prescription.status}
              </Badge>
            </div>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Doctor
              </h2>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <span className="text-sm font-bold text-white">{doctorName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{doctorName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{prescription.doctor?.specialization ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                </div>
                Patient
              </h2>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                  <span className="text-sm font-bold text-white">{studentName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{studentName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{prescription.student?.studentId ?? "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Diagnosis & Advice
            </h2>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-1">Diagnosis</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{prescription.diagnosis}</p>
            </div>
            {prescription.advice && (
              <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/50">
                <p className="text-[10px] text-violet-400 dark:text-violet-500 uppercase tracking-wider font-medium mb-1">Advice</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{prescription.advice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {prescription.medicines && prescription.medicines.length > 0 && (
          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Medicines
                <Badge variant="outline" className="ml-auto text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                  {prescription.medicines.length}
                </Badge>
              </h2>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {prescription.medicines.map((rxMed) => (
                <div key={rxMed.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{rxMed.medicine?.name ?? "Unknown"}</p>
                      {rxMed.medicine?.genericName && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Generic: {rxMed.medicine.genericName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Dosage</p>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{rxMed.dosage}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Duration</p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{rxMed.duration}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-700/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-600">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Quantity</p>
                      <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mt-0.5">{rxMed.quantity}</p>
                    </div>
                  </div>
                  {rxMed.instructions && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl p-2.5">
                      <p className="text-[9px] text-amber-500 dark:text-amber-400 uppercase tracking-wider font-medium mb-0.5">Instructions</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{rxMed.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {prescription.prescriptionImage && (
          <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Prescription Image
              </h2>
            </CardHeader>
            <CardContent className="pt-5">
              <a
                href={prescription.prescriptionImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prescription.prescriptionImage}
                    alt="Prescription"
                    className="w-full max-h-96 object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View full size</span>
                    </div>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
