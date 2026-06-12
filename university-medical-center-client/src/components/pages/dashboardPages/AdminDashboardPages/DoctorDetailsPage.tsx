"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Doctor, AdminUpdateDoctorRequest } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft, Mail, User,
  Stethoscope, GraduationCap, ShieldCheck, Calendar, Save, Trash2,
} from "lucide-react";
import Link from "next/link";
import { useUpdateDoctor, useDeleteDoctor } from "@/hooks/queries/useDoctorQueries";

export default function DoctorDetailsPage({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const name = doctor.user?.name ?? "—";
  const email = doctor.user?.email ?? "—";
  const status = doctor.user?.status;

  const [edits, setEdits] = useState<Partial<AdminUpdateDoctorRequest>>({});

  const form: AdminUpdateDoctorRequest = {
    gender: doctor.gender,
    status: doctor.user?.status,
    qualification: doctor.qualification,
    specialization: doctor.specialization,
    ...edits,
  };

  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();

  const set = (k: keyof AdminUpdateDoctorRequest, v: string) =>
    setEdits((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: doctor.id, ...form });
      toast.success("Doctor updated successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update doctor");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(doctor.id);
      toast.success("Doctor deleted successfully");
      router.push("/dashboard/all-doctors");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete doctor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        {/* Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dr. {name}</h1>
                <p className="text-sm text-slate-500">{doctor.specialization}</p>
              </div>
              <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(doctor.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Doctor Information</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="text-sm font-medium text-slate-800">{name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-800">{email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Specialization</p>
                  <p className="text-sm font-medium text-slate-800">{doctor.specialization}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Qualification</p>
                  <p className="text-sm font-medium text-slate-800">{doctor.qualification}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Edit Card — only allowed fields */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Edit Doctor (Admin)</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />Gender
              </Label>
              <Select value={form.gender ?? ""} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger className="h-10 border-slate-200 focus:ring-blue-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />Account Status
              </Label>
              <Select value={form.status ?? ""} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="h-10 border-slate-200 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialization */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-500" />Specialization
              </Label>
              <input
                type="text"
                placeholder="e.g. Cardiology"
                value={form.specialization ?? ""}
                onChange={(e) => set("specialization", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Qualification */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />Qualification
              </Label>
              <input
                type="text"
                placeholder="e.g. MBBS, MD"
                value={form.qualification ?? ""}
                onChange={(e) => set("qualification", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200" onClick={() => router.back()} disabled={updateMutation.isPending}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Card */}
        <Card className="border-0 shadow-md border-red-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Delete Doctor</h3>
                <p className="text-xs text-slate-400 mt-0.5">Permanently remove this doctor from the system</p>
              </div>
              <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
