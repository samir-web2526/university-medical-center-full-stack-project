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

  const load = (p = page) => {
    setLoading(true);
    getAllMedicines(p, limit).then(({ data, error }) => {
      if (error) toast.error(error);
      else { setMedicines(data?.data ?? []); setTotal(data?.meta?.total ?? 0); }
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
      m.strength?.toLowerCase().includes(search.toLowerCase())
  );

  const isLowStock = (medicine: Medicine) => medicine.stockQuantity <= medicine.minimumStock;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-blue-500" />
            Medicines
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Browse available medicines for prescriptions</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search medicines by name or strength…"
            className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-white"
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
                  {["Medicine", "Manufacturer", "Dosage Form", "Strength", "Stock Status", "Price", "Action"].map((h, i) => (
                    <TableHead key={h} className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 6 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
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
                    <TableRow key={med.id} className="hover:bg-blue-50/40 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{med.name}</p>
                            <p className="text-xs text-slate-400">{med.dosageForm ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{med.manufacturer ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600">{med.dosageForm ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600">{med.strength ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isLowStock(med)
                              ? "bg-red-50 text-red-700 border-red-200 text-xs"
                              : med.stockQuantity === 0
                              ? "bg-red-50 text-red-700 border-red-200 text-xs"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                          }
                        >
                          {med.stockQuantity === 0
                            ? "Out of Stock"
                            : isLowStock(med)
                            ? "Low Stock"
                            : `${med.stockQuantity} units`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {med.unitPrice ? `৳${med.unitPrice.toFixed(2)}` : "—"}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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
            <p className="text-sm text-slate-600">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
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
