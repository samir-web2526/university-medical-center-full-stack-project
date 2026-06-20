import type { Metadata } from "next";
import UpdateMyProfile from '@/components/pages/dashboardPages/DoctorDashboardPages/UpdateMyProfile'
import React from 'react'

export const metadata: Metadata = {
  title: "Update Profile | UMC, JSTU",
};

export default function UpdateDoctorProfile() {
  return (
    <div>
        <UpdateMyProfile />
    </div>
  )
}
