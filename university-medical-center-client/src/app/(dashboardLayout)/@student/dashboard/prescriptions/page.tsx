import type { Metadata } from "next";
import MyPrescriptionsPage from '@/components/pages/dashboardPages/studentDashboardPages/MyPrescriptionsPage';

export const metadata: Metadata = {
  title: "My Prescriptions | UMC, JSTU",
};

export default function Page() {
  return <MyPrescriptionsPage />;
}
