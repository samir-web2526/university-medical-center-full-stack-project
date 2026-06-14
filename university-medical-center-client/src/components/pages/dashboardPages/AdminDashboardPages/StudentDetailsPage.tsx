"use client";

import { useState } from "react";
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
  ArrowLeft, Mail, Phone, User,
  BookOpen, Calendar, Droplets, ShieldCheck, Hash,
  Edit, Save, X, Users,
} from "lucide-react";
import Link from "next/link";
import { useUpdateStudent } from "@/hooks/queries/useStudentQueries";
import { useRouter } from "next/navigation";

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
];

const BLOOD_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A−", B_POSITIVE: "B+", B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB−", O_POSITIVE: "O+", O_NEGATIVE: "O−",
};

const GENDER_LABEL: Record<string, string> = {
  MALE: "Male", FEMALE: "Female", OTHER: "Other",
};

export default function StudentDetailsPage({ student }: { student: Student }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<AdminUpdateStudentRequest>>({});

  const name = student.user?.name ?? student.name ?? "Unknown";
  const email = student.user?.email ?? student.email ?? "—";
  const status = student.user?.status ?? student.status;

  const updateMutation = useUpdateStudent();

  const set = (k: keyof AdminUpdateStudentRequest, v: string) =>
    setEdits((prev) => ({ ...prev, [k]: v }));

  const deptOrSessionChanged = !!(edits.department || edits.session);
  const studentIdChanged = !!edits.studentId;
  const studentIdRequired = deptOrSessionChanged && !studentIdChanged;

  const handleSave = async () => {
    if (studentIdRequired) {
      toast.error("Student ID must be updated when department or session is changed");
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: student.id, ...edits });
      toast.success("Student updated successfully");
      setIsEditing(false);
      setEdits({});
      setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update student");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEdits({});
  };

  const hasChanges = Object.keys(edits).length > 0;
  const inputClass = "h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-students" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{name}</h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{student.studentId}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{student.department} · {student.session}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {student.bloodGroup && (
                  <span className="text-xs font-semibold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-1 rounded">
                    {BLOOD_LABEL[student.bloodGroup] ?? student.bloodGroup}
                  </span>
                )}
                <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}>
                  {status}
                </Badge>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />Joined {new Date(student.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                {isEditing ? "Edit Student Profile" : "Student Information"}
              </h2>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/20">
                  <Edit className="w-4 h-4" /> Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />Student ID
                  </Label>
                  <Input placeholder="e.g. 2021-001" value={edits.studentId ?? student.studentId} onChange={(e) => set("studentId", e.target.value)} className={`${inputClass} font-mono`} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />Department
                  </Label>
                  <Input placeholder="e.g. CSE" value={edits.department ?? student.department} onChange={(e) => set("department", e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />Session
                  </Label>
                  <Input placeholder="e.g. 2021-22" value={edits.session ?? student.session} onChange={(e) => set("session", e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />Gender
                  </Label>
                  <Select value={edits.gender ?? ""} onValueChange={(v) => set("gender", v)}>
                    <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />Blood Group
                  </Label>
                  <Select value={edits.bloodGroup ?? student.bloodGroup ?? ""} onValueChange={(v) => set("bloodGroup", v)}>
                    <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>{BLOOD_LABEL[bg]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />Account Status
                  </Label>
                  <Select value={edits.status ?? status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-2 pt-2">
                  {studentIdRequired && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-1.5">
                      Student ID must be updated when changing department or session.
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-slate-200 dark:border-slate-700" onClick={handleCancel} disabled={updateMutation.isPending}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button className="flex-1 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700 gap-2 shadow-md shadow-violet-500/20" onClick={handleSave} disabled={updateMutation.isPending || !hasChanges || studentIdRequired}>
                      {updateMutation.isPending ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem icon={<User className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Full Name" value={name} />
                <InfoItem icon={<Hash className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Student ID" value={student.studentId} mono />
                <InfoItem icon={<Mail className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Email" value={email} />
                <InfoItem icon={<Phone className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Contact" value={student.contactNumber ?? "—"} />
                <InfoItem icon={<BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Department" value={student.department} />
                <InfoItem icon={<Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Session" value={student.session} />
                <InfoItem icon={<Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Gender" value={student.gender ? (GENDER_LABEL[student.gender] ?? student.gender) : "—"} />
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Droplets className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Blood Group</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{student.bloodGroup ? (BLOOD_LABEL[student.bloodGroup] ?? student.bloodGroup) : "—"}</p>
                  </div>
                </div>
                <InfoItem icon={<ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />} label="Status" value={status} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
