"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FileText, Search, Eye, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getMyPrescriptions } from "@/services/prescription.service";
import type { Prescription } from "@/types";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  CANCELLED: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
};

export default function MyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
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
    getMyPrescriptions(page, limit).then((res) => {
      if (cancelled) return;
      if (res.error) toast.error(res.error);
      else {
        setPrescriptions(res.data?.data ?? []);
        setTotal(res.data?.meta?.total ?? 0);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.diagnosis.toLowerCase().includes(q) ||
      p.doctor?.user?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 via-teal-500 to-green-600 p-8 text-white shadow-xl shadow-emerald-500/20">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-green-300/20 blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-green-200" />
              <span className="text-sm font-medium text-emerald-100">Medical Records</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">My Prescriptions</h1>
            <p className="text-emerald-100 text-sm mt-1">
              {total} prescription{total !== 1 ? "s" : ""} total — View your prescriptions
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search by diagnosis or doctor name..."
            className="pl-11 h-12 border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold pl-6">Diagnosis</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Doctor</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-30" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 flex items-center justify-center shadow-inner">
                          <FileText className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No prescriptions found</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try a different search term</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rx, idx) => (
                    <TableRow key={rx.id} className={`hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10 transition-all border-b border-slate-50 dark:border-slate-800 ${idx === 0 ? "bg-emerald-50/20 dark:bg-emerald-900/5" : ""}`}>
                      <TableCell className="pl-6">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{rx.diagnosis}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{rx.doctor?.user?.name?.charAt(0) ?? "—"}</span>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300">{rx.doctor?.user?.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs font-medium rounded-lg ${statusStyles[rx.status] ?? ""}`}>
                          {rx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-8 gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl">
                          <Link href={`/dashboard/prescriptions/${rx.id}`}>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> of <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1 || loading}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => handlePageChange(Math.max(1, page - 1))}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages || loading}
                className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                onClick={() => handlePageChange(page + 1)}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
