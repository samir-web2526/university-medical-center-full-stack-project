import type { Metadata } from "next";
import { getPrescriptionById } from '@/services';
import StudentPrescriptionDetailsPage from '@/components/pages/dashboardPages/studentDashboardPages/StudentPrescriptionDetailsPage';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Prescription Details | UMC, JSTU",
  };
}

export default async function PrescriptionDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPrescriptionById(id);

  if (!result.data) {
    return notFound();
  }

  return <StudentPrescriptionDetailsPage prescription={result.data} />;
}
