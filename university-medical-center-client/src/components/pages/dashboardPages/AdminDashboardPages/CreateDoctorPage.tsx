"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft, UserPlus, Mail, User,
  Stethoscope, GraduationCap, Phone, KeyRound, Eye, EyeOff,
} from "lucide-react";
import Link from "next/link";
import type { CreateDoctorRequest } from "@/types";
import { useCreateDoctor } from "@/hooks/queries/useDoctorQueries";

export default function CreateDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateDoctorRequest>({
    name: "", email: "", password: "", specialization: "", qualification: "", contactNumber: "",
  });
  const [showPass, setShowPass] = useState(false);
  const createMutation = useCreateDoctor();

  const set = (k: keyof CreateDoctorRequest, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) return toast.error("Name and email are required");
    try {
      await createMutation.mutateAsync(form);
      toast.success("Doctor account created!");
      router.push("/dashboard/all-doctors");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create doctor");
    }
  };

  const fields: { key: keyof CreateDoctorRequest; label: string; placeholder: string; icon: React.ElementType; type?: string }[] = [
    { key: "name", label: "Full Name", placeholder: "Dr. John Doe", icon: User },
    { key: "email", label: "Email Address", placeholder: "doctor@clinic.com", icon: Mail, type: "email" },
    { key: "specialization", label: "Specialization", placeholder: "e.g. Cardiology", icon: Stethoscope },
    { key: "qualification", label: "Qualification", placeholder: "e.g. MBBS, MD", icon: GraduationCap },
    { key: "contactNumber", label: "Contact Number", placeholder: "+880 1XXX-XXXXXX", icon: Phone, type: "tel" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/dashboard/all-doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Add New Doctor</CardTitle>
                <CardDescription className="text-slate-500 text-sm">The doctor will receive a temporary password and must change it on first login.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-blue-500" /> {f.label}
                </Label>
                <Input
                  id={f.key}
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  value={(form[f.key] as string) ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500"
                />
              </div>
            ))}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                Temporary Password
                <span className="text-slate-400 font-normal">(optional — defaults to doctor@123)</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Leave blank for default"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              The doctor will be prompted to update their password and complete their profile on first login.
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => router.back()} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2" onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating…</>
                ) : (
                  <><UserPlus className="w-3.5 h-3.5" />Create Doctor</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}