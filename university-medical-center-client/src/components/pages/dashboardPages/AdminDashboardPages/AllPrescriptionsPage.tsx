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
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Eye, ChevronLeft, ChevronRight,
  FileText,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePrescriptions } from "@/hooks/queries/usePrescriptionQueries";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function AllPrescriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = usePrescriptions(page, limit);

  const prescriptions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = prescriptions.filter((p) => {
    const studentName = p.student?.user?.name ?? "";
    const doctorName = p.doctor?.user?.name ?? "";
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      doctorName.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === "ALL" || p.status === statusFilter);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> All Prescriptions
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} prescription{total !== 1 ? "s" : ""} total</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search patient, doctor, diagnosis…" className="pl-9 h-10 border-slate-200 bg-white focus-visible:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
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

        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-100 hover:bg-slate-50">
                 {["Patient", "Doctor", "Diagnosis", "Medicines", "Date", "Status", "Action"].map((h, i) => (
                  <TableHead
                    key={i}
                    className={`text-xs uppercase tracking-wider text-slate-500 font-semibold ${
                    i === 0 ? "pl-6" : ""
                    } ${i === 6 ? "pr-6 text-center" : ""}`}
                  >
                  {h}
                  </TableHead>
                 ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}><Skeleton className="h-4 w-full max-w-30" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <FileText className="w-8 h-8" />
                        <p className="text-sm font-medium">No prescriptions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((rx) => (
                    <TableRow key={rx.id} className="hover:bg-blue-50/40 transition-colors border-b border-slate-50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-violet-600">{(rx.student?.user?.name ?? "?").charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-800">{rx.student?.user?.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">{(rx.doctor?.user?.name ?? "?").charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm text-slate-600">{rx.doctor?.user?.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-40 truncate">{rx.diagnosis}</TableCell>
                      <TableCell>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {rx.medicines?.length ?? 0} item{(rx.medicines?.length ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(rx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusStyles[rx.status] ?? "bg-slate-100 text-slate-500"}`}>{rx.status}</Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-center">
                        <Link href={`/dashboard/all-prescriptions/${rx.id}`}>
                          <Button
                           variant="ghost"
                           size="icon"
                           className="text-blue-600 hover:bg-blue-50"
                          >
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