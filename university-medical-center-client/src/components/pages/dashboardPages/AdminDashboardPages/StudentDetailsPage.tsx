"use client";

import type { Student } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Mail, Phone, User,
  BookOpen, Calendar, Droplets, ShieldCheck, Hash,
} from "lucide-react";
import Link from "next/link";

const BLOOD_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A−", B_POSITIVE: "B+", B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB−", O_POSITIVE: "O+", O_NEGATIVE: "O−",
};

export default function StudentDetailsPage({ student }: { student: Student }) {
  const name = student.user?.name ?? student.name ?? "Unknown";
  const email = student.user?.email ?? student.email ?? "—";
  const status = student.user?.status ?? student.status;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>

        {/* Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <span className="text-2xl font-bold text-violet-600">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{student.studentId}</span>
                  <span className="text-sm text-slate-500">{student.department} · {student.session}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {student.bloodGroup && (
                  <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
                    {BLOOD_LABEL[student.bloodGroup] ?? student.bloodGroup}
                  </span>
                )}
                <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                  {status}
                </Badge>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />Joined {new Date(student.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Student Information</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="text-sm font-medium text-slate-800">{name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Hash className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Student ID</p>
                  <p className="text-sm font-medium text-slate-800 font-mono">{student.studentId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-800">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Contact</p>
                  <p className="text-sm font-medium text-slate-800">{student.contactNumber ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Department</p>
                  <p className="text-sm font-medium text-slate-800">{student.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Session</p>
                  <p className="text-sm font-medium text-slate-800">{student.session}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Droplets className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Blood Group</p>
                  <p className="text-sm font-medium text-slate-800">{student.bloodGroup ? (BLOOD_LABEL[student.bloodGroup] ?? student.bloodGroup) : "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-medium text-slate-800">{status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1 border-slate-200">
            <Link href="/dashboard/all-students">Back to List</Link>
          </Button>
          <Button asChild className="flex-1 bg-violet-600 hover:bg-violet-700">
            <Link href={`/dashboard/manage-students/${student.id}`}>Edit Student</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
