"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Prescription } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Pill,
  User,
  Stethoscope,
  Calendar,
  Ban,
  ClipboardList,
  Sparkles,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import Link from "next/link";
import { cancelPrescription } from "@/services/prescription.service";

export default function PrescriptionDetailsPage({
  prescription,
}: {
  prescription: Prescription;
}) {
  const router = useRouter();
  const studentName = prescription.student?.user?.name ?? "Unknown";
  const doctorName = prescription.doctor?.user?.name ?? "Unknown";

  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!cancelReason.trim()) return toast.error("Please enter a reason");

    setCancelling(true);
    try {
      const { error } = await cancelPrescription(prescription.id, {
        cancelReason: cancelReason.trim(),
      });
      if (error) return toast.error(error);

      toast.success("Prescription cancelled");
      setShowCancel(false);
      setCancelReason("");
      router.refresh();
    } catch {
      toast.error("Failed to cancel prescription");
    } finally {
      setCancelling(false);
    }
  };

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    CANCELLED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prescriptions
        </Link>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 overflow-hidden dark:bg-slate-900">
          <div className="h-24 bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>
          <CardContent className="relative pb-6 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-700 flex items-center justify-center">
              <Pill className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="pt-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Prescription
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{prescription.diagnosis}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-xs rounded-xl ${statusStyles[prescription.status] ?? ""}`}
                >
                  {prescription.status}
                </Badge>
                {prescription.status === "ACTIVE" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 gap-1.5 rounded-xl"
                    onClick={() => {
                      setCancelReason("");
                      setShowCancel(true);
                    }}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 font-mono">
                ID: {prescription.id.slice(0, 8)}...
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Diagnosis
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5">
            <p className="text-sm text-slate-800 dark:text-slate-200">{prescription.diagnosis}</p>
            {prescription.advice && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs text-emerald-500 dark:text-emerald-400 mb-0.5">Advice</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{prescription.advice}</p>
              </div>
            )}
            {prescription.investigation && (
              <div className="mt-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800">
                <p className="text-xs text-teal-500 dark:text-teal-400 mb-0.5">Investigations / Tests</p>
                <p className="text-sm text-teal-700 dark:text-teal-300">{prescription.investigation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Medicines
            </h2>
          </CardHeader>
          <Separator className="dark:bg-slate-800" />
          <CardContent className="pt-5 space-y-3">
            {prescription.medicines && prescription.medicines.length > 0 ? (
              prescription.medicines.map((rxMed) => (
                <div
                  key={rxMed.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {rxMed.medicine?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {rxMed.dosage && `${rxMed.dosage} · `}
                      {rxMed.frequency && `${rxMed.frequency} · `}
                      {rxMed.duration && `${rxMed.duration} · `}
                      Qty: {rxMed.quantity}
                    </p>
                    {rxMed.instructions && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">
                        {rxMed.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center mx-auto mb-3">
                  <Pill className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No medicines prescribed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {prescription.prescriptionImage && (
          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Prescription Image
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5">
              <a
                href={prescription.prescriptionImage}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prescription.prescriptionImage}
                    alt="Prescription"
                    className="w-full max-h-96 object-contain bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View full size</span>
                    </div>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        )}

        {prescription.status === "CANCELLED" && prescription.cancelReason && (
          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-600 dark:text-red-400" /> Cancellation Reason
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">{prescription.cancelReason}</p>
                {prescription.cancelledAt && (
                  <p className="text-xs text-red-400 dark:text-red-500 mt-1">
                    Cancelled on{" "}
                    {new Date(prescription.cancelledAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Doctor
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">
                    {doctorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{doctorName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {prescription.doctor?.specialization ?? "—"}
                  </p>
                </div>
              </div>
              {prescription.doctor?.qualification && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{prescription.doctor.qualification}</p>
              )}
              {prescription.doctor?.bmdcRegistrationNumber && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  BMDC: {prescription.doctor.bmdcRegistrationNumber}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Patient
              </h2>
            </CardHeader>
            <Separator className="dark:bg-slate-800" />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">
                    {studentName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{studentName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {prescription.student?.studentId ?? "—"}
                  </p>
                </div>
              </div>
              {prescription.student?.department && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {prescription.student.department} · {prescription.student.session}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {prescription.visitId && (
          <Card className="border-0 dark:border-slate-800 shadow-md dark:shadow-slate-900/50 dark:bg-slate-900">
            <CardContent className="pt-5">
              <Link
                href={`/dashboard/visits/${prescription.visitId}`}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                View related visit
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              Cancel Prescription
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to cancel this prescription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reason *</Label>
            <Textarea
              placeholder="Enter reason for cancellation…"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="resize-none border-slate-200 dark:border-slate-700 focus-visible:ring-red-500 min-h-20 dark:bg-slate-800 dark:text-white rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancel(false)}
              disabled={cancelling}
              className="rounded-xl border-slate-200 dark:border-slate-700 dark:text-slate-300"
            >
              Close
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 gap-2 rounded-xl"
              onClick={handleCancel}
              disabled={cancelling || !cancelReason.trim()}
            >
              {cancelling ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              Cancel Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
