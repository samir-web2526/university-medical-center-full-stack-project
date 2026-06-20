import type { Metadata } from "next";
import AdminDashboard from '@/components/pages/dashboardPages/AdminDashboardPages/AdminDashboardPage'

export const metadata: Metadata = {
  title: "Admin Dashboard | UMC, JSTU",
};

export default function DashboardPage() {
  return (
    <div>
      <AdminDashboard />
    </div>
  )
}
