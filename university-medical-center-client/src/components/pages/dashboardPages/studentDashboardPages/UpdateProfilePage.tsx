"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UpdateStudentProfileRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, User, GraduationCap, Droplets } from "lucide-react";
import Link from "next/link";
import { getMyProfile, updateMyProfile } from "@/services/student.service";

interface FormState {
  name: string;
  department: string;
  session: string;
  bloodGroup: string;
  contactNumber: string;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    department: "",
    session: "",
    bloodGroup: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.user?.name ?? "",
          department: data.department ?? "",
          session: data.session ?? "",
          bloodGroup: data.bloodGroup ?? "",
          contactNumber: data.contactNumber ?? "",
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
      name: form.name || undefined,
      department: form.department || undefined,
      session: form.session || undefined,
      bloodGroup: (form.bloodGroup as any) || undefined,
      contactNumber: form.contactNumber || undefined,
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
              Keep your information accurate.
            </CardDescription>
          </CardHeader>
          <Separator />

          <CardContent className="pt-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-500" />
                Full Name
              </Label>
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                Department
              </Label>
              <Input
                placeholder="e.g. CSE, EEE"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-violet-500" />
                Session
              </Label>
              <Input
                placeholder="e.g. 2020-21"
                value={form.session}
                onChange={(e) => handleChange("session", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-violet-500"
              />
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
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-500" />
                Contact Number
              </Label>
              <Input
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                value={form.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-violet-500"
              />
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
            {Array.from({ length: 5 }).map((_, i) => (
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
