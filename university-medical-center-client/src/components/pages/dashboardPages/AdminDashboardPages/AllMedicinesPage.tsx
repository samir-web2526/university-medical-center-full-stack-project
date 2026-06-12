"use client";

import { useState } from "react";
import type { Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pill, Search, MoreVertical, Eye,
  Trash2, ChevronLeft, ChevronRight, Plus,
  Plus as PlusIcon, Minus as MinusIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useMedicines, useDeleteMedicine, useIncreaseStock, useDecreaseStock } from "@/hooks/queries/useMedicineQueries";

export default function AllMedicinesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stockAdjustId, setStockAdjustId] = useState<string | null>(null);
  const [stockAction, setStockAction] = useState<"increase" | "decrease" | null>(null);
  const [stockQty, setStockQty] = useState(1);
  const limit = 10;

  const { data, isLoading } = useMedicines(page, limit);
  const deleteMedicineMutation = useDeleteMedicine();
  const increaseStockMutation = useIncreaseStock();
  const decreaseStockMutation = useDecreaseStock();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedicineMutation.mutateAsync(deleteId);
      toast.success("Medicine deleted successfully");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete medicine");
    }
  };

  const handleStockAdjust = async () => {
    if (!stockAdjustId || !stockAction) return;
    try {
      const mutation = stockAction === "increase" ? increaseStockMutation : decreaseStockMutation;
      await mutation.mutateAsync({ id: stockAdjustId, quantity: stockQty });
      toast.success(`Stock ${stockAction}d successfully`);
      setStockAdjustId(null);
      setStockAction(null);
      setStockQty(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to adjust stock");
    }
  };

  const medicines = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  const isLowStock = (medicine: Medicine) => medicine.stockQuantity <= medicine.minimumStock;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-6 h-6 text-emerald-500" />
              All Medicines
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} medicine{total !== 1 ? "s" : ""} in inventory</p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-9">
            <Link href="/admin/medicines/create">
              <PlusIcon className="w-4 h-4" /> Add Medicine
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or manufacturer…"
            className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                  {["Medicine", "Manufacturer", "Strength", "Stock", "Price", "Status", "Actions"].map((h, i) => (
                    <TableHead key={h} className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 6 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-[120px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Pill className="w-8 h-8" />
                        <p className="text-sm font-medium">No medicines found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((med) => (
                    <TableRow key={med.id} className="hover:bg-emerald-50/40 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{med.name}</p>
                            <p className="text-xs text-slate-400">{med.dosageForm}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{med.manufacturer ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600">{med.strength ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        <span className="font-semibold">{med.stockQuantity}</span>
                        <span className="text-xs text-slate-400"> units</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isLowStock(med)
                              ? "bg-red-50 text-red-700 border-red-200 text-xs"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                          }
                        >
                          {isLowStock(med) ? "Low Stock" : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/medicines/${med.id}`}>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStockAdjustId(med.id); setStockAction("increase"); }}>
                              <PlusIcon className="w-4 h-4 mr-2" /> Increase Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setStockAdjustId(med.id); setStockAction("decrease"); }}>
                              <MinusIcon className="w-4 h-4 mr-2" /> Decrease Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeleteId(med.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="border-slate-200 h-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="border-slate-200 h-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this medicine? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMedicineMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMedicineMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Stock Adjust Dialog */}
        <AlertDialog open={!!stockAdjustId && !!stockAction} onOpenChange={(open) => { if (!open) { setStockAdjustId(null); setStockAction(null); setStockQty(1); } }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {stockAction === "increase" ? "Increase Stock" : "Decrease Stock"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Enter the quantity to {stockAction}:
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                type="number"
                min="1"
                value={stockQty}
                onChange={(e) => setStockQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleStockAdjust}
                disabled={increaseStockMutation.isPending || decreaseStockMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {increaseStockMutation.isPending || decreaseStockMutation.isPending ? "Adjusting..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
