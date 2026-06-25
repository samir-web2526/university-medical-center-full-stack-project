"use client";

import { useEffect, useRef, useState } from "react";
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
  Sparkles,
  FileText,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { createPrescription } from "@/services/prescription.service";
import { getAllMedicines } from "@/services/medicine.service";
import { uploadImage, isValidImageType, formatFileSize } from "@/lib/upload";
import { extractPrescription, type OcrMedicine } from "@/services/ocr.service";
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
  investigation: string;
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

export default function CreatePrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillVisitId = searchParams.get("visitId") ?? "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PrescriptionForm>({
    visitId: prefillVisitId,
    diagnosis: "",
    advice: "",
    investigation: "",
    medicines: [emptyMedicine()],
  });
  const [saving, setSaving] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

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

  const handleImageSelect = async (file: File) => {
    if (!isValidImageType(file)) {
      toast.error("Only JPEG, PNG, GIF, WebP images are allowed");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      toast.error("Image must be smaller than 32MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setOcrError(null);

    try {
      const result = await uploadImage(file, `prescription-${Date.now()}`);
      setUploadedImageUrl(result.url);
      toast.success("Image uploaded successfully");

      setOcrLoading(true);
      toast.info("Extracting prescription data...");
      const ocrResult = await extractPrescription(result.url);

      if (ocrResult.error) {
        setOcrError(ocrResult.error);
        toast.error("OCR failed: " + ocrResult.error);
      } else if (ocrResult.data) {
        const { diagnosis, advice, medicines: ocrMeds } = ocrResult.data;

        const matchedMeds = (ocrMeds || []).map((ocr: OcrMedicine) => {
          const matched = medicines.find(
            (m) =>
              m.name.toLowerCase().includes(ocr.name.toLowerCase()) ||
              ocr.name.toLowerCase().includes(m.name.toLowerCase())
          );
          return {
            medicineId: matched?.id ?? "",
            dosage: ocr.dosage || "",
            quantity: String(ocr.quantity || ""),
            frequency: ocr.frequency || "",
            duration: ocr.duration || "",
            instructions: ocr.instructions || "",
          };
        });

        setForm((prev) => ({
          ...prev,
          diagnosis: diagnosis || prev.diagnosis,
          advice: advice || prev.advice,
          medicines: matchedMeds.length > 0 ? matchedMeds : prev.medicines,
        }));

        toast.success("Prescription data extracted and filled!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
      setOcrLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploading(false);
    setOcrLoading(false);
    setOcrError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.visitId.trim()) return toast.error("Visit ID is required");
    if (!form.diagnosis.trim()) return toast.error("Diagnosis is required");
    if (form.medicines.some((m) => !m.medicineId))
      return toast.error("Please select a medicine for each entry");
    if (form.medicines.some((m) => m.medicineId && (!m.quantity || Number(m.quantity) < 1)))
      return toast.error("Quantity is required for each medicine");
    if (form.medicines.some((m) => m.medicineId && !m.dosage.trim()))
      return toast.error("Dosage is required for each medicine");
    if (form.medicines.some((m) => m.medicineId && !m.duration.trim()))
      return toast.error("Duration is required for each medicine");

    setSaving(true);
    try {
      const payload = {
        visitId: form.visitId.trim(),
        diagnosis: form.diagnosis.trim(),
        ...(form.advice.trim() && { advice: form.advice.trim() }),
        ...(form.investigation.trim() && { investigation: form.investigation.trim() }),
        ...(uploadedImageUrl && { prescriptionImage: uploadedImageUrl }),
        medicines: form.medicines
          .filter((m) => m.medicineId)
          .map((m) => ({
            medicineId: m.medicineId,
            dosage: m.dosage.trim(),
            frequency: m.frequency.trim(),
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </Link>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-green-600 p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC00aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Create Prescription
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                Prescribe medicines for patient visits
              </p>
            </div>
          </div>
        </div>

        {/* Prescription Details Card */}
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-500" />
              Prescription Details
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Fill in the diagnosis and advice
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
                Visit ID
              </Label>
              <Input
                placeholder="Enter visit ID"
                value={form.visitId}
                onChange={(e) => updateField("visitId", e.target.value)}
                className="h-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl"
              />
              {!prefillVisitId && (
                <p className="text-xs text-slate-400">
                  Go to{" "}
                  <Link href="/dashboard/visits" className="text-emerald-500 hover:underline">
                    My Visits
                  </Link>{" "}
                  to find a visit ID, or create a visit first.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
                Diagnosis
              </Label>
              <Input
                placeholder="e.g. Hypertension, Type 2 Diabetes"
                value={form.diagnosis}
                onChange={(e) => updateField("diagnosis", e.target.value)}
                className="h-10 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Advice <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Follow-up instructions or advice…"
                value={form.advice}
                onChange={(e) => updateField("advice", e.target.value)}
                className="resize-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 min-h-20 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Investigations / Tests <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Required tests or investigations…"
                value={form.investigation}
                onChange={(e) => updateField("investigation", e.target.value)}
                className="resize-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 min-h-20 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescription Image Upload Card */}
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              Prescription Image
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">(optional)</span>
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Upload a photo of the handwritten prescription
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  dragActive
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {dragActive ? "Drop image here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    JPEG, PNG, GIF, WebP, BMP, TIFF (max 32MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Prescription preview"
                    className="w-full max-h-80 object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  {(uploading || ocrLoading) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl px-4 py-2 shadow-lg">
                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {uploading ? "Uploading…" : "Extracting prescription data…"}
                        </span>
                      </div>
                    </div>
                  )}
                  {uploadedImageUrl && !uploading && !ocrLoading && (
                    <div className="absolute top-3 right-3">
                      <div className={`text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-md ${ocrError ? "bg-amber-500" : "bg-emerald-500"}`}>
                        {ocrError ? "Uploaded (OCR failed)" : "Extracted ✓"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{imageFile?.name}</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{imageFile ? formatFileSize(imageFile.size) : ""}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-1.5 h-8 rounded-xl"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medicines Card */}
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-500" />
                Medicines
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addMedicine}
                className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 gap-1.5 h-8 rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-5">
            {form.medicines.map((med, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800 rounded-full" />
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Medicine #{index + 1}
                    </span>
                    {form.medicines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all"
                        onClick={() => removeMedicine(index)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Medicine *</Label>
                      <Select
                        value={med.medicineId}
                        onValueChange={(v) => updateMedicine(index, "medicineId", v)}
                        disabled={medicinesLoading}
                      >
                        <SelectTrigger className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus:ring-emerald-500 rounded-xl text-sm">
                          <SelectValue
                            placeholder={
                              medicinesLoading ? "Loading medicines…" : "Select medicine"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
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
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Dosage</Label>
                      <Input
                        placeholder="e.g. 5mg, 500ml"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                        className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        min="1"
                        value={med.quantity}
                        onChange={(e) => updateMedicine(index, "quantity", e.target.value)}
                        className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Frequency</Label>
                      <Input
                        placeholder="e.g. Twice daily, Every 8 hours"
                        value={med.frequency}
                        onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                        className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Duration</Label>
                      <Input
                        placeholder="e.g. 7 days, 2 weeks"
                        value={med.duration}
                        onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                        className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Instructions</Label>
                      <Input
                        placeholder="e.g. Take after meals"
                        value={med.instructions}
                        onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                        className="h-9 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-10">
          <Button
            variant="outline"
            className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
            onClick={handleSubmit}
            disabled={saving || uploading || ocrLoading}
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
