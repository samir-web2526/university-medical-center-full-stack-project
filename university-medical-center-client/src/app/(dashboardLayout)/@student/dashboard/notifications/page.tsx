import type { Metadata } from "next";
import AllNotificationsPage from '@/components/pages/dashboardPages/studentDashboardPages/AllNotificationsPage';

export const metadata: Metadata = {
  title: "Notifications | UMC, JSTU",
};

export default function Page() {
  return <AllNotificationsPage />;
}
