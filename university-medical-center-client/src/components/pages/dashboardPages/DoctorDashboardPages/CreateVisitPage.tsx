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
  Sparkles,
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

type FormErrors = Partial<Record<keyof VisitForm, string>>;

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof VisitForm>(
    key: K,
    value: VisitForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate(): boolean {
    const e: FormErrors = {};

    if (!form.studentId.trim()) {
      e.studentId = "Student ID is required";
    }

    if (!form.chiefComplaint.trim()) {
      e.chiefComplaint = "Chief complaint is required";
    }

    if (form.bloodPressure.trim() && !/^\d{1,3}\s*\/\s*\d{1,3}(\s*mmHg)?$/i.test(form.bloodPressure.trim())) {
      e.bloodPressure = "Format: 120/80 or 120/80 mmHg";
    }

    if (form.temperature.trim()) {
      const t = Number(form.temperature);
      if (isNaN(t)) {
        e.temperature = "Temperature must be a number";
      } else if (t < 90 || t > 110) {
        e.temperature = "Temperature must be between 90°F and 110°F";
      }
    }

    if (form.weight.trim()) {
      const w = Number(form.weight);
      if (isNaN(w)) {
        e.weight = "Weight must be a number";
      } else if (w < 1 || w > 500) {
        e.weight = "Weight must be between 1 kg and 500 kg";
      }
    }

    if (form.pulseRate.trim()) {
      const p = Number(form.pulseRate);
      if (isNaN(p)) {
        e.pulseRate = "Pulse rate must be a number";
      } else if (!Number.isInteger(p)) {
        e.pulseRate = "Pulse rate must be a whole number";
      } else if (p < 20 || p > 300) {
        e.pulseRate = "Pulse rate must be between 20 and 300 bpm";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        studentId: form.studentId.trim(),
        chiefComplaint: form.chiefComplaint.trim(),
        visitDate: form.visitDate,
        ...(form.bloodPressure.trim() && {
          bloodPressure: form.bloodPressure.trim(),
        }),
        ...(form.temperature.trim() && {
          temperature: Number(form.temperature),
        }),
        ...(form.weight.trim() && { weight: Number(form.weight) }),
        ...(form.pulseRate.trim() && { pulseRate: Number(form.pulseRate) }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/visits"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Visits
        </Link>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900 overflow-hidden">
          <div className="h-24 bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>
          <CardContent className="relative pb-6 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-700 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-10">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Create Visit
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Fill in the student information and chief complaint
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              Visit Details
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Fill in the student information and chief complaint
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  Student ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter student ID"
                  value={form.studentId}
                  onChange={(e) => updateField("studentId", e.target.value)}
                  className={`h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl ${errors.studentId ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
                />
                {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  Visit Date
                </Label>
                <Input
                  type="date"
                  value={form.visitDate}
                  onChange={(e) => updateField("visitDate", e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                Chief Complaint <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="e.g. Headache for 3 days, Fever and cough…"
                value={form.chiefComplaint}
                onChange={(e) => updateField("chiefComplaint", e.target.value)}
                className={`resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 min-h-20 dark:bg-slate-800 dark:text-white rounded-xl ${errors.chiefComplaint ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
              />
              {errors.chiefComplaint && <p className="text-xs text-red-500">{errors.chiefComplaint}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500 dark:text-teal-400" />
              Vitals
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Record the patient&apos;s vital signs{" "}
              <span className="text-slate-400 dark:text-slate-500">(all optional)</span>
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  Blood Pressure
                </Label>
                <Input
                  placeholder="e.g. 120/80 mmHg"
                  value={form.bloodPressure}
                  onChange={(e) => updateField("bloodPressure", e.target.value)}
                  className={`h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl ${errors.bloodPressure ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
                />
                {errors.bloodPressure && <p className="text-xs text-red-500">{errors.bloodPressure}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  Temperature (°F)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 98.6"
                  value={form.temperature}
                  onChange={(e) => updateField("temperature", e.target.value)}
                  className={`h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl ${errors.temperature ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
                />
                {errors.temperature && <p className="text-xs text-red-500">{errors.temperature}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  Weight (kg)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 65"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className={`h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl ${errors.weight ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
                />
                {errors.weight && <p className="text-xs text-red-500">{errors.weight}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                  Pulse Rate (bpm)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 72"
                  value={form.pulseRate}
                  onChange={(e) => updateField("pulseRate", e.target.value)}
                  className={`h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-white rounded-xl ${errors.pulseRate ? "!border-red-400 !bg-red-50 dark:!bg-red-950/30" : ""}`}
                />
                {errors.pulseRate && <p className="text-xs text-red-500">{errors.pulseRate}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              Notes
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Additional observations or instructions{" "}
              <span className="text-slate-400 dark:text-slate-500">(optional)</span>
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <Textarea
              placeholder="Additional notes, observations, or follow-up instructions…"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 min-h-25 dark:bg-slate-800 dark:text-white rounded-xl"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3 pb-10">
          <Button
            variant="outline"
            className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-xl"
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
