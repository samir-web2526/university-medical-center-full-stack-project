import type { Metadata } from "next";
import MyBlogsPage from "@/components/pages/dashboardPages/DoctorDashboardPages/MyBlogsPage";

export const metadata: Metadata = {
  title: "My Blogs | UMC, JSTU",
};

export default function DoctorMyBlogs() {
  return <MyBlogsPage />;
}
