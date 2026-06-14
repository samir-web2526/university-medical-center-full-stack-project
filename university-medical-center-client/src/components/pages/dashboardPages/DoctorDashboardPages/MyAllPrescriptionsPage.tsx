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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Ban,
  Sparkles,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { getDoctorPrescriptions } from "@/services/prescription.service";
import type { Prescription } from "@/types";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
};

export default function MyAllPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 50;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setLoading(true);
  };

  useEffect(() => {
    let cancelled = false;
    getDoctorPrescriptions(page, limit).then((res) => {
      if (cancelled) return;
      if (res.data) {
        setPrescriptions(res.data.data);
        setTotal(res.data.meta.total);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [page, limit]);

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    const studentName = p.student?.user?.name?.toLowerCase() ?? "";
    return (
      studentName.includes(q) ||
      p.diagnosis.toLowerCase().includes(q)
    );
  });

  const activePrescriptions = filtered.filter((p) => p.status === "ACTIVE");
  const cancelledPrescriptions = filtered.filter((p) => p.status === "CANCELLED");

  const tabItems = [
    { value: "ALL", label: "All", count: filtered.length },
    { value: "ACTIVE", label: "Active", count: activePrescriptions.length },
    { value: "CANCELLED", label: "Cancelled", count: cancelledPrescriptions.length },
  ];

  const getDisplayList = () => {
    if (activeTab === "ACTIVE") return activePrescriptions;
    if (activeTab === "CANCELLED") return cancelledPrescriptions;
    return filtered;
  };

  const displayList = getDisplayList();

  const renderTable = (items: Prescription[], emptyMessage: string) => (
    <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 overflow-hidden dark:bg-slate-900">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold pl-6">
                Patient
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Diagnosis
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Date
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold pr-6 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                      <Skeleton className="h-4 w-full max-w-35 dark:bg-slate-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((rx) => (
                <TableRow
                  key={rx.id}
                  className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors border-b border-slate-50 dark:border-slate-800"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">
                          {rx.student?.user?.name?.charAt(0)?.toUpperCase() ?? "S"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {rx.student?.user?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {rx.student?.studentId ?? ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-400 max-w-50 truncate">
                    {rx.diagnosis}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(rx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs rounded-xl ${statusStyles[rx.status] ?? ""}`}
                    >
                      {rx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-xl" asChild>
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
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              Prescriptions
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 ml-12">
              {total} prescription{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-9 rounded-xl">
            <Link href="/dashboard/create-prescription">
              <Plus className="w-4 h-4" />
              New Prescription
            </Link>
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search patient or diagnosis…"
            className="pl-9 h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 bg-white dark:bg-slate-900 dark:text-white rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-950 dark:data-[state=active]:text-emerald-400 gap-1.5 rounded-xl"
              >
                {tab.value === "CANCELLED" && <Ban className="w-3 h-3" />}
                {tab.label}
                <span className="text-xs text-slate-400 dark:text-slate-500">({tab.count})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ALL" className="mt-4">
            {renderTable(displayList, "No prescriptions found")}
          </TabsContent>
          <TabsContent value="ACTIVE" className="mt-4">
            {renderTable(displayList, "No active prescriptions")}
          </TabsContent>
          <TabsContent value="CANCELLED" className="mt-4">
            {renderTable(displayList, "No cancelled prescriptions")}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} of {Math.max(1, Math.ceil(total / limit))}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="border-slate-200 dark:border-slate-700 h-8 rounded-xl dark:bg-slate-900 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page * limit >= total || loading}
              className="border-slate-200 dark:border-slate-700 h-8 rounded-xl dark:bg-slate-900 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
