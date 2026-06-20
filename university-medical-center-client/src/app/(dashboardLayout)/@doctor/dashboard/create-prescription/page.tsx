import type { Metadata } from "next";
import CreatePrescriptionPage from '@/components/pages/dashboardPages/DoctorDashboardPages/CreatePrescriptionPage'
import React from 'react'

export const metadata: Metadata = {
  title: "Create Prescription | UMC, JSTU",
};

export default function CreatePrescription() {
  return (
    <div>
        <CreatePrescriptionPage></CreatePrescriptionPage>
    </div>
  )
}
