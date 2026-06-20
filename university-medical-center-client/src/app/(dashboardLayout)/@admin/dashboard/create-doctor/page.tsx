import type { Metadata } from "next";
import CreateDoctorPage from '@/components/pages/dashboardPages/AdminDashboardPages/CreateDoctorPage'
import React from 'react'

export const metadata: Metadata = {
  title: "Create Doctor | UMC, JSTU",
};

export default function CreateDoctor() {
  return (
    <div>
        <CreateDoctorPage></CreateDoctorPage>
    </div>
  )
}
