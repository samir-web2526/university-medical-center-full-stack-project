"use client";

import { useState } from "react";
import { useMedicines } from "@/hooks/queries/useMedicineQueries";
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
  Pill, Search, Eye, Plus,
  ChevronLeft, ChevronRight, AlertTriangle,
} from "lucide-react";
import Link from "next/link";

function StockBadge({ medicine }: { medicine: Medicine }) {
  if (medicine.stockQuantity === 0)
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs gap-1"><AlertTriangle className="w-3 h-3" />Out of Stock</Badge>;
  if (medicine.stockQuantity <= medicine.minimumStock)
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs gap-1"><AlertTriangle className="w-3 h-3" />Low Stock</Badge>;
  return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">In Stock</Badge>;
}

export default function AllMedicinePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useMedicines(page, limit);

  const medicines = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.manufacturer ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.dosageForm ?? "").toLowerCase().includes(search.toLowerCase())
  );

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
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search medicines..." className="pl-9 h-10 border-slate-200 bg-white focus-visible:ring-emerald-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                  {["Medicine", "Form / Strength", "Manufacturer", "Expiry", "Price", "Stock", "Status", "Action"].map((h, i) => (
                    <TableHead key={i} className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 7 ? "pr-6 text-center" : ""}`}>{h}</TableHead>
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
                          <Link href="/dashboard/create-medicine"><Plus className="w-3.5 h-3.5" />Add Medicine</Link>
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
                      <TableCell className="pr-6 text-center">
                        <Link href={`/dashboard/all-medicines/${med.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
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
    </div>
  );
}
