import type { Metadata } from "next";
import StudentDashboard from '@/components/pages/dashboardPages/studentDashboardPages/StudentDashboardPage'

export const metadata: Metadata = {
  title: "Student Dashboard | UMC, JSTU",
};

export default function DashboardPage() {
  return <StudentDashboard />
}
