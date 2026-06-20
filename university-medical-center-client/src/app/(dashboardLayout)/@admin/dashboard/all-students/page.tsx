import type { Metadata } from "next";
import AllStudentPage from '@/components/pages/dashboardPages/AdminDashboardPages/AllStudentsPage'
import React from 'react'

export const metadata: Metadata = {
  title: "All Students | UMC, JSTU",
};

export default function page() {
  return (
    <div>
      <AllStudentPage></AllStudentPage>
    </div>
  )
}