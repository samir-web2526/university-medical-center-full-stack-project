"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Student, AdminUpdateStudentRequest, BloodGroup } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft, Save, User, Phone,
  BookOpen, Calendar, Droplets, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useUpdateStudent } from "@/hooks/queries/useStudentQueries";

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
];
const BLOOD_LABEL: Record<BloodGroup, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A−", B_POSITIVE: "B+", B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB−", O_POSITIVE: "O+", O_NEGATIVE: "O−",
};

export default function ManageStudentPage({ student }: { student: Student }) {
  const router = useRouter();
  const [edits, setEdits] = useState<Partial<AdminUpdateStudentRequest>>({});

  const form: AdminUpdateStudentRequest = {
    name: student.user?.name ?? student.name ?? "",
    department: student.department,
    session: student.session,
    bloodGroup: student.bloodGroup ?? undefined,
    contactNumber: student.contactNumber ?? "",
    status: student.user?.status ?? student.status,
    ...edits,
  };

  const updateMutation = useUpdateStudent();

  const set = (k: keyof AdminUpdateStudentRequest, v: string) =>
    setEdits((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: student.id, ...form });
      toast.success("Student updated successfully");
      router.push("/admin/students");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update student");
    }
  };

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
              <span className="text-2xl font-bold text-violet-600">{(student.user?.name ?? student.name ?? "?").charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{student.user?.name ?? student.name}</h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{student.studentId}</span>
                  <span className="text-sm text-slate-500">{student.department} · {student.session}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {student.bloodGroup && (
                  <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded">
                    {BLOOD_LABEL[student.bloodGroup]}
                  </span>
                )}
                <Badge variant="outline" className={(student.user?.status ?? student.status) === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                  {student.user?.status ?? student.status}
                </Badge>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />Joined {new Date(student.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </CardContent>
        </Card>

        {/* Edit Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Edit Student Profile</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name" as const, label: "Full Name", placeholder: "Student name", icon: User, span: 2 },
                { key: "department" as const, label: "Department", placeholder: "e.g. CSE", icon: BookOpen },
                { key: "session" as const, label: "Session", placeholder: "e.g. 2021-22", icon: Calendar },
                { key: "contactNumber" as const, label: "Contact Number", placeholder: "+880 1XXX-XXXXXX", icon: Phone },
              ].map((f) => (
                <div key={f.key} className={f.span === 2 ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <f.icon className="w-3.5 h-3.5 text-violet-500" />{f.label}
                  </Label>
                  <Input
                    placeholder={f.placeholder}
                    value={(form[f.key] as string) ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="h-10 border-slate-200 focus-visible:ring-violet-500"
                  />
                </div>
              ))}

              {/* Blood Group */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-red-500" />Blood Group
                </Label>
                <Select value={form.bloodGroup ?? ""} onValueChange={(v) => set("bloodGroup", v)}>
                  <SelectTrigger className="h-10 border-slate-200 focus:ring-violet-500">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>{BLOOD_LABEL[bg]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />Account Status
                </Label>
                <Select value={form.status ?? student.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="h-10 border-slate-200 focus:ring-violet-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200" onClick={() => router.back()} disabled={updateMutation.isPending}>Cancel</Button>
              <Button className="flex-1 bg-violet-600 hover:bg-violet-700 gap-2" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}