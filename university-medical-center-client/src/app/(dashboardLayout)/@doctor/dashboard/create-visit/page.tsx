import type { Metadata } from "next";
import CreateVisitPage from "@/components/pages/dashboardPages/DoctorDashboardPages/CreateVisitPage";

export const metadata: Metadata = {
  title: "Create Visit | UMC, JSTU",
};

export default function VisitCreate() {
  return <CreateVisitPage />;
}
