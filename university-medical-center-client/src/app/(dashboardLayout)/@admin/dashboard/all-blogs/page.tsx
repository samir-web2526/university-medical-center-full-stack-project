import type { Metadata } from "next";
import ReadAllBlogsPage from "@/components/pages/dashboardPages/AdminDashboardPages/ReadAllBlogsPage";

export const metadata: Metadata = {
  title: "All Blogs | UMC, JSTU",
};

export default function Page() {
  return <ReadAllBlogsPage />;
}
