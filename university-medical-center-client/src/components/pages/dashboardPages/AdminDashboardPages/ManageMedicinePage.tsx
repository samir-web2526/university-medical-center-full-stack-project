"use client";

import { useEffect, useState } from "react";
import { useMedicines, useDeleteMedicine, useIncreaseStock, useDecreaseStock } from "@/hooks/queries/useMedicineQueries";
import type { Medicine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pill, Search, MoreVertical, Plus, Minus,
  Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function StockBadge({ medicine }: { medicine: Medicine }) {
  if (medicine.stockQuantity === 0)
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs gap-1"><AlertTriangle className="w-3 h-3" />Out of Stock</Badge>;
  if (medicine.stockQuantity <= medicine.minimumStock)
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs gap-1"><AlertTriangle className="w-3 h-3" />Low Stock</Badge>;
  return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">In Stock</Badge>;
}

type StockAction = { id: string; type: "increase" | "decrease" } | null;

export default function ManageMedicinePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stockAction, setStockAction] = useState<StockAction>(null);
  const [qty, setQty] = useState(1);
  const limit = 10;

  const { data, isLoading } = useMedicines(page, limit);
  const deleteMedicineMutation = useDeleteMedicine();
  const increaseStockMutation = useIncreaseStock();
  const decreaseStockMutation = useDecreaseStock();

  const medicines = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedicineMutation.mutateAsync(deleteId);
      toast.success("Medicine removed");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete medicine");
    }
  };

  const handleStockAdjust = async () => {
    if (!stockAction || qty < 1) return;
    try {
      const mutation = stockAction.type === "increase" ? increaseStockMutation : decreaseStockMutation;
      await mutation.mutateAsync({ id: stockAction.id, quantity: qty });
      toast.success(`Stock ${stockAction.type === "increase" ? "increased" : "decreased"} by ${qty}`);
      setStockAction(null);
      setQty(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to adjust stock");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isAdjusting = increaseStockMutation.isPending || decreaseStockMutation.isPending;
  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.manufacturer ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.dosageForm ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const actionMedicine = medicines.find((m) => m.id === stockAction?.id);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-6 h-6 text-emerald-500" /> Medicine Inventory
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} medicine{total !== 1 ? "s" : ""} in inventory</p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-9">
            <Link href="/admin/medicines/create"><Plus className="w-4 h-4" />Add Medicine</Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search medicines…" className="pl-9 h-10 border-slate-200 bg-white focus-visible:ring-emerald-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                  {["Medicine", "Form / Strength", "Manufacturer", "Expiry", "Price", "Stock", "Status", ""].map((h, i) => (
                    <TableHead key={i} className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 7 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}><Skeleton className="h-4 w-full max-w-[100px]" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Pill className="w-8 h-8" />
                        <p className="text-sm font-medium">No medicines found</p>
                        <Button asChild size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                          <Link href="/admin/medicines/create"><Plus className="w-3.5 h-3.5" />Add Medicine</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((med) => (
                    <TableRow key={med.id} className="hover:bg-emerald-50/30 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{med.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {[med.dosageForm, med.strength].filter(Boolean).join(" · ") || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{med.manufacturer ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {med.unitPrice != null ? `৳${med.unitPrice.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={`font-semibold text-sm ${med.stockQuantity === 0 ? "text-red-600" : med.stockQuantity <= med.minimumStock ? "text-orange-600" : "text-slate-800"}`}>
                            {med.stockQuantity}
                          </span>
                          <span className="text-xs text-slate-400">/ min {med.minimumStock}</span>
                        </div>
                      </TableCell>
                      <TableCell><StockBadge medicine={med} /></TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50" onClick={() => { setStockAction({ id: med.id, type: "increase" }); setQty(1); }}>
                              <TrendingUp className="w-3.5 h-3.5" /> Increase Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-orange-700 focus:text-orange-700 focus:bg-orange-50" onClick={() => { setStockAction({ id: med.id, type: "decrease" }); setQty(1); }}>
                              <TrendingDown className="w-3.5 h-3.5" /> Decrease Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setDeleteId(med.id)}>
                              <Trash2 className="w-3.5 h-3.5" /> Delete
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="border-slate-200 h-8"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="border-slate-200 h-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Stock Adjust Dialog */}
      <Dialog open={!!stockAction} onOpenChange={(o) => !o && setStockAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {stockAction?.type === "increase"
                ? <><TrendingUp className="w-4 h-4 text-emerald-600" />Increase Stock</>
                : <><TrendingDown className="w-4 h-4 text-orange-600" />Decrease Stock</>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
              <span className="font-semibold">{actionMedicine?.name}</span>
              <span className="text-slate-400 ml-2">Current: {actionMedicine?.stockQuantity}</span>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Quantity</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-9 text-center border-slate-200 focus-visible:ring-blue-500 w-20"
                />
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200" onClick={() => setQty((q) => q + 1)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockAction(null)} disabled={isAdjusting}>Cancel</Button>
            <Button
              onClick={handleStockAdjust}
              disabled={isAdjusting}
              className={stockAction?.type === "increase" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-orange-500 hover:bg-orange-600"}
            >
              {isAdjusting ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : stockAction?.type === "increase" ? "Increase" : "Decrease"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this medicine from the inventory.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMedicineMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {deleteMedicineMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}