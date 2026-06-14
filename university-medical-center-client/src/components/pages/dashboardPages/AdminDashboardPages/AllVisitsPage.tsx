"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ClipboardList, Search,
  Eye, ChevronLeft, ChevronRight,
  Thermometer, Heart, Activity,
} from "lucide-react";
import Link from "next/link";
import { useVisits } from "@/hooks/queries/useVisitQueries";

export default function AllVisitsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useVisits(page, limit);

  const visits = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const filtered = visits.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.student?.user?.name ?? "").toLowerCase().includes(q) ||
      (v.doctor?.user?.name ?? "").toLowerCase().includes(q) ||
      v.chiefComplaint.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              All Visits
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-11">{total} visit{total !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search patient, doctor or complaint…"
            className="pl-9 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-visible:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {["Patient", "Doctor", "Vitals", "Visit Date", "Action"].map((h, i) => (
                    <TableHead key={i} className={`text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 4 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}><Skeleton className="h-4 w-full max-w-30" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                        <ClipboardList className="w-8 h-8" />
                        <p className="text-sm font-medium">No visits found</p>
                        <p className="text-xs">Patient visits will appear here</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((visit) => (
                    <TableRow key={visit.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors border-b border-slate-50 dark:border-slate-800">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                            <span className="text-xs font-bold text-white">{(visit.student?.user?.name ?? "?").charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{visit.student?.user?.name ?? "---"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{visit.doctor?.user?.name ?? "---"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                          {visit.temperature && (
                            <span className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-1.5 py-0.5 rounded">
                              <Thermometer className="w-3 h-3" />{visit.temperature}
                            </span>
                          )}
                          {visit.bloodPressure && (
                            <span className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded">
                              <Heart className="w-3 h-3" />{visit.bloodPressure}
                            </span>
                          )}
                          {visit.pulseRate && (
                            <span className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded">
                              <Activity className="w-3 h-3" />{visit.pulseRate}
                            </span>
                          )}
                          {!visit.temperature && !visit.bloodPressure && !visit.pulseRate && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(visit.visitDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Link href={`/dashboard/all-visits/${visit.id}`}>
                          <Button variant="ghost" size="icon" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20">
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="border-slate-200 dark:border-slate-700 h-8"><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="border-slate-200 dark:border-slate-700 h-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
