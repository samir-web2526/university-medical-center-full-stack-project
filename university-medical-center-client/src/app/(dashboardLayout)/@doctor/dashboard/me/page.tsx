import type { Metadata } from "next";
import DoctorProfilePage from '@/components/pages/dashboardPages/DoctorDashboardPages/DoctorProfilePage'
import React from 'react'

export const metadata: Metadata = {
  title: "My Profile | UMC, JSTU",
};

export default function ProfileDoctor() {
  return (
    <div>
        <DoctorProfilePage />
    </div>
  )
}
