import type { Metadata } from "next";
import ProfilePage from '@/components/pages/dashboardPages/studentDashboardPages/ProfilePage';

export const metadata: Metadata = {
  title: "My Profile | UMC, JSTU",
};

export default function Page() {
  return <ProfilePage />;
}
