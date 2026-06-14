"use client";

import { useEffect, useState } from "react";
import { getAllMedicines } from "@/actions/medicine.actions";
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
  Pill, Search, Eye, ChevronLeft, ChevronRight,
  Sparkles, Package, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DoctorMedicinesListPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
  };

  useEffect(() => {
    let cancelled = false;
    getAllMedicines(page, limit).then(({ data, error }) => {
      if (cancelled) return;
      if (error) toast.error(error);
      else { setMedicines(data?.data ?? []); setTotal(data?.meta?.total ?? 0); }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
      m.strength?.toLowerCase().includes(search.toLowerCase())
  );

  const isLowStock = (medicine: Medicine) => medicine.stockQuantity <= medicine.minimumStock;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 shadow-lg">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC00aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Package className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Medicines
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </h1>
              <p className="text-emerald-100 text-sm mt-0.5">
                Browse available medicines for prescriptions
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search medicines by name or strength…"
            className="pl-9 h-10 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:ring-emerald-500 bg-white rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Card */}
        <Card className="border-0 shadow-md overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {["Medicine", "Manufacturer", "Dosage Form", "Strength", "Stock Status", "Price", "Action"].map((h, i) => (
                    <TableHead key={h} className={`text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 6 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-30 dark:bg-slate-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                          <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No medicines found</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Try adjusting your search query</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((med) => (
                    <TableRow key={med.id} className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors border-b border-slate-50 dark:border-slate-800">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{med.name}</p>
                            <p className="text-xs text-slate-400">{med.dosageForm ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{med.manufacturer ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{med.dosageForm ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">{med.strength ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isLowStock(med)
                              ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-xs"
                              : med.stockQuantity === 0
                              ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-xs"
                              : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs"
                          }
                        >
                          {med.stockQuantity === 0
                            ? "Out of Stock"
                            : isLowStock(med)
                            ? "Low Stock"
                            : `${med.stockQuantity} units`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-xl transition-all">
                          <Link href={`/dashboard/medicines/${med.id}`}>
                            <Eye className="w-4 h-4" /> View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
