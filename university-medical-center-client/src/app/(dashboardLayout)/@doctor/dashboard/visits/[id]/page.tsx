import type { Metadata } from "next";
import { getVisitById } from "@/services";
import VisitDetailsPage from "@/components/pages/dashboardPages/DoctorDashboardPages/VisitDetailsPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Visit Details | UMC, JSTU",
  };
}

export default async function VisitDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getVisitById(id);

  if (!result.data) {
    return notFound();
  }

  return <VisitDetailsPage visit={result.data} />;
}
