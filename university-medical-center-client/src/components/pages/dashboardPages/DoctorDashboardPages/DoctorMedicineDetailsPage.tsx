"use client";

import type { Medicine } from "@/types";
import { useMedicineDetail } from "@/hooks/queries/useMedicineQueries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Pill, ArrowLeft, Calendar, Building2, FlaskConical,
  DollarSign, Package, AlertTriangle, Sparkles,
  ShoppingCart, Info,
} from "lucide-react";
import Link from "next/link";

export default function DoctorMedicineDetailsPage({ medicine: initial }: { medicine: Medicine }) {
  const { data: medicine } = useMedicineDetail(initial.id);
  const med = medicine ?? initial;

  const isLowStock = med.stockQuantity <= med.minimumStock;
  const isOut = med.stockQuantity === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/medicines"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Medicines
        </Link>

        {/* Hero Card */}
        <Card className="border-0 shadow-md overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="h-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC00aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          </div>
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {med.name}
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{med.dosageForm} {med.strength ? `· ${med.strength}` : ""}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  isOut
                    ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                    : isLowStock
                    ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                }`}
              >
                {isOut ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
              </Badge>
            </div>
            {med.genericName && (
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Generic: {med.genericName}</p>
            )}
          </CardContent>
        </Card>

        {/* Stock Info Card */}
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Stock Info
            </CardTitle>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Available Stock</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{med.stockQuantity}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">units</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Minimum Stock</p>
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{med.minimumStock}</p>
              </div>
            </div>

            {isLowStock && !isOut && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 mt-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">Stock is below minimum threshold ({med.minimumStock} units)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
                  <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Medicine Name</p>
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{med.name}</p>
              </div>
              {med.genericName && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Generic Name</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{med.genericName}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Manufacturer
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{med.manufacturer ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Dosage Form
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{med.dosageForm ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Strength
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{med.strength ?? "Not specified"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Price & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" /> Unit Price
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" /> Expiry Date
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
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

        {/* Back Button */}
        <div className="flex gap-3 pb-10">
          <Link
            href="/dashboard/medicines"
            className="flex-1 inline-flex items-center justify-center h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
