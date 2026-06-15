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
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { getVisits } from "@/services/visit.service";
import type { Visit, Student } from "@/types";

interface PatientRow {
  student: Student;
  lastVisit: string;
  totalVisits: number;
}

export default function MyAllPatientsPage() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    let cancelled = false;
    getVisits(page, limit).then((res) => {
      if (cancelled) return;
      if (res.data) {
        const visitData = res.data.data ?? [];
        const map = new Map<string, PatientRow>();

        visitData.forEach((v: Visit) => {
          if (!v.student) return;
          const sid = v.student.id;
          if (map.has(sid)) {
            const existing = map.get(sid)!;
            existing.totalVisits += 1;
            if (new Date(v.visitDate) > new Date(existing.lastVisit)) {
              existing.lastVisit = v.visitDate;
            }
          } else {
            map.set(sid, {
              student: v.student,
              lastVisit: v.visitDate,
              totalVisits: 1,
            });
          }
        });

        setPatients(Array.from(map.values()));
        setTotal(res.data.meta.total);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.student.user?.name?.toLowerCase().includes(q) ||
      p.student.user?.email?.toLowerCase().includes(q) ||
      p.student.studentId?.toLowerCase().includes(q) ||
      p.student.department?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-2xl bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">My Patients</h1>
          </div>
          <p className="text-emerald-100 text-sm ml-13">
            {patients.length} unique patient{patients.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search by name, email, ID or department..."
              className="pl-9 h-11 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus-visible:ring-emerald-500 bg-white rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-0 shadow-md overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold pl-6">
                    Patient
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Student ID
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Department
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Total Visits
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Last Visit
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="dark:border-slate-800">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-35 dark:bg-slate-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center">
                          <Users className="w-8 h-8 text-emerald-400 dark:text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No patients found</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Create a visit to see patients here</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow
                      key={p.student.id}
                      className="hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-colors border-b border-slate-50 dark:border-slate-800"
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {p.student.user?.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                              {p.student.user?.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {p.student.user?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                          {p.student.studentId}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {p.student.department}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                          {p.totalVisits}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(p.lastVisit).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="border-slate-200 dark:border-slate-700 h-9 rounded-xl dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="border-slate-200 dark:border-slate-700 h-9 rounded-xl dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
