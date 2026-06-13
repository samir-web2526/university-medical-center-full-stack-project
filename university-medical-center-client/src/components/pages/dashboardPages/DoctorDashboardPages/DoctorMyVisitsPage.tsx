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
  CalendarDays,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getVisits } from "@/services/visit.service";
import type { Visit, PaginatedResponse } from "@/types";

export default function DoctorMyVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getVisits(page, limit).then((res) => {
      if (res.data) {
        setVisits(res.data.data);
        setTotal(res.data.meta.total);
      }
      setLoading(false);
    });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtered = visits.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.chiefComplaint.toLowerCase().includes(q) ||
      v.student?.name?.toLowerCase().includes(q) ||
      v.student?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-500" />
            My Visits
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} visit{total !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search patient or complaint..."
              className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
                    Chief Complaint
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Vitals
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Date
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
                        <CalendarDays className="w-8 h-8" />
                        <p className="text-sm font-medium">No visits found</p>
                        <p className="text-xs">Create a visit to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((visit) => (
                    <TableRow
                      key={visit.id}
                      className="hover:bg-blue-50/40 transition-colors border-b border-slate-50"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">
                              {visit.student?.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">
                              {visit.student?.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {visit.student?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                        {visit.chiefComplaint}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {visit.bloodPressure && (
                            <Badge variant="outline" className="text-xs bg-slate-50">
                              BP: {visit.bloodPressure}
                            </Badge>
                          )}
                          {visit.temperature && (
                            <Badge variant="outline" className="text-xs bg-slate-50">
                              {visit.temperature}
                            </Badge>
                          )}
                          {visit.weight && (
                            <Badge variant="outline" className="text-xs bg-slate-50">
                              {visit.weight}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(visit.visitDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" asChild>
                          <Link href={`/dashboard/all-visits/${visit.id}`}>
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
