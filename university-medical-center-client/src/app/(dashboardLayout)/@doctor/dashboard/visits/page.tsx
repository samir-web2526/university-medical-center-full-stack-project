import type { Metadata } from "next";
import MyAllVisitsPage from "@/components/pages/dashboardPages/DoctorDashboardPages/MyAllVisitsPage";

export const metadata: Metadata = {
  title: "My Visits | UMC, JSTU",
};

export default function DoctorVisits() {
  return <MyAllVisitsPage />;
}
