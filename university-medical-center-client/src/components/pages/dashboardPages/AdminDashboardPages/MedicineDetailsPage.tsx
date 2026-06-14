/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Medicine } from "@/types";
import { useMedicineDetail, useDeleteMedicine, useIncreaseStock, useDecreaseStock } from "@/hooks/queries/useMedicineQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Pill, ArrowLeft, Calendar, Building2, FlaskConical,
  DollarSign, Package, Trash2, Plus, Minus, AlertTriangle,
  TrendingUp, TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MedicineDetailsPage({ medicine: initial }: { medicine: Medicine }) {
  const router = useRouter();
  const { data: medicine } = useMedicineDetail(initial.id);
  const med = medicine ?? initial;

  const deleteMutation = useDeleteMedicine();
  const increaseMutation = useIncreaseStock();
  const decreaseMutation = useDecreaseStock();

  const [stockAction, setStockAction] = useState<"increase" | "decrease" | null>(null);
  const [stockQty, setStockQty] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isLowStock = med.stockQuantity <= med.minimumStock;
  const isOut = med.stockQuantity === 0;
  const isAdjusting = increaseMutation.isPending || decreaseMutation.isPending;

  const openStockDialog = (type: "increase" | "decrease") => {
    setStockAction(type);
    setStockQty(1);
  };

  const handleStockAdjust = () => {
    if (!stockAction || stockQty <= 0) return;
    if (stockAction === "decrease" && stockQty > med.stockQuantity) {
      toast.error("Cannot decrease more than available stock");
      return;
    }
    const mutation = stockAction === "increase" ? increaseMutation : decreaseMutation;
    mutation.mutate(
      { id: med.id, quantity: stockQty },
      {
        onSuccess: () => {
          toast.success(`${stockAction === "increase" ? "Added" : "Removed"} ${stockQty} units`);
          setStockAction(null);
          setStockQty(1);
        },
        onError: (err: any) => toast.error(err?.message || "Failed to adjust stock"),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(med.id, {
      onSuccess: () => {
        toast.success("Medicine deleted successfully");
        router.push("/dashboard/all-medicines");
      },
      onError: (err: any) => toast.error(err?.message || "Failed to delete medicine"),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-medicines" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Medicines
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <Pill className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{med.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{med.dosageForm} {med.strength ? `· ${med.strength}` : ""}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${isOut ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" : isLowStock ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"}`}
              >
                {isOut ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
              </Badge>
            </div>
            {med.genericName && (
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Generic: {med.genericName}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Stock Management
            </CardTitle>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Current Stock</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{med.stockQuantity}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">units</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Minimum Stock</p>
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{med.minimumStock}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => openStockDialog("increase")} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 gap-1.5 shadow-md shadow-emerald-500/20">
                <TrendingUp className="w-4 h-4" /> Add Stock
              </Button>
              <Button size="sm" variant="outline" onClick={() => openStockDialog("decrease")} disabled={isOut} className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 gap-1.5">
                <TrendingDown className="w-4 h-4" /> Remove Stock
              </Button>
            </div>
            {isLowStock && !isOut && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">Stock is below minimum threshold ({med.minimumStock} units)</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem label="Medicine Name" value={med.name} />
              {med.genericName && <DetailItem label="Generic Name" value={med.genericName} />}
              <DetailItem label="Manufacturer" value={med.manufacturer ?? "Not specified"} icon={<Building2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />} />
              <DetailItem label="Dosage Form" value={med.dosageForm ?? "Not specified"} icon={<FlaskConical className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />} />
              <DetailItem label="Strength" value={med.strength ?? "Not specified"} icon={<FlaskConical className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Price & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem label="Unit Price" value={med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "Not specified"} icon={<DollarSign className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />} />
              <DetailItem label="Expiry Date" value={med.expiryDate ? new Date(med.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Not specified"} icon={<Calendar className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />} />
              <DetailItem label="Created" value={new Date(med.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
              <DetailItem label="Last Updated" value={new Date(med.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
          <CardContent className="py-5 px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Delete Medicine</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone</p>
              </div>
              {!showDeleteConfirm ? (
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)} className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5">
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)} className="border-slate-200 dark:border-slate-700">Cancel</Button>
                  <Button size="sm" onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 gap-1.5">
                    <Trash2 className="w-4 h-4" /> {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200 dark:border-slate-700">
            <Link href="/dashboard/all-medicines">Back to List</Link>
          </Button>
        </div>
      </div>

      <Dialog open={!!stockAction} onOpenChange={(o) => !o && setStockAction(null)}>
        <DialogContent className="max-w-sm dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              {stockAction === "increase"
                ? <><TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />Add Stock</>
                : <><TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />Remove Stock</>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{med.name}</span>
              <span className="text-slate-400 dark:text-slate-500 ml-2">Current: {med.stockQuantity}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 dark:border-slate-700" onClick={() => setStockQty((q) => Math.max(1, q - 1))}>
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={stockQty}
                  onChange={(e) => setStockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-9 text-center border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 w-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 dark:border-slate-700" onClick={() => setStockQty((q) => q + 1)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockAction(null)} disabled={isAdjusting} className="border-slate-200 dark:border-slate-700">Cancel</Button>
            <Button
              onClick={handleStockAdjust}
              disabled={isAdjusting}
              className={stockAction === "increase" ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" : "bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600"}
            >
              {isAdjusting
                ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : stockAction === "increase" ? "Add" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{value}</p>
    </div>
  );
}
