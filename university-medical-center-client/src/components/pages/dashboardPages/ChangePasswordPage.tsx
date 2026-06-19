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
  ArrowLeft, KeyRound, Eye, EyeOff, Lock,
} from "lucide-react";
import Link from "next/link";
import { changePassword } from "@/services/auth.service";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  function validate(): boolean {
    if (!form.oldPassword) {
      toast.error("Current password is required");
      return false;
    }
    if (!form.newPassword) {
      toast.error("New password is required");
      return false;
    }
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (form.oldPassword === form.newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Password changed successfully!");
      router.push("/dashboard/me");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/dashboard/me" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900 dark:text-slate-50">Change Password</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">Update your account password for better security.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="oldPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Current Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                  value={form.oldPassword}
                  onChange={(e) => set("oldPassword", e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className="h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-amber-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
              <li className={form.newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
              <li className={/[A-Z]/.test(form.newPassword) ? "text-green-600" : ""}>One uppercase letter</li>
              <li className={/[0-9]/.test(form.newPassword) ? "text-green-600" : ""}>One number</li>
            </ul>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 gap-2 shadow-md shadow-amber-500/20" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing…</>
                ) : (
                  <><KeyRound className="w-3.5 h-3.5" />Change Password</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
