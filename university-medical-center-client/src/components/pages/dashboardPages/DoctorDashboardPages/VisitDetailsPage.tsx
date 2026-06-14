"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Visit } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardList,
  User,
  Stethoscope,
  Calendar,
  Thermometer,
  Heart,
  Activity,
  Weight,
  FileText,
  Pill,
  Pencil,
  Plus,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { updateVisit } from "@/services/visit.service";

interface EditForm {
  chiefComplaint: string;
  bloodPressure: string;
  temperature: string;
  weight: string;
  pulseRate: string;
  notes: string;
}

export default function VisitDetailsPage({ visit }: { visit: Visit }) {
  const router = useRouter();
  const studentName = visit.student?.user?.name ?? "Unknown";
  const doctorName = visit.doctor?.user?.name ?? "Unknown";

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditForm>({
    chiefComplaint: visit.chiefComplaint,
    bloodPressure: visit.bloodPressure ?? "",
    temperature: visit.temperature != null ? String(visit.temperature) : "",
    weight: visit.weight != null ? String(visit.weight) : "",
    pulseRate: visit.pulseRate != null ? String(visit.pulseRate) : "",
    notes: visit.notes ?? "",
  });

  const updateField = <K extends keyof EditForm>(
    key: K,
    value: EditForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpdate = async () => {
    if (!form.chiefComplaint.trim())
      return toast.error("Chief complaint is required");

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        chiefComplaint: form.chiefComplaint.trim(),
      };
      if (form.bloodPressure.trim()) payload.bloodPressure = form.bloodPressure.trim();
      if (form.temperature.trim()) payload.temperature = Number(form.temperature);
      if (form.weight.trim()) payload.weight = Number(form.weight);
      if (form.pulseRate.trim()) payload.pulseRate = Number(form.pulseRate);
      if (form.notes.trim()) payload.notes = form.notes.trim();

      const { error } = await updateVisit(visit.id, payload);
      if (error) return toast.error(error);

      toast.success("Visit updated successfully!");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to update visit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/visits"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Visits
        </Link>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 overflow-hidden dark:bg-slate-900">
          <div className="h-24 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>
          <CardContent className="relative pb-6 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-700 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Visit Record
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{visit.chiefComplaint}</p>
              </div>
              <div className="flex gap-2">
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 gap-1.5 rounded-xl"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(visit.visitDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                ID: {visit.id.slice(0, 8)}...
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Chief Complaint
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            {editing ? (
              <Textarea
                value={form.chiefComplaint}
                onChange={(e) => updateField("chiefComplaint", e.target.value)}
                className="resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 min-h-20 dark:bg-slate-800 dark:text-white rounded-xl"
              />
            ) : (
              <p className="text-sm text-slate-800 dark:text-slate-200">{visit.chiefComplaint}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Vitals
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Blood Pressure
                  </Label>
                  <Input
                    placeholder="e.g. 120/80"
                    value={form.bloodPressure}
                    onChange={(e) => updateField("bloodPressure", e.target.value)}
                    className="h-9 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 text-sm dark:bg-slate-800 dark:text-white rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Temperature
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 98.6"
                    value={form.temperature}
                    onChange={(e) => updateField("temperature", e.target.value)}
                    className="h-9 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 text-sm dark:bg-slate-800 dark:text-white rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Weight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 65"
                    value={form.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                    className="h-9 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 text-sm dark:bg-slate-800 dark:text-white rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Pulse Rate (bpm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 72"
                    value={form.pulseRate}
                    onChange={(e) => updateField("pulseRate", e.target.value)}
                    className="h-9 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 text-sm dark:bg-slate-800 dark:text-white rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {visit.temperature != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                      <Thermometer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Temperature</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{visit.temperature}°F</p>
                    </div>
                  </div>
                )}
                {visit.bloodPressure && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Blood Pressure</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{visit.bloodPressure}</p>
                    </div>
                  </div>
                )}
                {visit.pulseRate != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Pulse Rate</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{visit.pulseRate} bpm</p>
                    </div>
                  </div>
                )}
                {visit.weight != null && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                      <Weight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Weight</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{visit.weight} kg</p>
                    </div>
                  </div>
                )}
                {!visit.temperature && !visit.bloodPressure && !visit.pulseRate && !visit.weight && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 col-span-full text-center py-4">No vitals recorded</p>
                )}
              </div>
            )}

            {editing ? (
              <div className="mt-4 space-y-1.5">
                <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Notes</Label>
                <Textarea
                  placeholder="Doctor's notes…"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 min-h-20 dark:bg-slate-800 dark:text-white rounded-xl"
                />
              </div>
            ) : (
              visit.notes && (
                <div className="mt-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-xs text-emerald-500 dark:text-emerald-400 mb-0.5">Doctor&apos;s Notes</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{visit.notes}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {editing && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 rounded-xl"
              onClick={() => {
                setEditing(false);
                setForm({
                  chiefComplaint: visit.chiefComplaint,
                  bloodPressure: visit.bloodPressure ?? "",
                  temperature: visit.temperature != null ? String(visit.temperature) : "",
                  weight: visit.weight != null ? String(visit.weight) : "",
                  pulseRate: visit.pulseRate != null ? String(visit.pulseRate) : "",
                  notes: visit.notes ?? "",
                });
              }}
              disabled={saving}
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-xl"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}

        {!editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
              <CardHeader className="pb-3">
                <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Doctor
                </h2>
              </CardHeader>
              <Separator className="dark:bg-slate-800" />
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">{doctorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{doctorName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{visit.doctor?.specialization ?? "—"}</p>
                  </div>
                </div>
                {visit.doctor?.qualification && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{visit.doctor.qualification}</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
              <CardHeader className="pb-3">
                <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Patient
                </h2>
              </CardHeader>
              <Separator className="dark:bg-slate-800" />
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">{studentName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{studentName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{visit.student?.studentId ?? "—"}</p>
                  </div>
                </div>
                {visit.student?.department && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{visit.student.department} · {visit.student.session}</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!editing && (
          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Prescription
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5 space-y-4">
              {visit.prescription && visit.prescription.status === "ACTIVE" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Diagnosis</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{visit.prescription.diagnosis}</p>
                    </div>
                    {visit.prescription.advice && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Advice</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{visit.prescription.advice}</p>
                      </div>
                    )}
                  </div>
                  {visit.prescription.medicines && visit.prescription.medicines.length > 0 && (
                    <div className="space-y-2">
                      {visit.prescription.medicines.map((rxMed) => (
                        <div key={rxMed.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                              <Pill className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rxMed.medicine?.name ?? "Unknown"}</p>
                              {rxMed.medicine?.genericName && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500">Generic: {rxMed.medicine.genericName}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700">
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Dosage</p>
                              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{rxMed.dosage}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700">
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Duration</p>
                              <p className="text-xs font-medium text-teal-700 dark:text-teal-400">{rxMed.duration}</p>
                            </div>
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700">
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Quantity</p>
                              <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">{rxMed.quantity}</p>
                            </div>
                            {rxMed.medicine?.strength && (
                              <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-slate-100 dark:border-slate-700">
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Strength</p>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{rxMed.medicine.strength}</p>
                              </div>
                            )}
                          </div>
                          {rxMed.instructions && (
                            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-800 rounded-xl p-1.5">
                              <p className="text-[9px] text-amber-500 dark:text-amber-400 uppercase tracking-wide">Instructions</p>
                              <p className="text-xs text-amber-700 dark:text-amber-300">{rxMed.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center mx-auto mb-3">
                    <Pill className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No prescription for this visit</p>
                  <Button asChild size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700 gap-1.5 rounded-xl">
                    <Link href={`/dashboard/create-prescription?visitId=${visit.id}&patientId=${visit.studentId}`}>
                      <Plus className="w-3.5 h-3.5" />
                      Create Prescription
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
