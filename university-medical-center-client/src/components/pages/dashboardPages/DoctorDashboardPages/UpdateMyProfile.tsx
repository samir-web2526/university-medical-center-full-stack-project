"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { UpdateDoctorProfileRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Save, User, Phone, Stethoscope, GraduationCap, Sparkles, Pencil, Camera, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { getMyProfile, updateMyProfile } from "@/services/doctor.service";
import { uploadImage, isValidImageType } from "@/lib/upload";

interface FormState {
  name: string;
  phone: string;
  specialization: string;
  qualification: string;
  bmdcRegistrationNumber: string;
}

export default function UpdateMyProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    bmdcRegistrationNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.user?.name ?? "",
          phone: data.user?.phone ?? "",
          specialization: data.specialization ?? "",
          qualification: data.qualification ?? "",
          bmdcRegistrationNumber: data.bmdcRegistrationNumber ?? "",
        });
        setExistingImageUrl(data.imageUrl ?? data.user?.imageUrl ?? null);
      }
      setLoading(false);
    });
  }, []);

  const handleImageSelect = async (file: File) => {
    if (!isValidImageType(file)) {
      toast.error("Only JPEG, PNG, GIF, WebP images are allowed");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      toast.error("Image must be smaller than 32MB");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadImage(file, `doctor-profile-${Date.now()}`);
      setUploadedImageUrl(result.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setExistingImageUrl(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setImageRemoved(true);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      bmdcRegistrationNumber: form.bmdcRegistrationNumber || null,
      ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
      ...(!uploadedImageUrl && imageRemoved && { imageUrl: "" }),
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
      key: "bmdcRegistrationNumber",
      label: "BMDC Registration Number",
      placeholder: "e.g. A-12345",
      icon: Stethoscope,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/dashboard/me"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Profile
        </Link>

        <div className="rounded-2xl bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Update Profile</h1>
          </div>
          <p className="text-emerald-100 text-sm ml-13">Keep your information accurate so patients can find you easily</p>
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Update your professional details below
            </CardDescription>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />

          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                Profile Photo
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {(imagePreview || existingImageUrl) && !uploading ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview || existingImageUrl!}
                    alt="Profile preview"
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, GIF, WebP (max 32MB)</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={field.key} className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <field.icon className="w-3.5 h-3.5 text-emerald-500" />
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-400 rounded-xl transition-colors"
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
                className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 rounded-xl h-11 shadow-md shadow-emerald-500/20 transition-all duration-200"
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
            {Array.from({ length: 4 }).map((_, i) => (
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
