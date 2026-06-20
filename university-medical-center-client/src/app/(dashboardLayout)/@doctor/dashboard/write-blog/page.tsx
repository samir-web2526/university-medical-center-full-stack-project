import type { Metadata } from "next";
import WriteBlogPage from "@/components/pages/dashboardPages/DoctorDashboardPages/WriteBlogPage";

export const metadata: Metadata = {
  title: "Write Blog | UMC, JSTU",
};

export default function DoctorWriteBlog() {
  return <WriteBlogPage />;
}
