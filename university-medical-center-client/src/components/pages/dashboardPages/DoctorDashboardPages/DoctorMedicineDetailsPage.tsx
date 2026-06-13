"use client";

import type { Medicine } from "@/types";
import { useMedicineDetail } from "@/hooks/queries/useMedicineQueries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Pill, ArrowLeft, Calendar, Building2, FlaskConical,
  DollarSign, Package, AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function DoctorMedicineDetailsPage({ medicine: initial }: { medicine: Medicine }) {
  const { data: medicine } = useMedicineDetail(initial.id);
  const med = medicine ?? initial;

  const isLowStock = med.stockQuantity <= med.minimumStock;
  const isOut = med.stockQuantity === 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/medicines"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Medicines
        </Link>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <Pill className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{med.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{med.dosageForm} {med.strength ? `· ${med.strength}` : ""}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${isOut ? "bg-red-50 text-red-700 border-red-200" : isLowStock ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
              >
                {isOut ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
              </Badge>
            </div>
            {med.genericName && (
              <p className="mt-2 text-xs text-slate-400">Generic: {med.genericName}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" /> Stock Info
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-400">Available Stock</p>
                <p className="text-3xl font-bold text-slate-900">{med.stockQuantity}</p>
                <p className="text-xs text-slate-500">units</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Minimum Stock</p>
                <p className="text-lg font-semibold text-slate-600">{med.minimumStock}</p>
              </div>
            </div>

            {isLowStock && !isOut && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mt-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">Stock is below minimum threshold ({med.minimumStock} units)</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Medicine Name</p>
                <p className="text-sm text-slate-900 font-medium">{med.name}</p>
              </div>
              {med.genericName && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Generic Name</p>
                  <p className="text-sm text-slate-600">{med.genericName}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Manufacturer
                </p>
                <p className="text-sm text-slate-600">{med.manufacturer ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Dosage Form
                </p>
                <p className="text-sm text-slate-600">{med.dosageForm ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Strength
                </p>
                <p className="text-sm text-slate-600">{med.strength ?? "Not specified"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Price & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" /> Unit Price
                </p>
                <p className="text-sm font-medium text-slate-600">
                  {med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" /> Expiry Date
                </p>
                <p className="text-sm text-slate-600">
                  {med.expiryDate
                    ? new Date(med.expiryDate).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })
                    : "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pb-10">
          <Link
            href="/dashboard/medicines"
            className="flex-1 inline-flex items-center justify-center h-10 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
