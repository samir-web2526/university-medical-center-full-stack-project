/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Droplets, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getMyProfile, updateMyProfile } from "@/services/student.service";
import type { UpdateStudentProfileRequest } from "@/types";

interface FormState {
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    bloodGroup: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.user?.name ?? "",
          email: data.user?.email ?? "",
          phone: data.user?.phone ?? "",
          gender: data.gender ?? "",
          bloodGroup: data.bloodGroup ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload: UpdateStudentProfileRequest = {
      gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
      bloodGroup: (form.bloodGroup as any) || undefined,
      user: {
        name: form.name || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
      },
    };
    const { error } = await updateMyProfile(payload);
    setSaving(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Profile updated successfully!");
      window.location.href = "/dashboard/me";
    }
  };

  if (loading) return <FormSkeleton />;

  const bloodGroups = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
  const genders = ["MALE", "FEMALE", "OTHER"];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/dashboard/me"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">Update Profile</CardTitle>
            <CardDescription className="text-slate-500">
              Update your personal and academic information.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Personal Information</h3>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-500" />
                  Full Name
                </Label>
                <Input
                  className="h-10 border-slate-200 focus:ring-violet-500"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-violet-500" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    className="h-10 border-slate-200 focus:ring-violet-500"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-violet-500" />
                    Phone
                  </Label>
                  <Input
                    className="h-10 border-slate-200 focus:ring-violet-500"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-violet-500" />
                    Gender
                  </Label>
                  <Select value={form.gender} onValueChange={(v) => handleChange("gender", v)}>
                    <SelectTrigger className="h-10 border-slate-200 focus:ring-violet-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g.charAt(0) + g.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-violet-500" />
                    Blood Group
                  </Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => handleChange("bloodGroup", v)}>
                    <SelectTrigger className="h-10 border-slate-200 focus:ring-violet-500">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700 gap-2"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-4 w-28" />
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
