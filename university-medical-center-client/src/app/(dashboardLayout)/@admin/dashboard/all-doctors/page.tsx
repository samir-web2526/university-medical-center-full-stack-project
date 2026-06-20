import type { Metadata } from "next";
import AllDoctorsPage from '@/components/pages/dashboardPages/AdminDashboardPages/AllDoctorsPage'
import React from 'react'

export const metadata: Metadata = {
  title: "All Doctors | UMC, JSTU",
};

export default function page() {
  return (
    <div>
      <AllDoctorsPage></AllDoctorsPage>
    </div>
  )
}
