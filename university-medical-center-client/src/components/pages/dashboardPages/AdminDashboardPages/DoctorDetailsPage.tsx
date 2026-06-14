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
      const payload = {
        ...form,
        specialization: form.specialization || null,
        qualification: form.qualification || null,
      };
      await updateMutation.mutateAsync({ id: doctor.id, ...payload });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/all-doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-md border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Dr. {name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
              </div>
              <Badge variant="outline" className={status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(doctor.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Doctor Information</h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoItem icon={<User className="w-4 h-4 text-blue-600 dark:text-blue-400" />} label="Full Name" value={name} />
              <InfoItem icon={<Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />} label="Email" value={email} />
              <InfoItem icon={<Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />} label="Specialization" value={doctor.specialization} />
              <InfoItem icon={<GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />} label="Qualification" value={doctor.qualification} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Edit Doctor (Admin)</h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />Gender
              </Label>
              <Select value={form.gender ?? ""} onValueChange={(v) => set("gender", v)}>
                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
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
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />Account Status
              </Label>
              <Select value={form.status ?? ""} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="h-10 border-slate-200 dark:border-slate-700 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 dark:border-slate-700">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />Specialization
              </Label>
              <input
                type="text"
                placeholder="e.g. Cardiology"
                value={form.specialization ?? ""}
                onChange={(e) => set("specialization", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />Qualification
              </Label>
              <input
                type="text"
                placeholder="e.g. MBBS, MD"
                value={form.qualification ?? ""}
                onChange={(e) => set("qualification", e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200 dark:border-slate-700" onClick={() => router.back()} disabled={updateMutation.isPending}>Cancel</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 gap-2 shadow-md shadow-blue-500/20" onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delete Doctor</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Permanently remove this doctor from the system</p>
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

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}
