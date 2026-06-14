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
  GraduationCap, Search, Eye, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useStudents } from "@/hooks/queries/useStudentQueries";
import Link from "next/link";

const BLOOD_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A−", B_POSITIVE: "B+", B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB−", O_POSITIVE: "O+", O_NEGATIVE: "O−",
};

export default function AllStudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useStudents(page, limit);

  const students = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const filtered = students.filter(
    (s) =>
      (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.user?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              All Students
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-11">{total} student{total !== 1 ? "s" : ""} enrolled</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search by name, ID or department…"
            className="pl-9 h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-violet-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {["Student", "Student ID", "Department", "Session", "Blood", "Status", "Action"].map((h, i) => (
                    <TableHead
                      key={h}
                      className={`text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold ${i === 0 ? "pl-6" : ""}`}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-27.5" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                        <GraduationCap className="w-8 h-8" />
                        <p className="text-sm font-medium">No students found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((stu) => (
                    <TableRow key={stu.id} className="hover:bg-violet-50/40 dark:hover:bg-violet-950/20 transition-colors border-b border-slate-50 dark:border-slate-800">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                            <span className="text-xs font-bold text-white">{(stu.user?.name ?? "?").charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">{stu.user?.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{stu.user?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">{stu.studentId}</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">{stu.department}</TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">{stu.session}</TableCell>
                      <TableCell>
                        {stu.bloodGroup ? (
                          <span className="text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
                            {BLOOD_LABEL[stu.bloodGroup] ?? stu.bloodGroup}
                          </span>
                        ) : <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={stu?.user?.status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs"}>
                          {stu.user?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/all-students/${stu.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20">
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading} className="border-slate-200 dark:border-slate-700 h-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isLoading} className="border-slate-200 dark:border-slate-700 h-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
