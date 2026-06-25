/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Droplets, User, Mail, Phone, Sparkles, Camera, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getMyProfile, updateMyProfile } from "@/services/student.service";
import type { UpdateStudentProfileRequest } from "@/types";
import { uploadImage, isValidImageType } from "@/lib/upload";

interface FormState {
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  presentAddress: string;
  permanentAddress: string;
  guardianNumber: string;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    bloodGroup: "",
    presentAddress: "",
    permanentAddress: "",
    guardianNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getMyProfile().then(({ data }) => {
      if (data) {
        setForm({
          name: data.user?.name ?? "",
          email: data.user?.email ?? "",
          phone: data.user?.phone ?? "",
          gender: data.gender ?? "",
          bloodGroup: data.bloodGroup ?? "",
          presentAddress: data.presentAddress ?? "",
          permanentAddress: data.permanentAddress ?? "",
          guardianNumber: data.guardianNumber ?? "",
        });
        setExistingImageUrl(data.imageUrl ?? data.user?.imageUrl ?? null);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      const result = await uploadImage(file, `student-profile-${Date.now()}`);
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
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setExistingImageUrl(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setImageRemoved(true);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (form.phone && !/^\d{11}$/.test(form.phone)) {
      toast.error("Phone number must be exactly 11 digits");
      return;
    }
    if (form.guardianNumber && !/^\d{11}$/.test(form.guardianNumber)) {
      toast.error("Guardian number must be exactly 11 digits");
      return;
    }
    setSaving(true);
    const payload: UpdateStudentProfileRequest = {
      gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
      bloodGroup: (form.bloodGroup as any) || undefined,
      presentAddress: form.presentAddress || undefined,
      permanentAddress: form.permanentAddress || undefined,
      guardianNumber: form.guardianNumber || undefined,
      ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
      ...(!uploadedImageUrl && imageRemoved && { imageUrl: "" }),
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/dashboard/me"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl shadow-violet-500/20">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-purple-300/20 blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-200" />
              <span className="text-sm font-medium text-violet-200">Edit Mode</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Update Profile</h1>
            <p className="text-violet-200 text-sm mt-1">Keep your personal information up to date</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-violet-500" />
                Profile Photo
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {(imagePreview || existingImageUrl) && !uploading ? (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview || existingImageUrl!}
                    alt="Profile preview"
                    width={112}
                    height={112}
                    unoptimized
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
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="text-violet-600 dark:text-violet-400 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, GIF, WebP (max 32MB)</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="dark:bg-slate-800" />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-violet-500" />
                Personal Information
              </h3>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                    <User className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                  </div>
                  Full Name
                </Label>
                <Input
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Mail className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    Email
                  </Label>
                  <Input
                    type="email"
                    className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <Phone className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    Phone
                  </Label>
                  <Input
                    className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Enter phone"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                      <User className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                    </div>
                    Gender
                  </Label>
                  <Select value={form.gender} onValueChange={(v) => handleChange("gender", v)}>
                    <SelectTrigger className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700 rounded-xl">
                      {genders.map((g) => (
                        <SelectItem key={g} value={g} className="dark:text-slate-200 dark:focus:bg-slate-700 rounded-lg">
                          {g.charAt(0) + g.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                      <Droplets className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    Blood Group
                  </Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => handleChange("bloodGroup", v)}>
                    <SelectTrigger className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700 rounded-xl">
                      {bloodGroups.map((bg) => (
                        <SelectItem key={bg} value={bg} className="dark:text-slate-200 dark:focus:bg-slate-700 rounded-lg">
                          {bg.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Present Address
                  </Label>
                  <Input
                    className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                    value={form.presentAddress}
                    onChange={(e) => handleChange("presentAddress", e.target.value)}
                    placeholder="Enter present address"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Permanent Address
                  </Label>
                  <Input
                    className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                    value={form.permanentAddress}
                    onChange={(e) => handleChange("permanentAddress", e.target.value)}
                    placeholder="Enter permanent address"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Guardian Number
                </Label>
                <Input
                  className="h-11 border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                  value={form.guardianNumber}
                  onChange={(e) => handleChange("guardianNumber", e.target.value)}
                  placeholder="Enter guardian's contact number"
                  maxLength={11}
                />
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 h-11 rounded-xl"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 h-11 rounded-xl shadow-lg shadow-violet-500/25"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <CardContent className="pt-6 space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
