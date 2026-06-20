import type { Metadata } from "next";
import AllMedicinePage from '@/components/pages/dashboardPages/AdminDashboardPages/AllMedicinesPage'
import React from 'react'

export const metadata: Metadata = {
  title: "All Medicines | UMC, JSTU",
};

export default function Page() {
  return (
    <div>
        <AllMedicinePage></AllMedicinePage>
    </div>
  )
}
