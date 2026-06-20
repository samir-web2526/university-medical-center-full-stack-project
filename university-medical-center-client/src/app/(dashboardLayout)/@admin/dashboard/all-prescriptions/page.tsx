import type { Metadata } from "next";
import AllPrescriptionsPage from '@/components/pages/dashboardPages/AdminDashboardPages/AllPrescriptionsPage'
import React from 'react'

export const metadata: Metadata = {
  title: "All Prescriptions | UMC, JSTU",
};

export default function AllPrescriptions() {
  return (
    <div>
        <AllPrescriptionsPage></AllPrescriptionsPage>
    </div>
  )
}
