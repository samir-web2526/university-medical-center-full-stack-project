"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getDoctorPrescriptions } from "@/services/prescription.service";
import type { Prescription } from "@/types";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function MyAllPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchPrescriptions = () => {
    setLoading(true);
    getDoctorPrescriptions(page, limit).then((res) => {
      if (res.data) {
        setPrescriptions(res.data.data);
        setTotal(res.data.meta.total);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    const studentName = p.student?.user?.name?.toLowerCase() ?? "";
    const matchSearch =
      studentName.includes(q) ||
      p.diagnosis.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Prescriptions
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {total} prescription{total !== 1 ? "s" : ""} issued
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 gap-2 h-9">
            <Link href="/dashboard/create-prescription">
              <Plus className="w-4 h-4" />
              New Prescription
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search patient or diagnosis…"
              className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-10 border-slate-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold pl-6">
                    Patient
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Diagnosis
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold pr-6 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-[140px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <FileText className="w-8 h-8" />
                        <p className="text-sm font-medium">No prescriptions yet</p>
                        <p className="text-xs">Create your first prescription to get started</p>
                        <Button asChild size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 gap-1.5">
                          <Link href="/dashboard/create-prescription">
                            <Plus className="w-3.5 h-3.5" />
                            New Prescription
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rx) => (
                    <TableRow
                      key={rx.id}
                      className="hover:bg-blue-50/40 transition-colors border-b border-slate-50"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-emerald-600">
                              {rx.student?.user?.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {rx.student?.user?.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {rx.student?.studentId ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                        {rx.diagnosis}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(rx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${statusStyles[rx.status] ?? ""}`}
                        >
                          {rx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" asChild>
                          <Link href={`/dashboard/prescriptions/${rx.id}`}>
                            <Eye className="w-4 h-4" />
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="border-slate-200 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="border-slate-200 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
