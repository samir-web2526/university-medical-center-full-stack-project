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
import { FileText, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getMyPrescriptions } from "@/services/prescription.service";
import type { Prescription } from "@/types";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
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
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-500" />
            My Prescriptions
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} prescription{total !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by diagnosis or doctor..."
            className="pl-9 h-10 border-slate-200 focus-visible:ring-emerald-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-6">Diagnosis</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Doctor</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Date</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-[120px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <FileText className="w-8 h-8" />
                        <p className="text-sm font-medium">No prescriptions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rx) => (
                    <TableRow key={rx.id} className="hover:bg-emerald-50/40 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <p className="text-sm font-medium text-slate-800">{rx.diagnosis}</p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{rx.doctor?.user?.name ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusStyles[rx.status] ?? ""}`}>
                          {rx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1 || loading}
                onClick={() => handlePageChange(Math.max(1, page - 1))}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages || loading}
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
