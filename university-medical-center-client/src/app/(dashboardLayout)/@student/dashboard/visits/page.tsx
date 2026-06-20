import type { Metadata } from "next";
import MyAllVisitsPage from '@/components/pages/dashboardPages/studentDashboardPages/MyAllVisitsPage';

export const metadata: Metadata = {
  title: "My Visits | UMC, JSTU",
};

export default function Page() {
  return <MyAllVisitsPage />;
}
