import type { Metadata } from "next";
import AllVisitsPage from '@/components/pages/dashboardPages/AdminDashboardPages/AllVisitsPage'
import React from 'react'

export const metadata: Metadata = {
  title: "All Visits | UMC, JSTU",
};

export default function AllVisits() {
  return (
    <div>
        <AllVisitsPage></AllVisitsPage>
    </div>
  )
}
