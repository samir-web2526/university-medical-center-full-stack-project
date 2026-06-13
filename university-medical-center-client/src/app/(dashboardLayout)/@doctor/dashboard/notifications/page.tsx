import DoctorNotificationsClient from "@/components/pages/dashboardPages/DoctorDashboardPages/DoctorNotificationsClient";
import { getMyNotifications } from "@/services/notification.service";

export default async function DoctorNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? 1);
  const limit = 15;

  const result = await getMyNotifications(page, limit);

  return (
    <DoctorNotificationsClient
      initialData={result.data}
      initialPage={page}
      limit={limit}
      error={result.error}
    />
  );
}
