import type { Metadata } from "next";
import UpdateProfilePage from '@/components/pages/dashboardPages/studentDashboardPages/UpdateProfilePage';

export const metadata: Metadata = {
  title: "Update Profile | UMC, JSTU",
};

export default function Page() {
  return <UpdateProfilePage />;
}
