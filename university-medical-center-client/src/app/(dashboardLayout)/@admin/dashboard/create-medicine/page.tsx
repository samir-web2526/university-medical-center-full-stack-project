import type { Metadata } from "next";
import CreateMedicinePage from '@/components/pages/dashboardPages/AdminDashboardPages/CreateMedicinePage'
import React from 'react'

export const metadata: Metadata = {
  title: "Create Medicine | UMC, JSTU",
};

export default function CreateMedicine() {
  return (
    <div>
        <CreateMedicinePage></CreateMedicinePage>
    </div>
  )
}
