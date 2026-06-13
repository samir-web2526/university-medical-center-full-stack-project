"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UpdateDoctorProfileRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Save, User, Phone, Stethoscope, GraduationCap } from "lucide-react";
import Link from "next/link";
import { getMyProfile, updateMyProfile } from "@/services/doctor.service";

interface FormState {
  name: string;
  phone: string;
  specialization: string;
  qualification: string;
}

export default function UpdateMyProfile() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.user?.name ?? "",
          phone: data.user?.phone ?? "",
          specialization: data.specialization ?? "",
          qualification: data.qualification ?? "",
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

    const payload: UpdateDoctorProfileRequest = {
      name: form.name || undefined,
      phone: form.phone || undefined,
      specialization: form.specialization || null,
      qualification: form.qualification || null,
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

  const fields: {
    key: keyof FormState;
    label: string;
    placeholder: string;
    icon: React.ElementType;
    type?: string;
  }[] = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "Dr. John Doe",
      icon: User,
    },
    {
      key: "specialization",
      label: "Specialization",
      placeholder: "e.g. Cardiology, Neurology",
      icon: Stethoscope,
    },
    {
      key: "qualification",
      label: "Qualification",
      placeholder: "e.g. MBBS, MD, FCPS",
      icon: GraduationCap,
    },
    {
      key: "phone",
      label: "Contact Number",
      placeholder: "+880 1XXX-XXXXXX",
      icon: Phone,
      type: "tel",
    },
  ];

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
              Keep your information accurate so patients can find you easily.
            </CardDescription>
          </CardHeader>
          <Separator />

          <CardContent className="pt-6 space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <field.icon className="w-3.5 h-3.5 text-blue-500" />
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="h-10 border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-400"
                />
              </div>
            ))}

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
                className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
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
            {Array.from({ length: 4 }).map((_, i) => (
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
