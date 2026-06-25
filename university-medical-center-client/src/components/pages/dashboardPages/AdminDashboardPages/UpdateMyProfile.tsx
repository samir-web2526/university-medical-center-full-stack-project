"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Save, User, Mail, Phone, Sparkles, Pencil } from "lucide-react";
import Link from "next/link";
import { getMyProfile, updateMyProfile } from "@/services/admin.service";

interface FormState {
  name: string;
  email: string;
  phone: string;
}

export default function UpdateMyProfile() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (form.phone && !/^\d{11}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name || undefined,
      email: form.email || undefined,
      phone: form.phone || undefined,
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
    maxLength?: number;
  }[] = [
    {
      key: "name",
      label: "Full Name",
      placeholder: "Administrator",
      icon: User,
    },
    {
      key: "email",
      label: "Email Address",
      placeholder: "admin@umc.edu",
      icon: Mail,
      type: "email",
    },
    {
      key: "phone",
      label: "Contact Number",
      placeholder: "+880 1XXX-XXXXXX",
      icon: Phone,
      type: "tel",
      maxLength: 11,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/dashboard/me"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Profile
        </Link>

        <div className="rounded-2xl bg-linear-to-r from-slate-800 via-slate-700 to-blue-700 p-6 shadow-lg shadow-slate-500/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Update Profile</h1>
          </div>
          <p className="text-slate-300 text-sm ml-13">Keep your information accurate and up to date</p>
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-slate-600 to-blue-600 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Update your account details below
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />

          <CardContent className="pt-6 space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <field.icon className="w-3.5 h-3.5 text-blue-500" />
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  maxLength={field.maxLength}
                  className="h-11 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-400 rounded-xl transition-colors"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl h-11 transition-colors"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-linear-to-r from-slate-700 to-blue-600 hover:from-slate-800 hover:to-blue-700 text-white gap-2 rounded-xl h-11 shadow-md shadow-blue-500/20 transition-all duration-200"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-4 w-28 dark:bg-slate-800" />
        <Skeleton className="h-20 w-full rounded-2xl dark:bg-slate-800" />
        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardContent className="pt-6 space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32 dark:bg-slate-800" />
                <Skeleton className="h-11 w-full rounded-xl dark:bg-slate-800" />
              </div>
            ))}
            <Skeleton className="h-11 w-full rounded-xl mt-4 dark:bg-slate-800" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
