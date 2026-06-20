import type { Metadata } from "next";
import NotificationsClient from "@/components/pages/dashboardPages/AdminDashboardPages/NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | UMC, JSTU",
};
import { getAllNotifications } from "@/services/notification.service";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? 1);
  const limit = 15;

  const result = await getAllNotifications(page, limit);

  return (
    <NotificationsClient
      initialData={result.data}
      initialPage={page}
      limit={limit}
      error={result.error}
    />
  );
}