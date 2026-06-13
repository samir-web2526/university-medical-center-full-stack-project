"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Stethoscope,
  User,
  Activity,
  Thermometer,
  Weight,
  Heart,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { createVisit } from "@/services/visit.service";

interface VisitForm {
  studentId: string;
  chiefComplaint: string;
  bloodPressure: string;
  temperature: string;
  weight: string;
  pulseRate: string;
  notes: string;
  visitDate: string;
}

export default function CreateVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillStudentId = searchParams.get("studentId") ?? "";

  const [form, setForm] = useState<VisitForm>({
    studentId: prefillStudentId,
    chiefComplaint: "",
    bloodPressure: "",
    temperature: "",
    weight: "",
    pulseRate: "",
    notes: "",
    visitDate: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof VisitForm>(
    key: K,
    value: VisitForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.studentId.trim())
      return toast.error("Please enter a student ID");
    if (!form.chiefComplaint.trim())
      return toast.error("Chief complaint is required");

    setSaving(true);
    try {
      const payload = {
        studentId: form.studentId.trim(),
        chiefComplaint: form.chiefComplaint.trim(),
        ...(form.bloodPressure.trim() && {
          bloodPressure: form.bloodPressure.trim(),
        }),
        ...(form.temperature.trim() && {
          temperature: Number(form.temperature),
        }),
        ...(form.weight.trim() && { weight: Number(form.weight) }),
        ...(form.pulseRate.trim() && { pulseRate: Number(form.pulseRate) }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        ...(form.visitDate && { visitDate: form.visitDate }),
      };

      const { data, error } = await createVisit(payload);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Visit created successfully!");
      router.push("/dashboard/visits");
    } catch {
      toast.error("Failed to create visit");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/visits"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Visits
        </Link>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              Visit Details
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Fill in the student information and chief complaint
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  Student ID
                </Label>
                <Input
                  placeholder="Enter student ID"
                  value={form.studentId}
                  onChange={(e) => updateField("studentId", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Visit Date
                </Label>
                <Input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) => updateField("visitDate", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Chief Complaint
              </Label>
              <Textarea
                placeholder="e.g. Headache for 3 days, Fever and cough…"
                value={form.chiefComplaint}
                onChange={(e) => updateField("chiefComplaint", e.target.value)}
                className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Vitals
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Record the patient&apos;s vital signs{" "}
              <span className="text-slate-400">(all optional)</span>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Blood Pressure
                </Label>
                <Input
                  placeholder="e.g. 120/80 mmHg"
                  value={form.bloodPressure}
                  onChange={(e) => updateField("bloodPressure", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-emerald-500" />
                  Temperature
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 98.6"
                  value={form.temperature}
                  onChange={(e) => updateField("temperature", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-emerald-500" />
                  Weight (kg)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 65"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-500" />
                  Pulse Rate (bpm)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 72"
                  value={form.pulseRate}
                  onChange={(e) => updateField("pulseRate", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Notes
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Additional observations or instructions{" "}
              <span className="text-slate-400">(optional)</span>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <Textarea
              placeholder="Additional notes, observations, or follow-up instructions…"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-25"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3 pb-10">
          <Button
            variant="outline"
            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Create Visit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
