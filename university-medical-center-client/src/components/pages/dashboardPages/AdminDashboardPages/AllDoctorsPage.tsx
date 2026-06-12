"use client";

import { useState } from "react";
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
  Stethoscope, Search, MoreVertical, ChevronLeft, ChevronRight, UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useDoctors } from "@/hooks/queries/useDoctorQueries";

export default function AllDoctorsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useDoctors(page, limit);

  const doctors = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = doctors.filter(
    (d) =>
      (d.user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.user?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-500" />
              All Doctors
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{total} doctor{total !== 1 ? "s" : ""} registered</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 gap-2 h-9">
            <Link href="/dashboard/create-doctor">
              <UserPlus className="w-4 h-4" /> Add Doctor
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or specialization…"
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
                  {["Doctor", "Specialization", "Qualification", "Contact", "Status"].map((h, i) => (
                    <TableHead key={h} className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 4 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
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
                        <Stethoscope className="w-8 h-8" />
                        <p className="text-sm font-medium">No doctors found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-blue-50/40 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600">{(doc.user?.name ?? "").charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">Dr. {doc.user?.name ?? ""}</p>
                            <p className="text-xs text-slate-400">{doc.user?.email ?? ""}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{doc.specialization}</TableCell>
                      <TableCell className="text-sm text-slate-600">{doc.qualification}</TableCell>
                      <TableCell className="text-sm text-slate-600">{doc.user?.phone ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={doc.user?.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs" : "bg-red-50 text-red-700 border-red-200 text-xs"}>
                          {doc.user?.status}
                        </Badge>
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
      </div>
    </div>
  );
}
