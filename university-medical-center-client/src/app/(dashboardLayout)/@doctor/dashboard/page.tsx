import type { Metadata } from "next";
import DoctorDashboardPage from '@/components/pages/dashboardPages/DoctorDashboardPages/DoctorDashboardPage'
import React from 'react'

export const metadata: Metadata = {
  title: "Doctor Dashboard | UMC, JSTU",
};

export default function DashboardPage() {
  return (
    <div>
      <DoctorDashboardPage />
    </div>
  )
}