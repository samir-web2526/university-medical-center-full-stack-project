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
    ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/prescriptions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prescriptions
        </Link>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-20 bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500" />
          <CardContent className="relative pb-5 px-6 pt-0">
            <div className="absolute -top-8 left-6 w-16 h-16 rounded-2xl bg-white shadow-md border-4 border-white flex items-center justify-center">
              <Pill className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="pt-10 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Prescription</h1>
                <p className="text-sm text-slate-500 mt-0.5">{prescription.diagnosis}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-xs ${statusStyles[prescription.status] ?? ""}`}
                >
                  {prescription.status}
                </Badge>
                {prescription.status === "ACTIVE" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
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
            <div className="mt-3 flex items-center gap-4 flex-wrap text-xs text-slate-400">
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

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Diagnosis
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5">
            <p className="text-sm text-slate-800">{prescription.diagnosis}</p>
            {prescription.advice && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-400 mb-0.5">Advice</p>
                <p className="text-sm text-blue-700">{prescription.advice}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-600" /> Medicines
            </h2>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-3">
            {prescription.medicines && prescription.medicines.length > 0 ? (
              prescription.medicines.map((rxMed) => (
                <div
                  key={rxMed.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Pill className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {rxMed.medicine?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {rxMed.dosage && `${rxMed.dosage} · `}
                      {rxMed.duration && `${rxMed.duration} · `}
                      Qty: {rxMed.quantity}
                    </p>
                    {rxMed.instructions && (
                      <p className="text-xs text-slate-500 mt-0.5 italic">
                        {rxMed.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No medicines prescribed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {prescription.status === "CANCELLED" && prescription.cancelReason && (
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-600" /> Cancellation Reason
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-sm text-red-700">{prescription.cancelReason}</p>
                {prescription.cancelledAt && (
                  <p className="text-xs text-red-400 mt-1">
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
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" /> Doctor
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-blue-600">
                    {doctorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{doctorName}</p>
                  <p className="text-xs text-slate-400">
                    {prescription.doctor?.specialization ?? "—"}
                  </p>
                </div>
              </div>
              {prescription.doctor?.qualification && (
                <p className="text-xs text-slate-500">{prescription.doctor.qualification}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600" /> Patient
              </h2>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-600">
                    {studentName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{studentName}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {prescription.student?.studentId ?? "—"}
                  </p>
                </div>
              </div>
              {prescription.student?.department && (
                <p className="text-xs text-slate-500">
                  {prescription.student.department} · {prescription.student.session}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {prescription.visitId && (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-5">
              <Link
                href={`/dashboard/visits/${prescription.visitId}`}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                View related visit
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Prescription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this prescription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Reason *</Label>
            <Textarea
              placeholder="Enter reason for cancellation…"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="resize-none border-slate-200 focus-visible:ring-blue-500 min-h-20"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancel(false)}
              disabled={cancelling}
            >
              Close
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 gap-2"
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
