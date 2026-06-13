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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back */}
        <Link
          href="/dashboard/visits"
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
            <div className="pt-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Visit Record</h1>
                <p className="text-sm text-slate-500 mt-0.5">{visit.chiefComplaint}</p>
              </div>
              <div className="flex gap-2">
                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 gap-1.5"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
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

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Chief Complaint
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            {editing ? (
              <Textarea
                value={form.chiefComplaint}
                onChange={(e) => updateField("chiefComplaint", e.target.value)}
                className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-20"
              />
            ) : (
              <p className="text-sm text-slate-800">{visit.chiefComplaint}</p>
            )}
          </CardContent>
        </Card>

        {/* Vitals */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" /> Vitals
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-orange-600" />
                    Blood Pressure
                  </Label>
                  <Input
                    placeholder="e.g. 120/80"
                    value={form.bloodPressure}
                    onChange={(e) => updateField("bloodPressure", e.target.value)}
                    className="h-9 border-slate-200 focus-visible:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-orange-600" />
                    Temperature
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 98.6"
                    value={form.temperature}
                    onChange={(e) => updateField("temperature", e.target.value)}
                    className="h-9 border-slate-200 focus-visible:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Weight className="w-3 h-3 text-orange-600" />
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 65"
                    value={form.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                    className="h-9 border-slate-200 focus-visible:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-orange-600" />
                    Pulse Rate (bpm)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 72"
                    value={form.pulseRate}
                    onChange={(e) => updateField("pulseRate", e.target.value)}
                    className="h-9 border-slate-200 focus-visible:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            ) : (
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
            )}

            {editing ? (
              <div className="mt-4 space-y-1.5">
                <Label className="text-xs text-slate-600 font-medium">Notes</Label>
                <Textarea
                  placeholder="Doctor's notes…"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-20"
                />
              </div>
            ) : (
              visit.notes && (
                <div className="mt-5 p-3 rounded-lg bg-violet-50 border border-violet-100">
                  <p className="text-xs text-violet-400 mb-0.5">Doctor&apos;s Notes</p>
                  <p className="text-sm text-violet-700">{visit.notes}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {editing && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
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
        )}

        {!editing && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-600" /> Prescription
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-4">
              {visit.prescription && visit.prescription.status === "ACTIVE" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-md p-2.5 border border-slate-100">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Diagnosis</p>
                      <p className="text-sm font-medium text-slate-800">{visit.prescription.diagnosis}</p>
                    </div>
                    {visit.prescription.advice && (
                      <div className="bg-white rounded-md p-2.5 border border-slate-100">
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Advice</p>
                        <p className="text-sm text-slate-700">{visit.prescription.advice}</p>
                      </div>
                    )}
                  </div>
                  {visit.prescription.medicines && visit.prescription.medicines.length > 0 && (
                    <div className="space-y-2">
                      {visit.prescription.medicines.map((rxMed) => (
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
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                            {rxMed.medicine?.strength && (
                              <div className="bg-white rounded-md p-1.5 border border-slate-100">
                                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Strength</p>
                                <p className="text-xs font-medium text-slate-700">{rxMed.medicine.strength}</p>
                              </div>
                            )}
                          </div>
                          {rxMed.instructions && (
                            <div className="bg-amber-50 border border-amber-100 rounded-md p-1.5">
                              <p className="text-[9px] text-amber-500 uppercase tracking-wide">Instructions</p>
                              <p className="text-xs text-amber-700">{rxMed.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No prescription for this visit</p>
                  <Button asChild size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 gap-1.5">
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
