import type { Metadata } from "next";
import MyAllPatientsPage from '@/components/pages/dashboardPages/DoctorDashboardPages/MyAllPatientsPage';

export const metadata: Metadata = {
  title: "My Patients | UMC, JSTU",
};

export default function Page() {
  return <MyAllPatientsPage />;
}
