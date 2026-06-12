"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMedicineById } from "@/actions/medicine.actions";
import type { Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pill, ArrowLeft, Calendar, Building2, FlaskConical,
  DollarSign, Package,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MedicineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = params?.id as string;
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!medicineId) return;
    setLoading(true);
    getMedicineById(medicineId).then(({ data, error }) => {
      if (error) {
        toast.error(error);
        router.push("/");
      } else {
        setMedicine(data);
      }
      setLoading(false);
    });
  }, [medicineId, router]);

  const isLowStock = medicine && medicine.stockQuantity <= medicine.minimumStock;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-24" />
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Medicine not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>

        {/* Header Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Pill className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{medicine.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{medicine.dosageForm}</p>
              </div>
              <Badge
                className={
                  isLowStock
                    ? "bg-red-50 text-red-700 border-red-200"
                    : medicine.stockQuantity === 0
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }
              >
                {medicine.stockQuantity === 0
                  ? "Out of Stock"
                  : isLowStock
                  ? "Low Stock"
                  : "In Stock"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Medicine Name</p>
                <p className="text-sm text-slate-900 font-medium">{medicine.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Manufacturer
                </p>
                <p className="text-sm text-slate-600">{medicine.manufacturer ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Dosage Form
                </p>
                <p className="text-sm text-slate-600">{medicine.dosageForm ?? "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> Strength
                </p>
                <p className="text-sm text-slate-600">{medicine.strength ?? "Not specified"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-500" /> Current Stock
                </p>
                <p className="text-2xl font-bold text-slate-900">{medicine.stockQuantity}</p>
                <p className="text-xs text-slate-500 mt-0.5">units available</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Minimum Stock</p>
                <p className="text-sm font-medium text-slate-600">{medicine.minimumStock} units</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-green-500" /> Unit Price
                </p>
                <p className="text-sm font-medium text-slate-600">
                  {medicine.unitPrice ? `৳${medicine.unitPrice.toFixed(2)}` : "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates Information */}
          <Card className="border-0 shadow-md md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" /> Expiry Date
                </p>
                <p className="text-sm text-slate-600">
                  {medicine.expiryDate
                    ? new Date(medicine.expiryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Created Date</p>
                <p className="text-sm text-slate-600">
                  {new Date(medicine.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Last Updated</p>
                <p className="text-sm text-slate-600">
                  {new Date(medicine.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
