"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateMedicineRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft, Pill, Save, Building2, FlaskConical,
  Calendar, DollarSign, Package,
} from "lucide-react";
import Link from "next/link";
import { useCreateMedicine } from "@/hooks/queries/useMedicineQueries";

export default function CreateMedicinePage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateMedicineRequest>({
    name: "",
    genericName: "",
    manufacturer: "",
    dosageForm: "",
    strength: "",
    expiryDate: "",
    unitPrice: undefined,
    stockQuantity: 0,
    minimumStock: 0,
  });
  const createMutation = useCreateMedicine();

  const set = (k: keyof CreateMedicineRequest, v: string | number) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name) return toast.error("Medicine name is required");
    if (form.stockQuantity <= 0) return toast.error("Stock quantity must be greater than 0");
    if (form.minimumStock < 0) return toast.error("Minimum stock cannot be negative");

    try {
      await createMutation.mutateAsync(form);
      toast.success("Medicine added to inventory!");
      router.push("/dashboard/all-medicines");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create medicine");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/dashboard/all-medicines" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Medicines
        </Link>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Add Medicine</CardTitle>
                <CardDescription className="text-slate-500 text-sm">Add a new medicine to the clinic inventory.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Basic Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-500" /> Medicine Name *
                  </Label>
                  <Input placeholder="e.g. Seclo" value={form.name} onChange={(e) => set("name", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Generic Name</Label>
                  <Input placeholder="e.g. Omeprazole" value={form.genericName ?? ""} onChange={(e) => set("genericName", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Manufacturer
                  </Label>
                  <Input placeholder="e.g. Square Pharmaceuticals" value={form.manufacturer ?? ""} onChange={(e) => set("manufacturer", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Dosage Form
                  </Label>
                  <Input placeholder="e.g. Capsule, Tablet, Syrup" value={form.dosageForm ?? ""} onChange={(e) => set("dosageForm", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Strength
                  </Label>
                  <Input placeholder="e.g. 20mg, 500mg" value={form.strength ?? ""} onChange={(e) => set("strength", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Price & Expiry */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price & Expiry</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Unit Price (৳)
                  </Label>
                  <Input type="number" min={0} step="0.01" placeholder="e.g. 8" value={form.unitPrice ?? ""} onChange={(e) => set("unitPrice", parseFloat(e.target.value) || 0)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Expiry Date
                  </Label>
                  <Input type="date" value={form.expiryDate ?? ""} onChange={(e) => set("expiryDate", e.target.value)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Stock */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock Management</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-500" /> Initial Stock *
                  </Label>
                  <Input type="number" min={1} placeholder="e.g. 300" value={form.stockQuantity || ""} onChange={(e) => set("stockQuantity", parseInt(e.target.value) || 0)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-orange-500" /> Minimum Stock *
                  </Label>
                  <Input type="number" min={0} placeholder="e.g. 50" value={form.minimumStock || ""} onChange={(e) => set("minimumStock", parseInt(e.target.value) || 0)} className="h-10 border-slate-200 focus-visible:ring-emerald-500" />
                  <p className="text-xs text-slate-400">Low-stock alert triggers at this level.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => router.back()} disabled={createMutation.isPending}>Cancel</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</>
                ) : (
                  <><Save className="w-3.5 h-3.5" />Add Medicine</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
