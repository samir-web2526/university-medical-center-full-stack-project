"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pill,
  ClipboardList,
  Save,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { createPrescription } from "@/services/prescription.service";
import { getAllMedicines } from "@/services/medicine.service";
import type { Medicine } from "@/types";

interface MedicineEntry {
  medicineId: string;
  dosage: string;
  quantity: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionForm {
  visitId: string;
  diagnosis: string;
  advice: string;
  medicines: MedicineEntry[];
}

const emptyMedicine = (): MedicineEntry => ({
  medicineId: "",
  dosage: "",
  quantity: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 6 hours",
  "Every 8 hours",
  "As needed",
  "Before meals",
  "After meals",
];

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillVisitId = searchParams.get("visitId") ?? "";

  const [form, setForm] = useState<PrescriptionForm>({
    visitId: prefillVisitId,
    diagnosis: "",
    advice: "",
    medicines: [emptyMedicine()],
  });
  const [saving, setSaving] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);

  useEffect(() => {
    getAllMedicines(1, 200).then((res) => {
      if (res.data) {
        setMedicines(res.data.data);
      }
      setMedicinesLoading(false);
    });
  }, []);

  const updateField = <K extends keyof PrescriptionForm>(
    key: K,
    value: PrescriptionForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateMedicine = (index: number, field: keyof MedicineEntry, value: string) => {
    setForm((prev) => {
      const medicines = [...prev.medicines];
      medicines[index] = { ...medicines[index], [field]: value };
      return { ...prev, medicines };
    });
  };

  const addMedicine = () =>
    setForm((prev) => ({ ...prev, medicines: [...prev.medicines, emptyMedicine()] }));

  const removeMedicine = (index: number) =>
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    if (!form.visitId.trim()) return toast.error("Visit ID is required");
    if (!form.diagnosis.trim()) return toast.error("Diagnosis is required");
    if (form.medicines.some((m) => !m.medicineId))
      return toast.error("Please select a medicine for each entry");
    if (form.medicines.some((m) => m.medicineId && (!m.quantity || Number(m.quantity) < 1)))
      return toast.error("Quantity is required for each medicine");

    setSaving(true);
    try {
      const payload = {
        visitId: form.visitId.trim(),
        diagnosis: form.diagnosis.trim(),
        ...(form.advice.trim() && { advice: form.advice.trim() }),
        medicines: form.medicines
          .filter((m) => m.medicineId)
          .map((m) => ({
            medicineId: m.medicineId,
            dosage: m.dosage.trim(),
            duration: m.duration.trim(),
            quantity: Number(m.quantity),
            ...(m.instructions.trim() && { instructions: m.instructions.trim() }),
          })),
      };

      const { error } = await createPrescription(payload);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Prescription created successfully!");
      router.push("/dashboard/prescriptions");
    } catch {
      toast.error("Failed to create prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </Link>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              Prescription Details
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              Fill in the diagnosis and advice
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                Visit ID
              </Label>
              <Input
                placeholder="Enter visit ID"
                value={form.visitId}
                onChange={(e) => updateField("visitId", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-blue-500"
              />
              {!prefillVisitId && (
                <p className="text-xs text-slate-400">
                  Go to{" "}
                  <Link href="/dashboard/visits" className="text-blue-500 hover:underline">
                    My Visits
                  </Link>{" "}
                  to find a visit ID, or create a visit first.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                Diagnosis
              </Label>
              <Input
                placeholder="e.g. Hypertension, Type 2 Diabetes"
                value={form.diagnosis}
                onChange={(e) => updateField("diagnosis", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Advice <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Follow-up instructions or advice…"
                value={form.advice}
                onChange={(e) => updateField("advice", e.target.value)}
                className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-500" />
                Medicines
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addMedicine}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 gap-1.5 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-5">
            {form.medicines.map((med, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-blue-100 rounded-full" />
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Medicine #{index + 1}
                    </span>
                    {form.medicines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeMedicine(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Medicine *</Label>
                      <Select
                        value={med.medicineId}
                        onValueChange={(v) => updateMedicine(index, "medicineId", v)}
                        disabled={medicinesLoading}
                      >
                        <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-500 bg-white text-sm">
                          <SelectValue
                            placeholder={
                              medicinesLoading ? "Loading medicines…" : "Select medicine"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {medicines.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="text-sm">
                              {m.name}
                              {m.strength ? ` (${m.strength})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Dosage</Label>
                      <Input
                        placeholder="e.g. 5mg, 500ml"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                        className="h-9 border-slate-200 focus-visible:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        min="1"
                        value={med.quantity}
                        onChange={(e) => updateMedicine(index, "quantity", e.target.value)}
                        className="h-9 border-slate-200 focus-visible:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Frequency</Label>
                      <Select
                        value={med.frequency}
                        onValueChange={(v) => updateMedicine(index, "frequency", v)}
                      >
                        <SelectTrigger className="h-9 border-slate-200 focus:ring-blue-500 bg-white text-sm">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCIES.map((f) => (
                            <SelectItem key={f} value={f} className="text-sm">
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Duration</Label>
                      <Input
                        placeholder="e.g. 7 days, 2 weeks"
                        value={med.duration}
                        onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                        className="h-9 border-slate-200 focus-visible:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 font-medium">Instructions</Label>
                      <Input
                        placeholder="e.g. Take after meals"
                        value={med.instructions}
                        onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                        className="h-9 border-slate-200 focus-visible:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                Create Prescription
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
