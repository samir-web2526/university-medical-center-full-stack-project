import type { Metadata } from "next";
import { getAllComplaints } from "@/services/complaint.service";
import AllComplaintsPage from "@/components/pages/dashboardPages/AdminDashboardPages/AllComplaintsPage";

export const metadata: Metadata = {
  title: "Student Complaints | UMC, JSTU",
};

export default async function ComplaintsRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page ?? 1);
  const limit = 15;

  const result = await getAllComplaints(page, limit);

  return (
    <AllComplaintsPage
      initialData={result.data}
      initialPage={page}
      limit={limit}
      error={result.error}
    />
  );
}
