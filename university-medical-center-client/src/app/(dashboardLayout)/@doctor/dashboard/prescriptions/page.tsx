import type { Metadata } from "next";
import MyAllPrescriptionsPage from '@/components/pages/dashboardPages/DoctorDashboardPages/MyAllPrescriptionsPage'
import React from 'react'

export const metadata: Metadata = {
  title: "My Prescriptions | UMC, JSTU",
};

export default function DoctorAllPrescriptions() {
  return (
    <div>
        <MyAllPrescriptionsPage />
    </div>
  )
}
