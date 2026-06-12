"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Doctor, AdminUpdateDoctorRequest } from "@/types";
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
  ArrowLeft, Save, User, Mail, Phone,
  Stethoscope, GraduationCap, ShieldCheck, Calendar,
} from "lucide-react";
import Link from "next/link";
import { useUpdateDoctor } from "@/hooks/queries/useDoctorQueries";

export default function ManageDoctorPage({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [edits, setEdits] = useState<Partial<AdminUpdateDoctorRequest>>({});

  const form: AdminUpdateDoctorRequest = {
    name: doctor.user?.name ?? doctor.name ?? "",
    specialization: doctor.specialization,
    qualification: doctor.qualification,
    contactNumber: doctor.contactNumber ?? "",
    status: doctor.user?.status ?? doctor.status,
    ...edits,
  };

  const updateMutation = useUpdateDoctor();

  const set = (k: keyof AdminUpdateDoctorRequest, v: string) =>
    setEdits((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: doctor.id, ...form });
      toast.success("Doctor updated successfully");
      router.push("/admin/doctors");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update doctor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        {/* Doctor Header Card */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{(doctor.user?.name ?? doctor.name ?? "?").charAt(0).toUpperCase()}</span>
            </div>
            <div className="pt-10 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Dr. {doctor.user?.name ?? doctor.name}</h1>
                <p className="text-sm text-slate-500">{doctor.specialization}</p>
              </div>
              <Badge variant="outline" className={(doctor.user?.status ?? doctor.status) === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                <ShieldCheck className="w-3 h-3 mr-1" />{doctor.user?.status ?? doctor.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{doctor.user?.email ?? doctor.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {new Date(doctor.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Edit Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700">Edit Doctor Profile</h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            {[
              { key: "name" as const, label: "Full Name", placeholder: "Dr. John Doe", icon: User },
              { key: "specialization" as const, label: "Specialization", placeholder: "e.g. Cardiology", icon: Stethoscope },
              { key: "qualification" as const, label: "Qualification", placeholder: "e.g. MBBS, MD", icon: GraduationCap },
              { key: "contactNumber" as const, label: "Contact Number", placeholder: "+880 1XXX-XXXXXX", icon: Phone },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-blue-500" />{f.label}
                </Label>
                <Input
                  placeholder={f.placeholder}
                  value={(form[f.key] as string) ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            ))}

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />Account Status
              </Label>
              <Select value={form.status ?? doctor.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="h-10 border-slate-200 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
      </div>
    </div>
  );
}