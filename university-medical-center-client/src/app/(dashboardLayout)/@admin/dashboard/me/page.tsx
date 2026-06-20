import type { Metadata } from "next";
import AdminProfilePage from '@/components/pages/dashboardPages/AdminDashboardPages/ProfilePage'
import React from 'react'

export const metadata: Metadata = {
  title: "My Profile | UMC, JSTU",
};

export default function AdminProfile() {
  return (
    <div>
        <AdminProfilePage></AdminProfilePage>
    </div>
  )
}
